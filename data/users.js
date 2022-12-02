// functions for users
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const helper = require('../helpers');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validation = require('../helpers');

// data functions for users
const createUser = async (username, password) => {

}

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

module.exports = {
    createUser,
    checkUser
};
