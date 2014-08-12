// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

/**
 * The main namespace for the extension.
 */
var app = {
  /**
   *
   * Multiple volumes can be opened at the same time. The key is the
   * fileSystemId, which is the same as the file's displayPath.
   * The value is a Volume object.
   * @type {Object.<string, Volume>}
   */
  volumes: {},

  /**
   * The NaCl module containing the logic for decompressing archives.
   * @type {Object}
   * @private
   */
  naclModule_: null,

  /**
   * Function called on NaCl module's load. Registered by common.js.
   * @private
   */
  moduleDidLoad_: function() {
    app.naclModule_ = document.getElementById('nacl_module');
  },

  /**
   * Function called on receiving a message from NaCl module. Registered by
   * common.js.
   * @param {Object} message The message received from NaCl module.
   * @private
   */
  handleMessage_: function(message) {
    // Get mandatory fields in a message.
    var operation = message.data[request.Key.OPERATION];
    console.assert(operation != undefined,  // Operation can be 0.
        'No NaCl operation: ' + operation + '.');

    // Handle general errors unrelated to a volume.
    if (operation == request.Operation.ERROR) {
      console.error(message.data[request.Key.ERROR]);
      return;
    }

    var fileSystemId = message.data[request.Key.FILE_SYSTEM_ID];
    console.assert(fileSystemId, 'No NaCl file system id.');

    var requestId = message.data[request.Key.REQUEST_ID];
    console.assert(!isNaN(requestId), 'No NaCl request id.');

    var volume = app.volumes[fileSystemId];
    console.assert(volume, 'No volume for: ' + fileSystemId + '.');

    volume.decompressor.processMessage(message.data, operation,
                                       Number(requestId));
  },

  /**
   * Saves state in case of restarts, event page suspend, crashes, etc.
   * @private
   */
  saveState_: function() {
    var state = {};
    for (var volumeId in app.volumes) {
      var entryId = chrome.fileSystem.retainEntry(app.volumes[volumeId].entry);
      state[volumeId] = {
        entryId: entryId
      };
    }
    chrome.storage.local.set({state: state});
  },

  /**
   * Restores metadata for the passed file system id.
   * @param {string} fileSystemId The file system id.
   * @param {number} requestId The request id.
   * @param {function} onSuccess Callback to execute on success.
   * @param {function} onError Callback to execute on error.
   * @private
   */
  restoreState_: function(fileSystemId, requestId, onSuccess, onError) {
    // Check if metadata for the given file system is alread in memory.
    var volume = app.volumes[fileSystemId];
    if (volume) {
      if (volume.isReady())
        onSuccess();
      else
        onError('FAILED');
      return;
    }

    chrome.storage.local.get(['state'], function(result) {
      if (!app.naclModuleIsLoaded()) {
        onError('FAILED');
        return;
      }

      chrome.fileSystem.restoreEntry(result.state[fileSystemId].entryId,
          function(entry) {
            entry.file(function(file) {
              app.loadVolume(fileSystemId, entry, file, onSuccess, onError,
                             requestId);
            });
          });
    });
  },

  /**
   * Creates a volume and loads its metadata.
   * @param {string} fileSystemId The file system id of the volume to create.
   * @param {Entry} entry The entry corresponding to the volume's archive.
   * @param {File} file The file corresponding to entry.
   * @param {function} onSuccess Callback to execute on successful loading.
   * @param {function} onError Callback to execute on error.
   * @param {number=} opt_requestId An optional request id. First load doesn't
   *     require a request id, but any subsequent loads after suspends or
   *     restarts should use the request id of the operation that called
   *     restoreState_.
   */
  loadVolume: function(fileSystemId, entry, file, onSuccess, onError,
                       opt_requestId) {
    // Operation already in progress. We must do the check here due to
    // asynchronous calls.
    if (app.volumes[fileSystemId]) {
      onError('FAILED');
      return;
    }
    app.volumes[fileSystemId] =
        new Volume(new Decompressor(app.naclModule_, fileSystemId),
                   fileSystemId, entry, file);
    app.volumes[fileSystemId].readMetadata(onSuccess, onError, opt_requestId);
  },

  /**
   * @return {boolean} True if NaCl module is loaded.
   */
  naclModuleIsLoaded: function() {
    return !!app.naclModule_;
  },

  /**
   * Loads the NaCl module.
   * @param {string} pathToConfigureFile Path to the module's configuration
   *     file, which should be a .nmf file.
   * @param {string} mimeType The type of the NaCl executable (e.g. .nexe or
   *     .pexe).
   * @param {function=} opt_onModuleLoad Optional callback to execute on NaCl
   *     module load.
   */
  loadNaclModule: function(pathToConfigureFile, mimeType, opt_onModuleLoad) {
    var elementDiv = document.createElement('div');
    elementDiv.addEventListener('load', app.moduleDidLoad_, true);
    elementDiv.addEventListener('message', app.handleMessage_, true);
    if (opt_onModuleLoad)
      elementDiv.addEventListener('load', opt_onModuleLoad, true);

    var elementEmbed = document.createElement('embed');
    elementEmbed.id = 'nacl_module';
    elementEmbed.style.width = 0;
    elementEmbed.style.height = 0;
    elementEmbed.src = pathToConfigureFile;
    elementEmbed.type = mimeType;
    elementDiv.appendChild(elementEmbed);

    document.body.appendChild(elementDiv);
  },

  /**
   * Unmounts a volume and updates the local storage state.
   * @param {fileSystemProvider.UnmountRequestedOptions} options Options for
   *     unmount event.
   * @param {function} onSuccess Callback to execute on success.
   * @param {function} onError Callback to execute on error.
   */
  onUnmountRequested: function(options, onSuccess, onError) {
    chrome.fileSystemProvider.unmount({
      fileSystemId: options.fileSystemId},
      function() {
        delete app.volumes[options.fileSystemId];
        app.saveState_();  // Remove volume from local storage state.
        onSuccess();
      },
      function() {
        onError('FAILED');
      });
  },

  /**
   * Obtains metadata about a file system entry.
   * @param {fileSystemProvider.GetMetadataRequestedOptions} options Options for
   *     getting the metadata of an entry.
   * @param {function} onSuccess Callback to execute on success.
   * @param {function} onError Callback to execute on error.
   */
  onGetMetadataRequested: function(options, onSuccess, onError) {
    app.restoreState_(options.fileSystemId, options.requestId, function() {
      app.volumes[options.fileSystemId].onGetMetadataRequested(
          options, onSuccess, onError);
    }, onError);
  },

  /**
   * Reads a directory entries.
   * @param {fileSystemProvider.ReadDirectoryRequestedOptions>} options Options
   *     for reading the contents of a directory.
   * @param {function} onSuccess Callback to execute on success.
   * @param {function} onError Callback to execute on error.
   */
  onReadDirectoryRequested: function onRe(options, onSuccess, onError) {
    app.restoreState_(options.fileSystemId, options.requestId, function() {
      app.volumes[options.fileSystemId].onReadDirectoryRequested(
          options, onSuccess, onError);
    }, onError);
  },

  /**
   * Opens a file for read or write.
   * @param {fileSystemProvider.OpenFileRequestedOptions} options Options for
   *     opening a file.
   * @param {function} onSuccess Callback to execute on success.
   * @param {function} onError Callback to execute on error.
   */
  onOpenFileRequested: function(options, onSuccess, onError) {
    app.restoreState_(options.fileSystemId, options.requestId, function() {
      app.volumes[options.fileSystemId].onOpenFileRequested(
          options, onSuccess, onError);
    }, onError);
  },

  /**
   * Closes a file identified by options.openRequestId.
   * @param {fileSystemProvider.CloseFileRequestedOptions} options Options for
   *     closing a file.
   * @param {function} onSuccess Callback to execute on success.
   * @param {function} onError Callback to execute on error.
   */
  onCloseFileRequested: function(options, onSuccess, onError) {
    app.restoreState_(options.fileSystemId, options.requestId, function() {
      app.volumes[options.fileSystemId].onCloseFileRequested(
          options, onSuccess, onError);
    }, onError);
  },

  /**
   * Reads the contents of a file identified by options.openRequestId.
   * @param {fileSystemProvider.ReadFileRequestedOptions} options Options for
   *     reading a file's contents.
   * @param {function} onSuccess Callback to execute on success.
   * @param {function} onError Callback to execute on error.
   */
  onReadFileRequested: function(options, onSuccess, onError) {
    app.restoreState_(options.fileSystemId, options.requestId, function() {
      app.volumes[options.fileSystemId].onReadFileRequested(
          options, onSuccess, onError);
    });
  },

  /**
   * Creates a volume for every opened file with the extension or mime type
   * declared in the manifest file.
   * @param {Object} launchData The data pased on launch.
   */
  onLaunched: function(launchData) {
    if (!app.naclModuleIsLoaded()) {
      console.log('Module not loaded yet.');
      return;
    }

    launchData.items.forEach(function(item) {
      chrome.fileSystem.getDisplayPath(item.entry, function(displayPath) {
        item.entry.file(function(file) {
          app.loadVolume(displayPath, item.entry, file, function() {
            // Mount the volume and save its information in local storage
            // in order to be able to recover the metadata in case of
            // restarts, system crashes, etc.
            chrome.fileSystemProvider.mount(
                {fileSystemId: displayPath, displayName: item.entry.name},
                function() { app.saveState_(); },
                function() { console.error('Failed to mount.'); });
          }, function(error) {
            console.log('Unable to read metadata: ' + error + '.');
          });
        });
      });
    });
  },

  /**
   * Restores the state on a profile startup.
   */
  onStartup: function() {
    chrome.storage.local.get(['state'], function(result) {
      // Nothing to change.
      if (!result.state)
        return;

      // TODO(cmihail): Nothing to do for now, but will require logic for
      // removing opened files information from state.
    });
  },

  /**
   * Saves the state before suspending the event page, so we can resume it
   * once new events arrive.
   */
  onSuspend: function() {
    app.saveState_();
  }
};
