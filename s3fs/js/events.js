// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../../shared/util');
var getError = require('./errors');

/**
 * Fetches the metadata associated with the file at the given path from the
 * WebDAV server.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the metadata was
 *     fetched successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to fetch the metadata.
 */

var onCloseFileRequested = function(options, onSuccess, onError) {
  if (!s3fs.openedFiles[options.openRequestId]) {
    onError('INVALID_OPERATION');
  } else {
    delete s3fs.openedFiles[options.openRequestId];
    onSuccess();
  }
};

/**
 * Responds to a request to copy an entry.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the entry was copied
 *     successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to copy the entry.
 */
var onCopyEntryRequested = function(options, onSuccess, onError) {
  // Strip the leading slash, since not used internally.
  var targetPath = options.targetPath.substring(1);

  var copySource = encodeURIComponent(s3fs.defaultParameters.Bucket +
    options.sourcePath);

  var parameters = s3fs.parameters({
    Key: targetPath,
    CopySource: copySource
  });

  // TODO(lavelle): handle the recursive/directory case.

  s3fs.s3.copyObject(parameters, function(error) {
    if (error) {
      onError(error);
    } else {
      onSuccess();
    }
  });
};

/**
 * Responds to a request to create a new file.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the file was created
 *     successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to create the file.
 */
var onCreateFileRequested = function(options, onSuccess, onError) {
  // Strip the leading slash, since not used internally.
  var path = options.filePath.substring(1);

  var parameters = s3fs.parameters({
    Key: path,
    Body: new ArrayBuffer(),
    ContentLength: 0
  });

  // TODO(lavelle): handle the case where it already exists here.
  // Do nothing, or report an error?

  s3fs.s3.putObject(parameters, function(error) {
    if (error) {
      onError(error);
    } else {
      onSuccess();
    }
  });
};

/**
 * Fetches the metadata associated with the file at the given path from the
 * WebDAV server.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the metadata was
 *     fetched successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to fetch the metadata.
 */
var onGetMetadataRequested = function(options, onSuccess, onError) {
  // Remove the leading slash from the path -- this isn't used in S3 keys.
  var path = options.entryPath.substring(1);

  var metadata;
  // Handle the special case for the root directory.
  if (path === '') {
    metadata = util.makeDirectory('/');
    onSuccess(metadata, false);
    return;
  }

  // First check if the path corresponds to a valid directory by seeing if
  // there are any objects in the bucket with the path as a prefix.
  var parameters = s3fs.parameters({
    Prefix: path + '/',
    Delimiter: '/'
  });

  s3fs.s3.listObjects(parameters, function(error, data) {
    if (data && data.Contents.length > 0) {
      metadata = util.makeDirectory(path);
      onSuccess(metadata, false);
      return;
    }

    // If it isn't a directory, it might still be a file, so send another
    // request to fetch the metadata for that.
    parameters = s3fs.parameters({Key: path});

    s3fs.s3.headObject(parameters, function(error, data) {
      // If there's still an error, it's not a file or a directory, so call
      // the error callback.
      if (error) {
        onError(error);
        return;
      }

      // If there's no error, it's a file, so convert the metadata into the
      // right format and return it to the API.
      metadata = {
        isDirectory: false,
        name: path,
        size: data.ContentLength,
        modificationTime: new Date(data.LastModified),
        mimeType: data.ContentType
      };

      onSuccess(metadata, false);
    });
  });
};

/**
 * @private
 */
var deleteFile = function(path, onSuccess, onError) {
  var parameters = s3fs.parameters({
    Key: path
  });

  s3fs.s3.deleteObject(parameters, function(error) {
    if (error) {
      onError(error);
    } else {
      onSuccess();
    }
  });
};

/**
 * @private
 */
