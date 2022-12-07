// functions for users
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helpers");
const bcrypt = require("bcrypt");
const saltRounds = 16;

// data functions for users

/**
 * 
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} userName 
 * @param {*} password 
 * @param {*} confirmPassword 
 * @param {*} isAdmin 
 * @returns 
 */
const createUser = async (
  firstName,
  lastName,
  userName,
  password,
  confirmPassword,
  isAdmin
) => {
  helper.checkNames(firstName);
  helper.checkNames(lastName);
  helper.checkString(firstName, "string");
  helper.checkString(lastName, "string");
  helper.checkUsername(userName);
  isAdmin === false; // set isAdmin to false for every user that gets created
  if (!password === confirmPassword)
    throw "Error: password must match confirmPassword";
  const userCollection = await users();
  const hash = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    password: hash,
    isAdmin: isAdmin,
  };
  const newInsert = await userCollection.insertOne(newUser);
  if (newInsert.insertedCount === 0) throw "Insert failed!";
  return await this.getUserById(newInsert.insertedId.toString());
};

/**
 * 
 * @returns 
 */
const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (!userList) throw "No users in system!";
  return userList;
};

/**
 * 
 * @param {*} id 
 * @returns 
 */
const getUserById = async (id) => {
  id = helper.checkId(id, "ID");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found";
  return user;
};

// same as getUserById but just checks if they're an admin or not
/**
 * 
 * @param {*} userId 
 * @returns 
 */
const isAdmin = async (userId) => {
  userId = helper.checkId(userId, "ID");
  const user = getUserById(userId);
  if (user.isAdmin === false) return false; //not admin return false
  else return true; // admin return true
};

/**
 * 
 * @param {*} userId 
 */
const createAdmin = async (userId) => {
  userId = helper.checkId(userId, "ID");
  const user = getUserById(userId);
  if (isAdmin(user) === true) throw "User is already an admin!";
  else user.isAdmin === true;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  isAdmin,
  createAdmin,
};
