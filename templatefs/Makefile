.PHONY: zip clean build grunt test install

NAME={{ name }}
ZIP=$(NAME).zip

zip: grunt
	zip $(ZIP) extension/*

grunt:
	grunt

test:
	grunt test

clean:
	rm -rf $(ZIP) extension/vendor extension/*.js test/build

install:
	npm install
