import JsonFile from "../lib/JsonFile.js";

let jsonFile = new JsonFile();

let inputs = jsonFile.read(`./data/productStructure.json`);

// let homepage = inputs.pages[0];

let pages = inputs.pages

let navBar = pages[0].elements.find(element => element.title == "navBar");
let buttons = navBar.buttons;

let button = buttons[0];

let locators = button.locators;
let elementLocator = locators.find( element => element.name == "button");
let element = elementLocator.element;
let title = button.title;
let xpath = `//${element}[contains(text(), '${title}')]`

let stateAttributeLocator = locators.find( element => element.name == "stateAttribute");
let stateAttribute = stateAttributeLocator.attribute;
let closedValue = stateAttributeLocator.closedValue;

// console.log(`buttons`, buttons);
