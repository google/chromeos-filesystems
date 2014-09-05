var wd = require('wd');
require('colors');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// checking sauce credential
if(!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY){
  console.warn(
    '\nPlease configure your sauce credential:\n\n' +
    'export SAUCE_USERNAME=<SAUCE_USERNAME>\n' +
    'export SAUCE_ACCESS_KEY=<SAUCE_ACCESS_KEY>\n\n'
  );
  throw new Error("Missing sauce credentials");
}

// http configuration, not needed for simple runs
wd.configureHttp( {
  timeout: 60000,
  retryDelay: 15000,
  retries: 5
});

var desired = {browserName: 'chrome'};
desired.name = 'example with ' + desired.browserName;
desired.tags = ['tutorial'];

describe('Amazon S3 file system provider UI', function() {
  var browser;
  var allPassed = true;

  before(function(done) {
    var username = process.env.SAUCE_USERNAME;
    var accessKey = process.env.SAUCE_ACCESS_KEY;
    browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);

    if(process.env.VERBOSE){
      // optional logging
      browser.on('status', function(info) {
        console.log(info.cyan);
      });
      browser.on('command', function(meth, path, data) {
        console.log(' > ' + meth.yellow, path.grey, data || '');
      });
    }

    browser
      .init(desired)
      .nodeify(done);
  });

  afterEach(function(done) {
    allPassed = allPassed && (this.currentTest.state === 'passed');
    done();
  });

  after(function(done) {
    browser
      .quit()
      .sauceJobStatus(allPassed)
      .nodeify(done);
  });

  it("should get home page", function(done) {
    browser
      .get("http://localhost:3456/build.html")
      .title()
      .should.become("mountHeader")
      .elementById("intro")
      .text()
      .should.eventually.include('JavaScript runtime')
      .nodeify(done);
  });

  // it("should go to the doc page", function(done) {
  //   browser
  //     .elementById('docsbutton')
  //     .click()
  //     .waitForElementByCss("#content header", wd.asserters.textInclude('Manual'), 10000)
  //     .title()
  //     .should.eventually.include("Manual")
  //     .nodeify(done);
  // });

  // it("should return to the home page)", function(done) {
  //   browser
  //     .elementById('logo')
  //     .click()
  //     .waitForElementById("intro", wd.asserters.textInclude('JavaScript runtime'), 10000)
  //     .title()
  //     .should.not.eventually.include("Manual")
  //     .nodeify(done);
  // });
});
