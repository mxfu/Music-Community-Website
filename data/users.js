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
 * @param {*} firstName : firstname of user entered in the registration page - string
 * @param {*} lastName : lastname of user entered in the registration page - string
 * @param {*} userName : username of user entered in the registration page - string
 * @param {*} Email : Email of user entered in the registration page - string
 * @param {*} password : password of user entered in the registration page - string
 * @param {*} confirmPassword : password of user entered in the registration page - string
 * @param {*} isAdmin : admin flag that all users will have, set to false in this function - boolean
 * @param {*} songPosts : list of songs posted by user - array
 * @param {*} songReviews : list of reviews that a user has posted - array
 * @param {*} playlistPosts : list of playlists the user has posted - array
 * @param {*} commentInteractions : list of ids of the comments the user has interacted with - array
 * @returns new created user
 * TODO remove song Id from song posts function
 * TODO remove comment Id from song reviews
 * TODO Remove a playlistId from playlist post
 * TODO remove a commentInteractionsId from commentInteractions
=======
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
  Email,
  password,
  confirmPassword,
  isAdmin,
  songPosts,
  songReviews,
  playlistPosts,
  commentInteractions
) => {
  helper.checkNames(firstName);
  helper.checkNames(lastName);
  Email = helper.checkString(Email);
  firstName = helper.checkString(firstName, "firstName");
  lastName = helper.checkString(lastName, "lastName");
  userName = helper.checkUsername(userName);
  songPosts = helper.checkStringArray(songPosts, "songPosts");
  songReviews = helper.checkStringArray(songReviews, "songReviews");
  playlistPosts = helper.checkStringArray(playlistPosts, "playlistPosts");
  commentInteractions = helper.checkStringArray(
    commentInteractions,
    "commentInteractions"
  );
  isAdmin === false; // set isAdmin to false for every user that gets created
  if (!password === confirmPassword)
    throw "Error: password must match confirmPassword";
  const userCollection = await users();
  const hash = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    Email: Email,
    userName: userName,
    password: hash,
    isAdmin: isAdmin,
    songPosts: songPosts,
    songReviews: songReviews,
    playlistPosts: playlistPosts,
    commentInteractions: commentInteractions,
  };
  const newInsert = await userCollection.insertOne(newUser);
  if (newInsert.insertedCount === 0) throw "Insert failed!";
  return await this.getUserById(newInsert.insertedId.toString());
};

/**

 *
 * @returns list of users in DB
=======
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
 * @param {*} id : ObjectId of user being searched - string
 * @returns
=======
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
 * @param {*} userId : ObjectId of user being checked - string
 * @returns boolean true if user is admin, false if not
=======
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
 * @param {*} userId : ObjectId of user being processed for admin privileges - string
=======
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