var deleteRecursive = function(entryPath, onSuccess, onError) {
  onReadDirectoryRequested({directoryPath: entryPath}, function(list) {
    var parameters = s3fs.parameters({
      Delete: list.map(function(item) {
        return {Key: entryPath + '/' + item.name};
      })
    });

    s3fs.s3.deleteObjects(parameters, function(error) {
      if (error) {
        onError(error);
      } else {
        onSuccess();
      }
    });
  });
};

/**
 * Responds to a request to delete a file or directory.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the entry was deleted
 *     successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to delete the entry.
 */
var onDeleteEntryRequested = function(options, onSuccess, onError) {
  // Strip the leading slash, since not used internally.
  var path = options.entryPath.substring(1);

  if (options.recursive) {
    // Always delete any entry with the recursive flag.
    deleteRecursive(options.entryPath, onSuccess, onError);
    return;
  }

  onGetMetadataRequested({entryPath: options.entryPath}, function(metadata) {
    if (metadata.isDirectory) {
      onReadDirectoryRequested({directoryPath: options.entryPath}, function(list) {
        if (list.length === 0) {
          // Empty directory case will never happen in S3, because of the flat
          // filesystem - when the last file with a given prefix is removed,
          // the 'directory' will no longer appear in any of our wrapper methods
          // (readDirectory, getMetadata etc). So all that needs to be done here
          // is to report a success.
          onSuccess();
        }
        else {
          // Refuse to delete non-empty directories without the recursive flag.
          onError('NOT_EMPTY');
        }
      }, onError);
    } else {
      // Always delete files without the recursive flag.
      deleteFile(path, onSuccess, onError);
    }
  }, onError);
};

/**
 * Responds to a request to open a file.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the file was opened
 *      successfully.
 * @param {function} onError Function to be called if an error occured while
 *      attempting to open the file.
 */
var onOpenFileRequested = function(options, onSuccess, onError) {
  if (!util.isRequestValid(options)) {
    onError('INVALID_OPERATION');
  } else {
    if (options.create) {
      // TODO(lavelle): create file here.
    }

    s3fs.openedFiles[options.requestId] = options.filePath;
    onSuccess();
  }
};

/**
 * Responds to a request for the contents of a directory.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the directory was
 *     read successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to read the directory.
 */
var onReadDirectoryRequested = function(options, onSuccess, onError) {
  // Remove the leading slash from the file path - not used in S3 bucket keys.
  var path = options.directoryPath.substring(1);

  var parameters = s3fs.parameters({
    Prefix: path,
    Delimiter: '/'
  });

  s3fs.s3.listObjects(parameters, function(error, data) {
    if (error) {
      onError(error);
      return;
    }

    var files = data.Contents.map(function(item) {
      // Content type is omitted from the results as it is not present in the
      // S3 API response.
      return {
        isDirectory: false,
        name: item.Key,
        size: item.Size,
        modificationTime: item.LastModified,
      };
    });

    var directories = data.CommonPrefixes.map(function(item) {
      var name = item.Prefix.substring(0, item.Prefix.length - 1);

      return util.makeDirectory(name);
    });

    var list = directories.concat(files);

    // Return it to the API.
    onSuccess(list, false);
  });
};

/**
 * Responds to a request for the contents of a file.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the file was
 *     read successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to read the file.
 */
var onReadFileRequested = function(options, onSuccess, onError) {
  if (!(options.openRequestId in s3fs.openedFiles)) {
    onError('INVALID_OPERATION');
    return;
  }

  // Strip the leading slash, since not used internally.
  var path = s3fs.openedFiles[options.openRequestId].substring(1);

  // Calculate the index of the last byte to fetch. Subtract 1 because HTTP
  // byte ranges are inclusive.
  var end = options.offset + options.length - 1;

  var parameters = s3fs.parameters({
    Key: path,
    Range: 'bytes=' + options.offset + '-' + end
  });

  s3fs.s3.getObject(parameters, function(error, data) {
    if (error) {
      onError(error);
    } else {
      onSuccess(data.Body.toArrayBuffer(), false);
    }
  });
};

