// functions for users
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const helper = require('../helpers');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validation = require('../helpers');
const { songs } = require('../config/mongoCollections');

// data functions for users
const createUser = async (username, password) => {
    username = validation.checkUsername(username);
    password = validation.checkPassword(password);

    //actual creation of user into db
    const userCollection = await users();

    //checking for duplicates
    if (await userCollection.findOne({ username: username.toLowerCase() }
    )) {
        throw "username already taken";
    }

    let hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

    let newUser = {
        username: username.toLowerCase(),
        password: hashedPassword,
        admin: false,
        songPosts: [],
        songReviews: [],

    }

    const info = await userCollection.insertOne(newUser);
    if (!info.acknowledged || !info.insertedId) {
        throw "could not add user";
    }

    return { insertedUser: true };

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

//leave comments on songs , users react to other comments, deleteing comment, removing an interaction
const createComment = async (songId, userId, comment) => {
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
        userId: userId
        rating: 
    }

}


module.exports = {
    createUser,
    checkUser,
    createComment,
};
