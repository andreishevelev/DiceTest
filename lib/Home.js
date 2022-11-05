import { By, until } from "selenium-webdriver";
// import { GLOBAL_TIMEOUT } from "../util/params.js";

import BasePage from "./BasePage.js";

let loginRegisterButtonLocator = `[data-analytics-parent="Login/Register"]`;

export default class HomePage extends BasePage {

  dropDownState = async (button, type, state) => {
    try {
      let locators = button.locators;
      let elementLocator = locators.find(element => element.name == "button");
      let element = elementLocator.element;
      let title = button.title;
      let xpath = `//${element}[contains(text(), '${title}')]`
      let dropdown = await this.findElement(By.xpath(xpath), `visible`, GLOBAL_TIMEOUT);

      let stateAttributeLocator = locators.find(element => element.name == "stateAttribute");
      let stateAttribute = stateAttributeLocator.attribute;
      let closedValue = stateAttributeLocator.closedValue;
      return this.state(type, dropdown, stateAttribute, closedValue, state);
    }
    catch (err) {
      console.log(`HomePage.dropDownState: `, err);
    }
  }

  clickElement = async (element) => {
    try {
      switch (element) {
        case `Login`:
          this.clickElementBase(`css`, `[href="/dashboard/login"]`);
          break;
        case `Register`:
          this.clickElementBase(`css`, `[href="/register"]`);
          break;
      }
    }
    catch (err) {
      console.log(`HomePage.setclickElement: `, err);
    }
  }
}