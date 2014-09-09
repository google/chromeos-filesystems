.PHONY: zip clean build grunt install

NAME=s3fs
ZIP=$(NAME).zip

libs:
	cp ../third_party/aws-sdk/dist/aws-sdk.min.js extension/aws-sdk.js

zip: grunt
	zip $(ZIP) extension/*

grunt: libs
	grunt

clean:
	rm -rf $(ZIP) extension/vendor extension/*.js test/build docs

install:
	npm install
