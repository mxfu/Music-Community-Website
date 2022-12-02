// Helper functions to be used in other files
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
  const letters = /[a-zA-Z]/;
  const letterCheck = letters.test(username);
  if (!letterCheck)
    throw "Error: Username must contain at least one letter character.";
}
module.exports = { checkNames, checkString, checkUsername };
