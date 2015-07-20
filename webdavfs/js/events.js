// Copyright 2014 The Chromium Authors. All rights reserved.

// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

'use strict';

var util = require('../../shared/util');

/**
 * Responds to a request to close a file.
 * @param {object} options Input options.
 * @param {function} onSuccess Function to be called if the file was closed
 *     successfully.
 * @param {function} onError Function to be called if an error occurred while
 *     attempting to close the file.
 */
var onCloseFileRequested = function(options, onSuccess, onError) {
  if (!options.openRequestId) {
    onError('INVALID_OPERATION');
    return;
  }

  if (!webDAVFS.openedFiles[options.openRequestId]) {
    onError('INVALID_OPERATION');
  } else {
    delete webDAVFS.openedFiles[options.openRequestId];
    onSuccess();
  }
};

/**
 * Fetches the metadata associated with the file at the given path from the
 * WebDAV server.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the metadata was
 *     fetched successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to fetch the metadata.
 */
var onGetMetadataRequested = function(options, onSuccess, onError) {
  if (!options.entryPath) {
    onError('INVALID_OPERATION');
    return;
  }

  var path = options.entryPath;

  webDAVFS.getMetadata({
    path: path,
    onSuccess: function(metadata) {
      onSuccess(metadata, false);
    },
    onError: onError
  });
};

/**
 * Responds to a request to open a file.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the file was opened
 *     successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to open the file.
 */
var onOpenFileRequested = function(options, onSuccess, onError) {
  if (!util.isRequestValid(options)) {
    onError('INVALID_OPERATION');
  }
  else {
    if (options.create) {
      // TODO(lavelle): create file here.
    }

    webDAVFS.openedFiles[options.requestId] = options.filePath;
    onSuccess();
  }
};

/**
 * Responds to a request for the contents of a directory.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the directory was
 *     read successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to read the directory.
 */
var onReadDirectoryRequested = function(options, onSuccess, onError) {
  if (!options.directoryPath) {
    onError('INVALID_OPERATION');
    return;
  }

  webDAVFS.readDirectory({
    path: options.directoryPath,
    onSuccess: function(list) {
      onSuccess(list, false);
    },
    onError: onError
  });
};

/**
 * Responds to a request to read the contents of a file.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the file was
 *     read successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to read the file.
 */
var onReadFileRequested = function(options, onSuccess, onError) {
  if (!options.openRequestId) {
    onError('INVALID_OPERATION');
    return;
  }

  var path = webDAVFS.openedFiles[options.openRequestId];

  if (!path) {
    onError('INVALID_OPERATION');
    return;
  }

  webDAVFS.readFile({
    path: path,
    range: {
      start: options.offset,
      end: options.offset + options.length
    },
    onSuccess: function(data) {
      onSuccess(data, false);
    },
    onError: onError
  });
};

/**
 * Responds to a request to write some data to a file.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the file was
 *     written to successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to write to the file.
 */
var onWriteFileRequested = function(options, onSuccess, onError) {
  if (!options.openRequestId) {
    onError('INVALID_OPERATION');
    return;
  }

  var path = webDAVFS.openedFiles[options.openRequestId];

  if (!path) {
    onError('INVALID_OPERATION');
    return;
  }

  var end = options.offset + options.length - 1;
  var body = options.data.slice(options.offset, end);

  webDAVFS.writeFile({
    path: path,
    data: body,
    onSuccess: onSuccess,
    onError: onError
  });
};

/**
 * Responds to a request to truncate the contents of a file.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the file was
 *     truncated successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to truncate the file.
 */

var onTruncateRequested = function(options, onSuccess, onError) {
  if (!options.filePath) {
    onError('INVALID_OPERATION');
    return;
  }

  var path = options.filePath.substring(1);

  var write = function(data) {
    webDAVFS.writeFile({
      path: path,
      data: data,
      onSuccess: onSuccess,
      onError: onError
    });
  };

  webDAVFS.readFile({
    path: path,
    onSuccess: function(data) {
      if (options.length < data.byteLength) {
        // Truncate.
        write(data.slice(0, options.length));
      } else {
        // Pad with null bytes.
        var diff = options.length - data.byteLength;
        var blob = new Blob([data, new Array(diff + 1).join('\0')]);
        util.blobToArrayBuffer(blob, write);
      }
    },
    onError: onError
  });
};

/**
 * Responds to a request to create a new file.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the file was
 *     created successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to create the file.
 */
var onCreateFileRequested = function(options, onSuccess, onError) {
  if (!options.filePath) {
    onError('INVALID_OPERATION');
    return;
  }

  webDAVFS.writeFile({
    path: options.filePath.substring(1),
    data: new ArrayBuffer(),
    onSuccess: onSuccess,
    onError: onError
  });
};

/**
 * Responds to a request to copy a file or directory to a new location.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the entry was
 *     copied successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to copy the entry.
 */
var onCopyEntryRequested = function(options, onSuccess, onError) {
  webDAVFS.copyEntry({
    sourcePath: options.sourcePath.substring(1),
    targetPath: options.targetPath.substring(1),
    onSuccess: onSuccess,
    onError:  onError
  });
};

/**
 * Responds to a request to move a file or directory to a new location.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the entry was
 *     copied successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to copy the entry.
 */
var onMoveEntryRequested = function(options, onSuccess, onError) {
  webDAVFS.moveEntry({
    sourcePath: options.sourcePath.substring(1),
    targetPath: options.targetPath.substring(1),
    onSuccess: onSuccess,
    onError: onError
  });
};

/**
 * Responds to a request to delete a file or directory.
 * @param {Object} options Input options.
 * @param {Function} onSuccess Function to be called if the file was
 *     deleted successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to delete the file.
 */
var onDeleteEntryRequested = function(options, onSuccess, onError) {
  if (!options.entryPath) {
    onError('INVALID_OPERATION');
    return;
  }

  var path = options.entryPath.substring(1);

  var doDelete = function() {
    webDAVFS.deleteEntry({
      path: path,
      onError: onError,
      onSuccess: onSuccess
    });
  };

  // Delete always works if recursive flag is passed.
  if (options.recursive) {
    doDelete();
    return;
  }

  var onMetadataSuccess = function(metadata) {
    if (metadata.isDirectory) {
      webDAVFS.readDirectory({
        path: path,
        onSuccess: function(list) {
          if (list.length === 0) {
            // Delete works without recursive flag for empty directories
            doDelete();
          } else {
            // Delete fails without recursive flag for non-empty directories.
            onError('NOT_EMPTY');
          }
        },
        onError: onError
      });
    } else {
      // Delete works without recursive flag for files.
      doDelete();
    }
  };

  webDAVFS.getMetadata({
    path: path,
    onError: onError,
    onSuccess: onMetadataSuccess
  });
};

/**
 * Responds to a request to unmount the file system.
 * @param {Object} inputOptions Input options.
 * @param {Function} onSuccess Function to be called if the file system was
 *     unmounted successfully.
 * @param {Function} onError Function to be called if an error occurred while
 *     attempting to umount the file system.
 */
var onUnmountRequested = function(inputOptions, onSuccess, onError) {
  var options = {
    fileSystemId: webDAVFS.options.fileSystemId
  };

  chrome.fileSystemProvider.unmount(options, onSuccess, onError);
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
  onReadDirectoryRequested: onReadDirectoryRequested,
  onUnmountRequested: onUnmountRequested
};