/**
 * Responds to a request to truncate the contents of a file.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the file was
 *     read successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to read the file.
 */
var onTruncateRequested = function(options, onSuccess, onError) {
  // Strip the leading slash, since not used internally.
  var path = options.filePath.substring(1);

  var readParameters = s3fs.parameters({
    Key: path
  });

  s3fs.s3.getObject(readParameters, function(error, data) {
    if (error) {
      onError(error);
    } else {
      var buffer = data.Body.toArrayBuffer();

      var write = function(data) {
        var writeParameters = s3fs.parameters({
          Key: path,
          Body: data,
          ContentLength: data.byteLength
        });

        s3fs.s3.putObject(writeParameters, function(error) {
          if (error) {
            onError(error);
          } else {
            onSuccess();
          }
        });
      };

      if (options.length < buffer.byteLength) {
        // Truncate.
        write(buffer.slice(0, options.length));
      } else {
        // Pad with null bytes.
        var diff = options.length - buffer.byteLength;
        var blob = new Blob([buffer, new Array(diff + 1).join('\0')]);
        util.blobToArrayBuffer(blob, write);
      }
    }
  });
};

/**
 * Responds to a request to write some data to a file.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the file was
 *     read successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to read the file.
 */
var onWriteFileRequested = function(options, onSuccess, onError) {
  if (!(options.openRequestId in s3fs.openedFiles)) {
    onError('INVALID_OPERATION');
    return;
  }

  // Strip the leading slash, since not used internally.
  var path = s3fs.openedFiles[options.openRequestId].substring(1);

  // Calculate the index of the last byte to fetch. Subtract 1 because HTTP
  // byte ranges are inclusive.
  var end = options.offset + options.length - 1;

  var body = options.data.slice(options.offset, end);

  var parameters = s3fs.parameters({
    Key: path,
    Body: body,
    ContentLength: body.byteLength
  });

  s3fs.s3.putObject(parameters, function(error) {
    if (error) {
      onError(error);
    } else {
      onSuccess();
    }
  });
};

/**
 * Responds to a request to move an entry.
 * @param {Object} options Input options.
 * @param {function} onSuccess Function to be called if the entry was copied
 *     successfully.
 * @param {function} onError Function to be called if an error occured while
 *     attempting to copy the entry.
 */
var onMoveEntryRequested = function(options, onSuccess, onError) {
  // Strip the leading slash, since not used internally.
  var targetPath = options.targetPath.substring(1);

  var copySource = encodeURIComponent(s3fs.defaultParameters.Bucket +
    options.sourcePath);

  // The AWS SDK has no moveObject method, so we emulate it with a copy from A
  // to B followed by a delete of A.

  var copyParameters = s3fs.parameters({
    Key: targetPath,
    CopySource: copySource
  });

  var deleteParameters = s3fs.parameters({
    Key: options.sourcePath.substring(1)
  });

  // TODO(lavelle): handle the recursive/directory case.

  s3fs.s3.copyObject(copyParameters, function(error) {
    if (error) {
      onError(error);
    } else {
      s3fs.s3.deleteObject(deleteParameters, function(error) {
        if (error) {
          onError(error);
        }
        else {
          onSuccess();
        }
      });
    }
  });
};

module.exports = {
  onCloseFileRequested: onCloseFileRequested,
  onOpenFileRequested: onOpenFileRequested,
  onReadFileRequested: onReadFileRequested,
  onCreateFileRequested: onCreateFileRequested,
  onWriteFileRequested: onWriteFileRequested,
  onTruncateRequested: onTruncateRequested,
  onDeleteEntryRequested: onDeleteEntryRequested,
  onCopyEntryRequested: onCopyEntryRequested,
  onMoveEntryRequested: onMoveEntryRequested,
  onGetMetadataRequested: onGetMetadataRequested,
  onReadDirectoryRequested: onReadDirectoryRequested
};
