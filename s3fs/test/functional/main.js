var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var chai = require('chai');
chai.should();

var describe = test.describe;
var it = test.it

var server = new SeleniumServer('test/selenium.jar', {port: 4444});

server.start();

var makeDriver = function() {
  return new webdriver.Builder()
    .usingServer(server.address())
    .withCapabilities(webdriver.Capabilities.firefox())
    .build();
};

// driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
// driver.findElement(webdriver.By.name('btnG')).click();

describe('title', function() {
  it('should be correct', function(done) {
    var driver = makeDriver();
    driver.get('http://localhost:3456/build.html');

    driver.getTitle().then(function(title) {
      title.should.equal('mountHeader');
      done();
    });

    driver.quit();
  });
});

