.PHONY: zip clean build grunt test install

NAME=s3fs
ZIP=$(NAME).zip

libs:
	cp ../third_party/aws-sdk/dist/aws-sdk.min.js extension/aws-sdk.js

zip: grunt
	zip $(ZIP) extension/*

grunt: libs
	grunt

test:
	grunt test

clean:
	rm -rf $(ZIP) extension/vendor extension/*.js test/build docs

install:
	 wget -O test/selenium.jar http://selenium-release.storage.googleapis.com/2.42/selenium-server-standalone-2.42.2.jar
	npm install

itest:
	./node_modules/.bin/mocha -t 10000 test/functional/main.js
