const mongoCollections = require("../config/mongoCollections");
const user = require("./users");
const song = require("./songs");
const { ObjectId } = require("mongodb");
const users = mongoCollections.users;
const songs = mongoCollections.songs;
const validation = require("../helpers");



const createComment = async (songId, userId, comment, commentRating) => {
    if (!comment || !commentRating || !songId || !userId) {
        throw "must enter an comment and rating";
    }

    songId = validation.checkId(songId, "ID");
    userId = validation.checkId(userId, "ID");

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

    //creates a comment object
    let newSongReview = {
        _id: ObjectId(),
        userId: userId,
        rating: commentRating,
        likes: 0,
        dislikes: 0,
        usersInteractions: [],
    };

    //find the user and push the comment into it
    let userFound = await user.getUserById(userId);
    if (!userFound) {
        throw "user is not found";
    }

    //all the users comments, they've made
    let userComments = userFound.songReviews;
    //the commentId pushed into the array of comments
    userComments.push(newSongReview["_id"].toString());

    //update the user to have the new comment(s)
    const userCollection = await users();
    let updateUser = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $set: { songReviews: userComments } }
    )

    //check if the user was updated
    if (!updateUser.modifiedCount === 0) throw `Could not update song successfully`;

    //find the song and push the song into it
    const songFound = await song.getSongById(songId)

    if (songFound === null) throw `No song with id: ${songId}`;

    //all the comments under that song
    let songComments = songFound.comments;
    songComments.push(newSongReview);

    //update the overall rating of the songs
    let sumOfRatings = 0;

    //for the length of the song's comment [], add its rating to sumOfRatings
    for (let i = 0; i < songComments.length; i++) {
        sumOfRatings += songComments[i].rating;
    }

    //calculate overallRating
    let finalRating = parseFloat((sumOfRatings / songComments.length).toFixed(2));

    const songCollection = await songs();
    let updateSong = await songCollection.updateOne(
        { _id: ObjectId(songId) },
        { $set: { comments: songComments, overallRating: finalRating } }
    )

    //check if the user was updated
    if (updateSong.modifiedCount === 0) throw `Could not update song successfully`;

    return newSongReview;
};

const getAllComments = async (songId) => {

    songId = validation.checkId(songId, "ID");

    const songCollection = await songs();

    let song = await songCollection.findOne({ _id: ObjectId(songId) });
    if (song === null) throw `No song with id: ${songId}`;

    const allSongs = song.comments;

    return allSongs;
}

const getComment = async (commentId) => {
    commentId = validation.checkId(commentId, "ID");

    const songCollection = await songs();

    let allSongs = await songCollection.find({}).toArray();
    if (!allSongs) throw "Could not get all songs";

    const allComments = allSongs.map((elem) => elem.comments).flat();

    const grabComment = allComments.filter((elem) => elem["_id"].toString() === commentId.trim());

    return grabComment;
};

// //needs to remove by UserID!!!!
// const removeComment = async (commentId, userId) => {
//     commentId = validation.checkId(commentId, "ID");
//     userId = validation.checkId(userId, "ID");
//     const allSongs = await songs.getAllSongs();
//     const songCollection = await song();

//     const findSong = allSongs.filter((song) => {
//         const searchComment = song.comments.filter((comment) => comment._id === commentId.trim());

//         if (searchComment === false) {
//             throw "comment not found";
//         }
//     });

//     const newId = ObjectId(findSong._id);

//     if (!(getComment(commentId.trim()))) {
//         throw "comment cannot be found";
//     } else {
//         const update = findSong.comments.filter((comment) => commentId._id !== commentId.trim());

//         const updateSong = await songCollection.updateOne({ _id: newId }, { $set: { comments: update } });

//         if (!(updateSong.matchCount && updateSong.modifiedCount)) {
//             throw "could not update song";
//         }

//         return "removed successfully";
//     }
// }

const createUserInteraction = async (commentId, userId, songId, interactionType) => {
    commentId = validation.checkId(commentId, "ID");
    userId = validation.checkId(userId, "ID");
    songId = validation.checkId(songId, "ID");
    if (!interactionType || typeof interactionType !== "boolean") {
        throw "interaction must be a boolean"
    }

    //validation done

    let newUI = {
        _id: ObjectId(),
        commentId: commentId,
        userId: userId,
        interactionType: interactionType,
    };

    //finds the user interacting
    let findUser = await user.getUserById(userId);

    if (!findUser) {
        throw "user cannot be found";
    }

    //gets the userInteraction array
    let profile = findUser.commentInteractions;

    profile.push(newUI["_id"].toString()); //pushing userinteraction id into the user's commentInteractions


    let userCollection = await users();
    let parseUser = ObjectId(userId);

    //update from the user side
    const updateUser = await userCollection.updateOne(
        { _id: parseUser },
        { $set: { commentInteractions: profile } }
    )

    if (updateUser.modifiedCount === 0) throw `Could not update user successfully`;

    //find the specific comment
    let findComment = await getComment(commentId);

    //getComment returns an array of Comment Objects 
    if (findComment.length === 0) {
        throw "comment cannot be found";
    }

    //isolate the UI
    let currentUI = findComment[0];

    currentUI.usersInteractions.push(newUI);

    //if interactionType true = like, false = dislike
    if (interactionType) {
        currentUI.likes += 1;
    } else {
        currentUI.dislikes += 1;
    }

    //update from the song side
    let songCollection = await songs();
    const updateSong = await songCollection.updateOne(
        { _id: ObjectId(songId), "comments._id": ObjectId(commentId) },
        { $set: { "comments": currentUI } }
    )

    if (updateSong.modifiedCount === 0) throw `Could not update song successfully`;

    return newUI;
}

const removeInteraction = async (commentId, userId) => {
    commentId = validation.checkId(commentId, "ID");
    userId = validation.checkId(userId, "ID");


}

// const addInteraction = async (commentId, usersInteractionId) => {
//   commentId = validation.checkId(commentId, "ID");
//   usersInteractionId = validation.checkId(usersInteractionId, "ID");

//   const userCollection = await users();


// }
// deleteing commenting or removing/changing your interaction
// const removeInteraction = async(commentId, userId){
// find interaction by id where person interacted matches userId }
// remove them in comment and user
// 

//removeAllinteractions ( commentId ) 
//removes all interaction from comment and registered user
// 

// const addInteraction = async(commentId, userInteractionID){
// and here i am with all this userinteraction functions to do :D 
// }

module.exports = {
    createComment,
    getAllComments,
    getComment,
    createUserInteraction,
};