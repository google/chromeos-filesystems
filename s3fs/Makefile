.PHONY: zip clean grunt test install libs

NAME=s3fs
ZIP=$(NAME).zip

libs:
	cp third_party/aws-sdk/dist/aws-sdk.min.js extension/aws-sdk.js

zip: grunt
	zip $(ZIP) extension/*

grunt: libs
	grunt

test:
	grunt test

clean:
	rm -rf $(ZIP) extension/vendor extension/*.js test/build extension/build.*

deepclean: clean
	rm -rf node_modules third_party

install:
	npm install
