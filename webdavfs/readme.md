# WebDAVFS

WebDAVFS is an extension for ChromeOS for accessing files on a WebDAV server directly through the Files app.

## Overview

The project provides a wrapper between the WebDAV protocol and Chrome's `fileSystemProvider` API. Currently this API is read-only, and therefore creating or writing to files is not supported. This will be added when the Chrome API is updated.

## Building

First make sure you have Git, Node.js, Google Chrome and Make installed. Then run the following commands.

```
npm install -g grunt-cli
git clone https://github.com/google/chromeos-filesystems
cd chromeos-filesystems/webdavfs
make install
make grunt
```

This will install all the dependencies. You can then run `make zip` to bundle the extension up into a ZIP archive.

## Installing

To access it from a locally running instance of ChromiumOS for testing, copy it into your downloads folder. This is accessible from within the ChromiumOS file browser. On Linux the path is the `~/Downloads`. Then open the ChromiumOS file browser and the Chromium extensions page (at `chrome://extensions`), and drag davfs.crx across to install it.

## Testing

### Starting the server

All types of testing need a WebDAV server to connect to. A Node.js WebDAV server is bundled in this repository for this purpose. To start it, run `node server.js &` from the `testserver` directory. It serves up dummy content, directories containing simple text files of a few characters each.

### Manual

To test the extension itself, start the server and install the extension as above. Click on the WebDAV entry in the sidebar of the Files app and explore the directories.

### Automatic

To run the unit test suite, start the server and then run `grunt test`. The results will appear in your console.

## License

BSD
