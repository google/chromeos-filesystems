# S3FS

S3FS is a Chrome extension for ChromeOS for accessing files stored in an Amazon S3 bucket directly through the Files app.

## Overview

The project provides the glue between the S3 API and Chrome's `fileSystemProvider` API. Currently this API is read-only, and therefore creating or writing to files in a bucket is not supported. This will be added when the Chrome API is updated.

## Building

First make sure you have Git, Node.js, Google Chrome and Make installed. Then run the following commands.

```bash
$ npm install -g grunt-cli
$ git clone https://github.com/google/chromeos-filesystems
$ cd chromeos-filesystems/s3fs
$ make install
$ make libs
```

This will install all the dependencies. You can then run `make zip` to bundle the extension up into a ZIP archive, or `make build` to package it into a `.crx` Chrome extension file.

## Installing

To access it from a locally running instance of ChromiumOS for testing, copy it into your downloads folder. This is accessible from within the ChromiumOS file browser. On Linux the path is the `~/Downloads`, and the building and copying process can be completed in one step by running `make copy`. Then open the ChromiumOS file browser and the Chromium extensions page (at `chrome://extensions`), and drag s3fs.crx across to install it.

## License

BSD
