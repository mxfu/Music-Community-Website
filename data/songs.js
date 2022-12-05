// functions for songs
const mongoCollections = require('../config/mongoCollections');
const songs = mongoCollections.songs;
// const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const helper = require('../helpers');
const user = require('./users');
// const bcrypt = require('bcrypt');
// const saltRounds = 16;
const platforms = ['Youtube', 'Soundcloud', 'Apple Music', 'Spotify', 'Tidal']

// data functions for songs

/**
 * creates song post
 * @param {*} posterId : ObjectId of admin user who is posting song - string
 * @param {*} title : title of song - string
 * @param {*} artist : name of artist - string
 * @param {*} genres : list of genres - array
 *  genres are strings containing letters and punctuation (-/&)
 * @param {*} links : list of url links to listen to songs - array of arrays [platform, link]
 *  platform is a string
 *  link is an url entered as strings
 */
const postSong = async (posterId, title, artist, genres, links) => {
    // checking if all inputs exist
    if (!posterId || !title || !artist || !genre || !links) throw 'All fields need to have values';
    //checking if inputs are ok
    if (helper.validString(posterId.trim())) posterId = posterId.trim();
    if (!ObjectId.isValid(posterId)) throw 'Poster does not have valid ObjectId';
    if (helper.validString(title.trim())) title = title.trim();
    if (helper.validString(artist.trim())) artist = artist.trim();
    if (helper.validArray(genres, 1, 'string')) {
        for (const genre of genres) {
            if (helper.validString(genre.trim())) {
                if (helper.hasNumbers(genre.trim())) throw 'Genre cannot contian numbers';
                genre = genre.trim();
                // testing for invalid characters
                let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
                let badEntry = badChars.test(genre);
                if (badEntry) throw `Genres must contain only alphabetical characters and/or -/&`;
            }
        }
    }
    // !reformat to work as 2D array
    if (helper.validArray(links, 1, 'string')) {
        for (const link of links) {
            if (helper.validString(link.trim())) link = link.trim();
            // testing for whitespace
            let hasSpace = /\s/.test(link);
            if (hasSpace) throw 'Links cannot contain spaces';
        }
    }

    // getting DB
    let songCollection = await songs();
    // creating song object
    let newSong = {
        posterId: ObjectId(posterId),
        title: title,
        artist: artist,
        genres: genres,
        overallRating: 0,
        comments: [],
        listenLinks: links
    };
    
    //inserting song
    const insertInfo = await songCollection.insertOne(newSong);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add song';
    const newId = insertionInfo.insertedId.toString();
    
    //testing input
    let song = await getSongById(newId);
    song._id = song._id.toString();
    
    // outputting newly made song
    return song;
};

/**
 * returns all song objects from DB in an array
 */
const getAllSongs = async () => {
    // getting all songs
    let songCollection = await songs();
    let songList = await songCollection.find({}).toArray();
    if (!songList) throw 'Could not get all songs';
    
    // formatting output
    for (let i = 0; i < songList.length; i++) {
        songList[i]._id = songList[i]._id.toString();
        let comments = songList[i].comments
        for (let j = 0; j < comments.length; j++) {
          songList[i].comments[j]._id = songList[i].comments[j]._id.toString();
        }
    }
    // output
    return songList;
};

/**
 * returns the song object with _id songId
 * @param {*} songId : ObjectId of song - string
 */
const getSongById = async (songId) => {
    // getting all songs
    if (!songId) throw 'You must provide an id to search for';
    if (helper.validString(songId.trim())) songId = songId.trim();
    if (!ObjectId.isValid(songId)) throw 'Invalid song Object ID';
    
    // getting song
    const songCollection = await songs();
    let song = await songCollection.findOne({_id: ObjectId(songId)});
    if (song === null) throw `No song with id: ${songId}`;
    
    // formatting output
    song._id = song._id.toString();
    
    // output
    return song;
}; 

/**
 * deletes song title from artist artist
 * @param {*} songId : ObjectId of song - string
 * @param {*} userId : ID of user who requested the delete - string
 * @returns string to indicate song was deleted
 */
const deleteSong = async (songId, userId) => {
    // checking inputs
    if (!songId) throw 'You must provide an id to search for';
    if (!userId) throw 'You must provide an user id';
    if (helper.validString(songId.trim())) songId = songId.trim();
    if (helper.validString(userId.trim())) userId = userId.trim();
    if (!ObjectId.isValid(songId)) throw 'Invalid songId';
    if (!ObjectId.isValid(userId)) throw 'Invalid userId';

    // getting DB
    const songCollection = await songs();
    // const userCollection = await users();

    // getting song and individual tags
    const song = await getSongById(songId);
    if (userId !== song.posterId) throw `Song must be deleted by poster`;
    const title = song.title;
    const artist = song.artist;
    const comments = song.comments;

    // deleting song from DB
    const deletionInfo = await movieCollection.deleteOne({_id: ObjectId(movieId)});
    if (deletionInfo.deleteCount === 0) throw `Could not delete song with id of ${songId}`;

    // delete comment connections for comment commentId on song
    // // remove from user's songReview
    // let deletes = [];
    // for (const comment in comments) {
    //     let deleted = await user.deleteComment(comment._id.toString());
    //     deletes.push(deleted);
    // }
    // // deleting songId from admin's songPosts
    // const updatedAdmin = await user.deleteSong(songId, userId);
    
    //output
    const message = `${title} by ${artist} has been successfully deleted`
    return message;
};

