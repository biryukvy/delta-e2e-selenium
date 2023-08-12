const { By, Builder, Browser } = require('selenium-webdriver');
const { suite } = require('selenium-webdriver/testing');
const assert = require('assert');

const { homepageUrl } = require('../datasets/urls');
const { homepageMetaTitle } = require('../datasets/meta-text');
const gdprBanner = require('../datasets/gdpr.css');

suite(function (env) {
  describe('Homepage', function () {
    let driver;

    before(async function () {
      driver = await new Builder().forBrowser('chrome').build();
      await driver.get(homepageUrl);
    });

    after(async () => await driver.quit());

    it('Should have proper meta title', async function() {
      const title = await driver.getTitle();
      assert.equal(homepageMetaTitle, title);
    });

    describe('GDPR modal', function() {
      
      before(async function () {
        await driver.manage().setTimeouts({ implicit: 5000 });
      });

      it('Should be displayed on page load', async function () {
        try {
          await driver.findElement(By.css(gdprBanner.bodyCss));
        } catch (e) {
          assert.fail();
        } 
      });

      it('Should have a close-button', async function () {
        try {
          await driver.findElement(By.css(gdprBanner.closeBtnCss));
        } catch (e) {
          assert.fail();
        } 
      });

      it('Should be closed when the close-button is clicked', async function () {
        const gdprBannerCloseBtnEl = await driver.findElement(By.css(gdprBanner.closeBtnCss));
        await gdprBannerCloseBtnEl.click();
        const isGdprBannerElDisplayed = await driver.findElement(By.css(gdprBanner.bodyCss)).isDisplayed();
        assert.equal(isGdprBannerElDisplayed, false);
      });
    });

    it('Should have proper meta title', async function() {
      const title = await driver.getTitle();
      assert.equal(homepageMetaTitle, title);
    });
  });
}, { browsers: [Browser.CHROME, Browser.FIREFOX]});