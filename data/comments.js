const mongoCollections = require("../config/mongoCollections");
const user = require("./users");
const song = require("./songs");
const { ObjectId } = require("mongodb");
const validation = require("../helpers");

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
    const music = await song();
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

    let ratingSum = 0;
    for (let i = 0; i < userComments.length; i++) {
        ratingSum += userComments[i].rating;
    }

    ratingSum = parseFloat((ratingSum / userComments.length).toFixed(2));

    const update = await music.updateOne(
        { _id: parseId },
        { $set: { comments: userComments, overallRating: ratingSum } }
    );

    if (!update.modifiedCount === 0) throw `Could not update song successfully`;

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

//needs to remove by UserID!!!!
const removeComment = async (commentId, userId) => {
    commentId = validation.checkId(commentId, "ID");
    userId = validation.checkId(userId, "ID");
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

const createUserInteraction = async (commentId, userId, interactionType) => {
    commentId = validation.checkId(commentId, "ID");
    userId = validation.checkId(userId, "ID");
    if (!interactionType || typeof interactionType !== "boolean") {
        throw "interaction must be a boolean"
    }

    let findUser = await getUserById(userId);

    if (!findUser) {
        throw "user cannot be found";
    }

    let newUI = {
        _id: ObjectId(),
        commentId: commentId,
        userId: userId,
        interactionType: interactionType,
    };

    let profile = findUser.commentInteractions;

    profile.push(newUI["_id"].toString()); //pushing review id into the user's songReviews


    let userCollection = await users();
    let parseUser = ObjectId(userId);

    const updateUser = await userCollection.updateOne(
        { _id: parseUser },
        { $set: { commentInteractions: profile } }
    )

    if (!updateUser.modifiedCount === 0) throw `Could not update song successfully`;

    let findComment = getComment(commentId);

    if (!findComment) {
        throw "user cannot be found";
    }

    //TO-DO : update comment to have user interaction
    //findComment.addInteraction(commentId, newUI);

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
    removeComment,
    createUserInteraction,
};