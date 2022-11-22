import BasePage from "../lib/BasePage.js";
import HomePage from "../lib/Home.js"
import JsonFile from "../lib/JsonFile.js"
import { expect } from "chai";

let jsonFile = new JsonFile();
let homePage = new HomePage();

/* rather than a list of command-line parameters, this program takes a config
   file with them instead
 */

//    const usersFile = process.argv[3] + ".json";
//    var users = jsonFile.read(usersFile);

let inputs = jsonFile.read(`./data/productStructure.json`);

//    const email = users["email"];
//    const password = users["password"];
const pages = inputs["pages"];

// array of test actions
var actions = [];

describe('Can check navigation on Dice.com', function () {
  this.timeout(0);

  // BEGIN functions for adding actions to action list
  function addHandleButtonAction(button) {
    let action = {};
    action.type = `handle${button.type}Button`;
    action.button = button;
    actions.push(action);
  }

  function addOpenPageAction(page) {
    let action = {};
    action.type = `openPage`;
    action.page = page;
    actions.push(action);
  }

  function addClosePageAction() {
    let action = {};
    action.type = `closePage`;
    actions.push(action);
  }

  // BEGIN functions for handling nodes in config tree
  pages.forEach(page => {
    addOpenPageAction(page);
    handlebuttons(page);
    addClosePageAction();

  });

  function handlebuttons(page) {
    let navigation = page.elements.find(element => element.category == "navigation");
    let buttons = navigation.buttons;
    buttons.forEach(button => {
      addHandleButtonAction(button)
    });
  }

  // END functions for handling nodes in config tree

  before(async () => {
  });

  after(() => {
    homePage.closeBrowser();
  });

  let originalWindow;

  function openPage(page) {
    it(`Can open page`, async () => {
      originalWindow = await homePage.openPage(page);
      // expect(actualTitle).to.equal(page.title);
    })
  };

  function closePage() {
    it(`Can close page`, async () => {
      await homePage.closePage(originalWindow);
    })
  };

  function handleDropdownButton(button) {
    it(`Can open dropdown`, async () => {
      let loginRegisterState = await homePage.dropDownState(button, `set`, `open`);
      expect(loginRegisterState).to.equal(`open`);
    })
  };

  for (let l = 0; l < actions.length; l++) {
    let action = actions[l];
    let actionStr = `${l}: ${actions[l].type}`;

    switch (action.type) {
      case "handleDropDownButton":
        handleDropdownButton(action.button);
        break;
      case "openPage":
        openPage(action.page);
        break;
      case "closePage":
        closePage();
        break;
      default:
        console.log(
          `default switch case encountered on action ${l}: ${action.type}`
        );
        break;
      //actionStr += `${actions[l].questionType} (${JSON.stringify(actions[l].answer)})`
    }
    console.log(actionStr);
    console.log(`jenkins integration`);
  }
});
