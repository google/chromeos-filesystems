# {{ name }}

## Overview

Describe your provider here

## Building

First clone and configure this repository as described in the main readme. Then run the following commands.

```bash
$ cd {{ name }}
$ make install
$ grunt
```

This will install all the dependencies and build the project. You can then run `make zip` to bundle the extension up into a ZIP archive, or install the extension for testing as an unpacked extension by selecting the `extension` directory from Chrome's 'Load unpacked extension' dialog.

## Testing

To run the unit test suite, run `tools/test.sh {{ name }}` from the top-level directory. Make sure you've followed all the setup instructions in the top-level readme first.

