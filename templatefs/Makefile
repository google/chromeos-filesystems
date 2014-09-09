.PHONY: zip clean grunt install

NAME={{ name }}
ZIP=$(NAME).zip

zip: grunt
	zip $(ZIP) extension/*

grunt:
	grunt

clean:
	rm -rf $(ZIP) extension/vendor extension/*.js test/build

install:
	npm install
