// functions for users
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const songs = mongoCollections.songs;
const playlists = mongoCollections.playlists;
const { ObjectId } = require('mongodb');
const helper = require("../helpers");
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const validation = require('../helpers');
const sf = require('./songs');
const pf = require('./playlists');

// data functions for users

const checkUser = async (username, password) => {
  username = validation.checkUsername(username);
  password = validation.checkPassword(password);

  //actual creation of user into db
  const userCollection = await users();

  let found = await userCollection.findOne({
    username: username.toLowerCase(),
  });
  //checking for duplicates
  if (!found) {
    throw "user does not exist";
  }

  if (!(await bcrypt.compare(password.trim(), found.password))) {
    throw "Either the username or password is invalid";
  }

  return {
    authenticatedUser: true,
    uID: found["_id"].toString(),
  };
};

//leave comments on songs , users react to other comments, deleteing comment, removing an interaction
const createComment = async (songId, userId, comment, commentRating) => {
    if (!comment || !commentRating || !songId || !userId) {
        throw "must enter an comment and rating";
    }

  if (typeof comment !== "string") {
    throw "comment must be a string";
  }

    if (typeof commentRating !== 'number') {
        throw "rating must be a number"
    }

    if (commentRating < 1 || commentRating > 5) {
        throw "rating must be 1-5"
    }

    //validation is done
    const music = await songs();
    let song = await music.findOne({ _id: ObjectId(songId) });
    if (song === null) throw `No song with id: ${songId}`;
    const parseId = ObjectId(songId);

  if (!song) {
    throw "no song of that id";
  }

  let newSongReview = {
    _id: ObjectId(),
    userId: userId,
    rating: commentRating,
    likes: 0,
    dislikes: 0,
    usersInteractions: [],
  };

  let findUser = await getUserById(userId);

  if (!findUser) {
    throw "user cannot be found";
  }

  let profile = findUser.songReviews;

    //console.log(profile);

    profile.push(newSongReview["_id"].toString()); //pushing review id into the user's songReviews

    //console.log(profile);

  let userCollection = await users();
  let parseUser = ObjectId(userId);

    const updateUser = await userCollection.updateOne(
        { _id: parseUser },
        { $set: { songReviews: profile } }
    )
    if (!updateUser.modifiedCount === 0) throw `Could not update song successfully`;


  let userComments = song.comments;
  userComments.push(newSongReview);

  const update = await music.updateOne(
    { _id: parseId },
    { $set: { comments: userComments } }
  );

    if (!update.modifiedCount === 0) throw `Could not update song successfully`;

  return newSongReview;
};

const getAllComments = async (songId) => {
    const songFound = await songs.getSongById(songId.trim());

    const allSongs = songFound.comments;

    return allSongs;
}

const getComment = async (commentId) => {
    const allSongs = await songs.getAllSongs();

    const allComments = allSongs.map((elem) => elem.comments).flat();

    const grabComment = allComments.filter((elem) => elem._id === commentId.trim());

    return grabComment;
};

//needs to remove by UserID!!!!
const removeComment = async (commentId) => {
    const allSongs = await songs.getAllSongs();
    const songCollection = await songs();

    const findSong = allSongs.filter((song) => {
        const searchComment = song.comments.filter((comment) => comment._id === commentId.trim());

        if (searchComment === false) {
            throw "comment not found";
        }
    });

    const newId = ObjectId(findSong._id);

    if (!(getComment(commentId.trim()))) {
        throw "comment cannot be found";
    } else {
        const update = findSong.comments.filter((comment) => commentId._id !== commentId.trim());

        const updateSong = await songCollection.updateOne({ _id: newId }, { $set: { comments: update } });

        if (!(updateSong.matchCount && updateSong.modifiedCount)) {
            throw "could not update song";
        }

        return "removed successfully";
    }
}

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
 */
const createUser = async (
  firstName,
  lastName,
  userName,
  password,
  confirmPassword
) => {
  validation.checkNames(firstName);
  validation.checkNames(lastName);
  validation.checkString(firstName, "string");
  validation.checkString(lastName, "string");
  validation.checkUsername(userName);
  if (!password === confirmPassword)
    throw "Error: password must match confirmPassword";
  const userCollection = await users();
  const hash = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    password: hash,
    isAdmin: false,
    songPosts: [],
    songReviews: [],
    playlistsPosts: [],
    commentInteractions: [],
  };
  const newInsert = await userCollection.insertOne(newUser);
  if (newInsert.insertedCount === 0) throw "Insert failed!";
  return await getUserById(newInsert.insertedId.toString());
};

/**
 * @returns list of users in DB
 */
const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (!userList) throw "No users in system!";
  return userList;
};

/**
 * @param {*} id : ObjectId of user being searched - string
 * @returns
 */
const getUserById = async (id) => {
  id = validation.checkId(id, "ID");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found";
  return user;
};

// same as getUserById but just checks if they're an admin or not
/**
 * @param {*} userId : ObjectId of user being checked - string
 * @returns boolean true if user is admin, false if not
 */
const isAdmin = async (userId) => {
  userId = validation.checkId(userId, "ID");
  const user = getUserById(userId);
  if (user.isAdmin === false) return false; //not admin return false
  else return true; // admin return true
};

/**
 * @param {*} userId : ObjectId of user being processed for admin privileges - string
 */
const createAdmin = async (userId) => {
  userId = validation.checkId(userId, "ID");
  const user = await getUserById(userId);
  //need to errorcheck if user exists
  if (isAdmin(userId) === true) throw "User is already an admin!";

  const userCollection = await users();

  const update = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: { isAdmin: true } }
  );

  //need to error check
  return true;
};
// deleteing commenting or removing/changing your interaction
// const removeInteraction = async(commentId, userId){
// find interaction by id where person interacted matches userId }
// remove them in comment and user
// }

//removeAllinteractions ( commentId ) 
//removes all interaction from comment and registered user
// 

// const addInteraction = async(commentId, userInteractionID){

// }

module.exports = {
    createUser,
    checkUser,
    getAllUsers,
    getUserById,
    isAdmin,
    createAdmin,
    createComment,
    getAllComments,
    getComment,
    removeComment,
};
