// functions for users
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helpers");
const bcrypt = require("bcrypt");
const saltRounds = 16;

// data functions for users

const createUser = async (
  firstName,
  lastName,
  userName,
  password,
  confirmPassword
) => {
  helper.checkNames(firstName);
  helper.checkNames(lastName);
  helper.checkString(firstName);
  helper.checkString(lastName);
  helper.checkUsername(userName);
  if (!password === confirmPassword)
    throw "Error: password must match confirmPassword";
  const userCollection = await users();
  const hash = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    password: hash,
  };
  const newInsert = await userCollection.insertOne(newUser);
  if (newInsert.insertedCount === 0) throw "Insert failed!";
  //return await this.getUserById(newInsert.insertedId.toString())
};

module.exports = {
  createUser,
};
