# ChromeOS Filesystem Providers

[![Build Status][travis image]][travis]
[![Code Climate][codeclimate image]][codeclimate]

This repository contains various filesystem providers for Chrome OS. They offer a way to access files stored on remote servers through the Files app, from a variety of sources. There are both *protocol* providers, that connect to arbitrary servers over a particular protocol, like WebDAV and FTP, and *cloud* providers that connect to accounts on various proprietary cloud storage services like Dropbox and Amazon S3.

All of the providers are currently read-only. The API has recently been updated to support write operations, however, and the providers will soon be updated too to reflect this.

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

## Setup

To work on any of these providers, you will need Git, Node.js, Google Chrome and Make installed. You should also install Grunt and Bower globally:

```bash
$ npm install -g grunt-cli bower
```

Then you can get the repository installed:

```bash
$ git clone https://github.com/google/chromeos-filesystems
$ cd chromeos-filesystems
$ bower install
```

## Testing

All providers read the files needed by their unit tests from the server in the `testserver` directory. To start it:

```bash
$ cd testserver
$ npm install
$ node server.js &
```

## Icons

The Photoshop project files for the various sizes of icon for each provider are contained in the `psd` directory in the provider's directory. You will need to install [Photoshop][] or a [PSD-compatible image editor][psdeditor] to edit them. Rendered icons are stored in `extension/icon`.

It will then run indefinitely in the background on port 8000. This can be changed by modifying `config.js`.

## Creating new providers

Please refer to the [wiki page][create-provider] for instructions on how to create your own provider. Remember to follow the [guidelines](CONTRIBUTING.md) for contributing to this repository.

## License

All providers are licensed under the BSD license. See the LICENSE file for details.
All original source code is Copyright 2014 The Chromium Authors.

[travis image]: https://travis-ci.org/google/chromeos-filesystems.svg?branch=master
[travis]: https://travis-ci.org/google/chromeos-filesystems
[codeclimate image]: https://codeclimate.com/github/google/chromeos-filesystems/badges/gpa.svg
[codeclimate]: https://codeclimate.com/github/google/chromeos-filesystems
[photoshop]: http://www.photoshop.com/
[psdeditor]: http://www.makeuseof.com/tag/the-best-ways-to-open-a-psd-file-without-photoshop/
[create-provider]: https://github.com/google/chromeos-filesystems/wiki/Creating-a-new-provider
