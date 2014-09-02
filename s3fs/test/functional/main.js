var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
var chai = require('chai');
chai.should();

var describe = test.describe;
var it = test.it

var server = new SeleniumServer('selenium.jar', {port: 4444});

server.start();

var driver = new webdriver.Builder()
  .usingServer(server.address())
  .withCapabilities(webdriver.Capabilities.firefox())
  .build();

driver.get('http://localhost:3456/build.html');
// driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
// driver.findElement(webdriver.By.name('btnG')).click();

describe('title', function() {
  it('should be correct', function(done) {
    driver.getTitle().then(function(title) {
      title.should.equal('mountHeader');
      // driver.quit();
      done();
    });
  });
});

