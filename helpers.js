// Helper functions to be used in other files

// VALIDATION FUNCTIONS

/**
 * checks if string meets minimum length requirement
 * @param {*} str : string
 * @param {*} size : minimum size of string
 * @returns boolean
 */
const validString = (str, size = 0) => {
  if (!str) throw "You must provide a non-empty string";
  if (typeof str !== "string") throw "You must provide a string";
  if (str.trim().length === 0)
    throw "String cannot be empty string or just spaces";
  if (str.trim().length < size)
    throw `Inputted string must contain at least ${size} non-space characters`;

  return true;
};

/**
 * determines if array arr meets minimum size and is of type type
 * doesn't work for multidimensional arrays
 * @param {*} arr : input array
 * @param {*} size : desired minimum length of array
 * @param {*} type : type of contents, if null type doesn't matter
 * @returns boolean
 */
const validArray = (arr, size = 1, type = null) => {
  if (!arr) throw "You must provide a non-empty array";
  if (arr.length < size) throw "Your array must have at least ${size} elements";
  if (type !== null) {
    let allEqual = (arr) => arr.every((val) => typeof val === type);
    if (!allEqual) throw "All elements in array must be of type ${type}";
  }

  return true;
};

/**
 * determines if multidimensional array arr meets requirements
 * @param {*} arr : input array
 * @param {*} dimension : how many nested arrays there are
 * @param {*} size : array of desired minimum lengths for array in order
 * @param {*} types : array of types in order
 */
// const validArrayMd = (arr, dimension, size = null, types = null) => {

// };

const hasSpace = (str) => {
  if (!str) throw "You must provide a non-empty string";
  if (typeof str !== "string") throw "You must provide a string";
  if (str.trim().length === 0)
    throw "String cannot be empty string or just spaces";

  str = str.trim();

  return /\s/.test(str);
};

/**
 * returns true if str contains numbers, false if str doesn't contain numbers
 * @param {*} str : string
 * @returns boolean
 */
const hasNumbers = (str) => {
  if (!str) throw "You must provide a non-empty string";
  if (typeof str !== "string") throw "You must provide a string";
  if (str.trim().length === 0)
    throw "String cannot be empty string or just spaces";

  str = str.trim();

  return /\d/.test(str);
};

/**
 * gets todays date and returns it in form mm/dd/yyyy, is only for C.E. dates
 */
let getToday = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (yyyy < 10) {
    yyyy = "000" + yyyy;
  } else if (yyyy < 100) {
    yyyy = "00" + yyyy;
  } else if (yyyy < 1000) {
    yyyy = "0" + yyyy;
  }

  today = mm + "/" + dd + "/" + yyyy;
  return today;
};
const { ObjectId } = require("mongodb");

function checkId(id, varName) {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
}

function checkNames(input) {
  var namesCheck = "[a-zA-Z]+"; //checks for letters only
  if (!namesCheck.test(input))
    throw "Error: names must only contain alphabetical characters!";
}

function checkString(strVal, varName) {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}

function checkUsername(username) {
  if (!username) throw "Error: username was not provided!";
  if (typeof username !== "string")
    throw "Error: Username is not of type string!";
  username = username.trim();
  if (username.length === 0) throw "Error: username cannot contain just spaces";
  if (username.length <= 4)
    throw "Error: username cannot be less than 5 characters";
  const letters = /[a-zA-Z]/; //regex to check for at least one letter character
  const letterCheck = letters.test(username);
  if (!letterCheck)
    throw "Error: Username must contain at least one letter character.";
  return username;
}

function checkStringArray(arr, varName) {
  //We will allow an empty array for this,
  //if it's not empty, we will make sure all tags are strings
  let arrayInvalidFlag = false;
  if (!arr || !Array.isArray(arr))
    throw `You must provide an array of ${varName}`;
  for (i in arr) {
    if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
      arrayInvalidFlag = true;
      break;
    }
    arr[i] = arr[i].trim();
  }
  if (arrayInvalidFlag)
    throw `One or more elements in ${varName} array is not a string or is an empty string`;
  return arr;
}

module.exports = {
  checkId,
  checkNames,
  checkString,
  checkUsername,
  checkStringArray,
  validString,
  validArray,
  hasSpace,
  hasNumbers,
  getToday,
};
