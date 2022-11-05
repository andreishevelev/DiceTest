import { until, Builder, By, Key } from "selenium-webdriver";
import { browser } from "../util/params.js";
const driver = new Builder().forBrowser(browser).build();
await driver.manage().window().maximize();

export default class BasePage {
  constructor() {
    global.driver = driver;
  }

  // open page
  openPage = async (page) => {
    //Store the ID of the original window
    const originalWindow = await driver.getWindowHandle();
    // Opens a new tab and switches to new tab
    await driver.switchTo().newWindow('tab');
    await driver.get(page.url);
    console.log(`page.titile`, page.title);
    await driver.wait(until.titleIs(page.title));
    return originalWindow;
  }

  async closePage(originalWindow) {
    await driver.sleep(2000);
    await driver.close();
    //Switch back to the old tab or window
    await driver.switchTo().window(originalWindow);
  }

  async closeBrowser() {
    console.log(`closing Browser`);
    await driver.sleep(2000);
    await driver.close();
    await driver.quit();
  }

  /**
   * 
   * @param {element} locator 
   * @param {string} type visible, enabled
   * @param {number} type timeout
   * @returns {<promise> element} 
   */
  findElement = async (locator, type, GLOBAL_TIMEOUT) => {
    switch (type) {
      case `visible`:
        await driver.wait(until.elementLocated(locator), GLOBAL_TIMEOUT);
        locator = await driver.findElement(locator);
        return await driver.wait(until.elementIsVisible(locator), GLOBAL_TIMEOUT);
    }
  }

  state = async (type, dropdown, stateArrtubute, closedValue, state) => {
    switch (type) {
      case `set`:
        return this.setState(dropdown, stateArrtubute, closedValue, state);
      case `get`:
        return this.getState(dropdown, stateArrtubute, closedValue);
    }
  }

  setState = async (dropdown, stateArrtubute, closedValue, state) => {
    let attribute = await dropdown.getAttribute(stateArrtubute);
    let retval;
    if (attribute == undefined) {
      this.click(dropdown);
      retval = "open";
    }
    else {
      let currState = await this.getState(dropdown, stateArrtubute, closedValue);
      // if dropdown menu is not in the desired state
      if (currState != state) {
        // click Login/Register button
        await this.click(dropdown);
        // initialaze loop counter
        let counter = 0;
        // while the menu is not in the desired state
        while (currState != state) {
          // wait 0.1 second
          await driver.sleep(100);
          // get the state of the menu
          currState = await this.getState(dropdown, stateArrtubute, closedValue);
          // increment the loop counter
          counter++;
          // if the counter is divisible by 30, then it has been 3 seconds
          // since the minu button was clicked. Click it again
          if (counter % 30 === 0) {
            await this.click(dropdown);
          }
          // if the counter is equal to 100, then it has been 10 seconds with
          // the menu still not going to the desired state.  We assume at this
          // point that the menu is broken, and end the loop
          if (counter == 100) {
            break;
          }
        }
      }
      retval = currState;
    }
    return retval;
  }

  getState = async (dropdown, stateArrtubute, closedValue) => {
    let attribute = await dropdown.getAttribute(stateArrtubute);
    return attribute == closedValue ? `closed` : `open`;
  }

  click = async (element) => {
    await element.click();
  }
}