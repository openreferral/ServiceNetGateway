describe('ServiceNet demo e2e tests', function() {

  it('should show proper title after page load', function() {
    browser.waitForAngularEnabled(false); // <- required line for react
    browser.get('http://localhost:9000/');

    expect(browser.getTitle()).toEqual('ServiceNet');
  });

  it('should not login with fake credentials', function() {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:9000/#/login');
    browser.driver.findElement(by.id('username')).sendKeys('admin');
    browser.driver.findElement(by.id('password')).sendKeys('fakePassword');
    browser.driver.findElement(by.id('submit-button')).click();

    // TODO: Replace sleep with better waiting approach!
    browser.driver.sleep(1000); // <- waiting for the api response and the alert to render (could be lower)
    browser.driver.findElement(by.id('failed-login'));
  });

  it('should login with proper credentials', function() {
    browser.waitForAngularEnabled(false);
    browser.refresh(); // <- page refresh to get rid of state from previous test case
    browser.get('http://localhost:9000/#/login');
    browser.driver.findElement(by.id('username')).sendKeys('admin');
    browser.driver.findElement(by.id('password')).sendKeys('password');
    browser.driver.findElement(by.id('submit-button')).click();

    // TODO: Replace sleep with better waiting approach!
    browser.driver.sleep(1000); // <- waiting for the api response and the page to render (could be lower)
    browser.driver.findElement(by.id('main-page-title'));
  });
});
