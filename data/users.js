// functions for users
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const helper = require("../helpers");
const bcrypt = require("bcrypt");
const saltRounds = 16;
const validation = require('../helpers');
const { songs } = require('../config/mongoCollections');

// data functions for users

const checkUser = async (username, password) => {
    username = validation.checkUsername(username);
    password = validation.checkPassword(password);

    //actual creation of user into db
    const userCollection = await users();

    let found = await userCollection.findOne({ username: username.toLowerCase() });
    //checking for duplicates
    if (!(found)) {
        throw "user does not exist";
    }

    if (!(await bcrypt.compare(password.trim(), found.password))) {
        throw "Either the username or password is invalid";
    }

    return { authenticatedUser: true };
}

//leave comments on songs , users react to other comments, deleteing comment, removing an interaction
const createComment = async (songId, userId, comment, commentRating) => {
    if (!comment) {
        throw "must enter an comment";
    }

    if (typeof comment !== 'string') {
        throw "comment must be a string";
    }

    //validation is done
    const song = await songs.getSongById(songId);
    if (!(song)) {
        throw "no song of that id";
    }
    const songs = await songs();

    let newSongReview = {
        _id: ObjectId(),
        userId: userId,
        rating: commentRating,
        likes: 0,
        dislikes: 0,
        usersInteractions: []
    }

    let songReviews = songs.songReviews;

    songReviews.push(newSongReview);

}

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
    checkUser,
    getAllUsers,
    getUserById,
    isAdmin,
    createAdmin,
    createComment,
};
