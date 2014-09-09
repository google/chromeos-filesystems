# S3FS

S3FS is a Chrome extension for Chrome OS for accessing files stored in an Amazon S3 bucket directly through the Files app.

## Overview

The project provides the glue between the S3 API and Chrome's `fileSystemProvider` API. Currently this API is read-only, and therefore creating or writing to files in a bucket is not supported. This will be added when the Chrome API is updated.

## Building

First clone and configure this repository as described in the main readme. Then run the following commands.

```bash
$ cd s3fs
$ npm install
$ grunt
$ grunt copy
```

This will install all the dependencies and build the project. You can then compress the `extension` directory to a ZIP archive, or install the extension for testing as an unpacked extension by selecting the `extension` directory from Chrome's 'Load unpacked extension' dialog.

## Testing

To run the unit test suite, run `tools/test.sh s3fs` from the top-level directory. Make sure you've followed all the setup instructions in the top-level readme first.

## Documentation

To generate HTML documentation for the provider from the JSDoc source code annotations, run `grunt docs`. The documentation will be generated to the `docs` directory. To view it, run `grunt connect:docs &` and navigate to `http://localhost:4000`.