/**
 * updates the title, artist, genres, and links for song with songId
 * @param {*} songId : ObjectId of song - string
 * @param {*} userId : ObjectId of admin deleting song - string
 * @param {*} nt : New title of song - string
 * @param {*} na : New artist of song - string
 * @param {*} ng : New genres of song - array
 *  genre is a string containing letters and punctuation (-/&)
 * @param {*} nl : New list of links - array of arrays [platform, link]
 *  platform is a string
 *  link is an url entered as strings
 */
const updateAll = async (songId, userId, nt, na, ng, nl) => {
    // checking all inputs
    if (!songId || !userId || !nt || !na || !ng || !nl) throw 'All fields need to have values';

    // checking if user posted
    let admin = await getUser(userId).admin;
    let og = await getSongById(songId); // original song
    if (!admin || (userId !== og.posterId)) throw 'Not admin or did not post song';

    //checking if inputs are ok
    // if (helper.validString(userId.trim())) userId = userId.trim();
    // if (!ObjectId.isValid(userId)) throw 'User does not have valid ObjectId';
    if (helper.validString(nt.trim())) nt = nt.trim();
    if (helper.validString(na.trim())) na = na.trim();
    if (helper.validArray(ng, 1, 'string')) {
        for (const genre of ng) {
            if (helper.validString(genre.trim())) {
                if (helper.hasNumbers(genre.trim())) throw 'Genre cannot contian numbers';
                genre = genre.trim();
                // testing invalid characters
                let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
                let badEntry = badChars.test(genre);
                if (badEntry) throw `Genres must contain only alphabetical characters and/or -/&`
            }
        }
    }
    // !reformat to work as 2D array
    if (helper.validArray(links, 1, 'string')) {
        for (const link of links) {
            if (helper.validString(link.trim())) link = link.trim();
            // testing whitespace
            let hasSpace = /\s/.test(link);
            if (hasSpace) throw 'Links cannot contain spaces';
        }
    }

    // getting all songs
    const songCollection = await songs();

    // creating song object
    // let song = await getSongById(songId);
    // let ot = song.title; // old title
    // let oa = song.artist; // old artist

    let updatedSong = {
        title: title,
        artist: artist,
        genres: genres,
        listenLinks: links
    };

    const updatedInfo = await songCollection.updateOne(
        {_id: ObjectId(songId)},
        {$set: updatedSong}
    );
    if (!updatedInfo.modifiedCount === 0) throw `Could not update song successfully`;

    let song = await getSongById(songId);
    song._id = song._id.toString();

    return song;
};

/**
 * updates title of song
 * @param {*} songId : ObjectId of song - string
 * @param {*} nt : New song title - string
 */
 const updateSongTitle = async (songId, nt) => {
    if (!songId) throw 'You must provide a songId to search for';
    if (helper.validString(songId.trim())) songId = songId.trim();
    if (!ObjectId.isValid(songId)) throw 'Invalid songId';
    if (helper.validString(nt.trim())) nt = nt.trim();


};

/**
 * updates artist of a song
 * @param {*} songId : ObjectId of song - string
 * @param {*} na : New artist - string
 */
const updateArtist = async (songId, na) => {
    if (!songId) throw 'You must provide a songId to search for';
    if (helper.validString(songId.trim())) songId = songId.trim();
    if (!ObjectId.isValid(songId)) throw 'Invalid songId';
    if (helper.validString(na.trim())) na = na.trim();


};

/**
 * update genres of song
 * @param {*} songId : ObjectId of song - string
 * @param {*} ng : New genres of song - array
 *  genre is a string containing letters and punctuation (-/&)
 */
 const updateGenre = async (songId, ng) => {
    if (!songId) throw 'You must provide a songId to search for';
    if (helper.validString(songId.trim())) songId = songId.trim();
    if (!ObjectId.isValid(songId)) throw 'Invalid songId';
    if (helper.validArray(ng, 1, 'string')) {
        for (const genre of ng) {
            if (helper.validString(genre.trim())) {
                if (helper.hasNumbers(genre.trim())) throw 'Genre cannot contian numbers';
                genre = genre.trim();
                //testing for invalid characters
                let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
                let badEntry = badChars.test(genre);
                if (badEntry) throw `Genres must contain only alphabetical characters and/or -/&`
            }
        }
    }
};

/**
 * updates links to listen to song
 * @param {*} songId : ObjectId of song - string
 * @param {*} nl : New links to listen to song - array
 *  links are urls in string form
 */
const updateSongLinks = async (songId, nl) => {
    if (!songId) throw 'You must provide a songId to search for';
    if (helper.validString(songId.trim())) songId = songId.trim();
    if (!ObjectId.isValid(songId)) throw 'Invalid songId';
    if (helper.validArray(nl, 1, 'string')) {
        for (const link of nl) {
            if (helper.validString(link.trim())) link = link.trim();
            // testing for whitespace
            let hasSpace = /\s/.test(link);
            if (hasSpace) throw 'Links cannot contain spaces';
        }
    }

};

module.exports = {
    postSong,
    deleteSong,
    getAllSongs,
    getSongById,
    updateAll,
    updateSongTitle,
    updateArtist,
    updateGenre,
    updateSongLinks,
};
