// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * Converts a c/c++ time_t variable to Date.
 * @param {number} timestamp A c/c++ time_t variable.
 * @return {Date}
 */
function DateFromTimeT(timestamp) {
  return new Date(1000 * timestamp);
}

/**
 * Defines a volume object that contains information about archives' contents
 * and performs operations on these contents.
 * @constructor
 * @param {Decompressor} decompressor The decompressor used to obtain data from
 *     archives.
 * @param {string} fileSystemId The file system id of the volume.
 * @param {Entry} entry The entry corresponding to the volume's archive.
 * @param {File} file The file corresponding to entry.
 */
function Volume(decompressor, fileSystemId, entry, file) {
  /**
   * Used for restoring the opened file entry after resuming the event page.
   * @type {Entry}
   */
  this.entry = entry;

  /** @type {string} */
  this.fileSystemId = fileSystemId;

  /**
   * The decompressor used to obtain data from archives.
   * @type {Decompressor}
   */
  this.decompressor = decompressor;

  /**
   * The volume's metadata. The key is the full path to the file on this volume.
   * For more details see
   * https://developer.chrome.com/apps/fileSystemProvider#type-EntryMetadata
   * @type {Object.<string, EntryMetadata>}
   */
  this.metadata = null;

  /**
   * @type {File}
   * @private
   */
  this.file_ = file;
}

/**
 * @return {boolean} True if volume is ready to be used.
 */
Volume.prototype.isReady = function() {
  return !!this.metadata;
};

/**
 * Reads the metadata of the volume. A single call is sufficient.
 * @param {function} onSuccess Callback to execute on success.
 * @param {function} onError Callback to execute on error.
 * @param {number=} opt_requestId Request id is optional for the case of
 *     mounting the volume. Should NOT be used for other case scenarios as
 *     this function doesn't ensure a unique requestId with every call.
 */
Volume.prototype.readMetadata = function(onSuccess, onError, opt_requestId) {
  // -1 is ok as usually the request_ids used by flleSystemProvider are greater
  // than 0.
  var requestId = opt_requestId ? opt_requestId : -1;
  this.decompressor.readMetadata(requestId, function(metadata) {
    // TODO(cmihail): Consider using a tree format instead of a flat
    // organization for this.metadata.
    this.metadata = {};
    for (var path in metadata) {
      this.metadata[path] = metadata[path];
      this.metadata[path].size = parseInt(metadata[path].size);
      this.metadata[path].modificationTime =
          DateFromTimeT(metadata[path].modificationTime);
    }

    onSuccess();
  }.bind(this), onError);
};

/**
 * Obtains the metadata for a single entry in the archive. Assumes metadata is
 * loaded.
 * @param {fileSystemProvider.GetMetadataRequestedOptions} options Options for
 *     getting the metadata of an entry.
 * @param {function} onSuccess Callback to execute on success.
 * @param {function} onError Callback to execute on error.
 */
Volume.prototype.onGetMetadataRequested = function(options, onSuccess,
                                                   onError) {
  var entryMetadata = this.metadata[options.entryPath];
  if (!entryMetadata)
    onError('NOT_FOUND');
  else
    onSuccess(entryMetadata);
};

/**
 * Reads a directory contents from metadata. Assumes metadata is loaded.
 * @param {fileSystemProvider.ReadDirectoryRequestedOptions>} options Options
 *     for reading the contents of a directory.
 * @param {function} onSuccess Callback to execute on success.
 * @param {function} onError Callback to execute on error.
 */
Volume.prototype.onReadDirectoryRequested = function(options, onSuccess,
                                                     onError) {
  var directoryMetadata = this.metadata[options.directoryPath];
  if (!directoryMetadata) {
    onError('NOT_FOUND');
    return;
  }
  if (!directoryMetadata.isDirectory) {
    onError('NOT_A_DIRECTORY');
    return;
  }

  // Retrieve directory contents from metadata.
  var entries = [];
  for (var entry in this.metadata) {
    // Do not add itself on the list.
    if (entry == options.directoryPath)
      continue;
    // Check if the entry is a child of the requested directory.
    if (entry.indexOf(options.directoryPath) != 0)
      continue;
    // Restrict to direct children only.
    if (entry.substring(options.directoryPath.length + 1).indexOf('/') != -1)
      continue;

    entries.push(this.metadata[entry]);
  }

  onSuccess(entries, false /* Last call. */);
};

/**
 * Opens a file for read or write.
 * @param {fileSystemProvider.OpenFileRequestedOptions} options Options for
 *     opening a file.
 * @param {function} onSuccess Callback to execute on success.
 * @param {function} onError Callback to execute on error.
 */
Volume.prototype.onOpenFileRequested = function(options, onSuccess, onError) {
  // TODO(cmihail): Implement.
  onError('INVALID_OPERATION');
};

/**
 * Closes a file identified by options.openRequestId.
 * @param {fileSystemProvider.CloseFileRequestedOptions} options Options for
 *     closing a file.
 * @param {function} onSuccess Callback to execute on success.
 * @param {function} onError Callback to execute on error.
 */
Volume.prototype.onCloseFileRequested = function(options, onSuccess, onError) {
  // TODO(cmihail): Implement.
  onError('INVALID_OPERATION');
};

/**
 * Reads the contents of a file identified by options.openRequestId.
 * @param {fileSystemProvider.ReadFileRequestedOptions} options Options for
 *     reading a file's contents.
 * @param {function} onSuccess Callback to execute on success.
 * @param {function} onError Callback to execute on error.
 */
Volume.prototype.onReadFileRequested = function(options, onSuccess, onError) {
  // TODO(cmihail): Implement.
  onError('INVALID_OPERATION');
};
