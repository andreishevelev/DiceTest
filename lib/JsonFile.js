import * as fs from 'fs';

export default class JsonFile {

  read = (path) => {
    // get path to file
    let fileStr = fs.readFileSync(path);

    // read file into string
    fileStr = fileStr.toString();

    // parse JSON data
    let fileJSON = JSON.parse(fileStr);

    // if the JSON data had escaped quotes:
    if (fileStr.charAt(0) == '"') {
      // parse JSON data again
      fileJSON = JSON.parse(fileJSON);
    }
    
    return fileJSON;
  }
}