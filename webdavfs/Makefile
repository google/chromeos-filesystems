.PHONY: zip clean grunt test install

# Name of this file system provider.
NAME=webdavfs

# Name of target ZIP archive.
ZIP=$(NAME).zip

# Compress the extension file into a ZIP archive for distribution or uploading
# to the Chrome Webstore.
zip: grunt
	zip $(ZIP) extension/*

# Builds the extension.
grunt:
	grunt

# Runs the test suite.
test:
	cp -r ../testserver/assets ../testserver/liveassets
	-grunt test
	rm -rf ../testserver/liveassets

# Removes any automatically generated files.
clean:
	rm -rf $(ZIP) extension.crx extension/vendor extension/*.js test/build extension/build.*

# Installs build tools.
install:
	npm install
