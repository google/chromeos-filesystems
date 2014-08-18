# ChromeOS Filesystem Providers

This repository contains various filesystem providers for Chrome OS. They offer a way to access files stored on remote servers through the Files app, via a variety of protocols.

Currently, the provider API itself is read-only, and therefore all of the providers are too. When the API is updated, they can be extended to support write operations.

## Current

Work has started on the following providers

- WebDAV
- Amazon S3
- Dropbox

They can be found in their respective directories with this repository. Please refer to each provider's own readme for installation and usage instructions.

## Planned

There are many more providers we would like to implement, including

- SFTP
- Google Cloud Storage
- Samba
- Git
- Box

## License

All providers are licensed under Apache 2.0. See the LICENSE file for details.
All original source code is Copyright 2014 The Chromium Authors.
