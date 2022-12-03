// functions for songs
const mongoCollections = require('../config/mongoCollections');
const songs = mongoCollections.songs;
const {ObjectId} = require('mongodb');
const helper = require('../helpers');
const bcrypt = require('bcrypt');
const saltRounds = 16;

// data functions for songs

/**
 * creates song post
 * @param {*} posterId : string ID of user who is posting song
 * @param {*} name : name of song - non-spaced string
 * @param {*} artist : name of artist - non-spaced string
 * @param {*} genres : list of genres - non-spaced strings
 *  genres are non-spaced strings containing letters and punctuation (-'/&)
 * @param {*} links : list of url links to listen to songs - urls are entered as strings
 */
const postSong = async (posterId, name, artist, genres, links) => {
    if (!name || !artist || !genre || !links) throw 'All fields need to have values';

    //checking if inputs are ok
    if (helper.validString(posterId.trim())) posterId = posterId.trim();
    if (!ObjectId.isValid(posterId)) throw 'Poster does not have valid ObjectId';
    if (helper.validString(name.trim())) name = name.trim();
    if (helper.validString(artist.trim())) artist = artist.trim();
    if (helper.validArray(genres, 1, 'string')) {
        for (const genre of genres) {
            if (helper.validString(genre.trim()) && !helper.hasNumbers(genre.trim())) {
                genre = genre.trim();
                
                let badChars = /[@#$%^*_+=\\|<>~\[\]{}()'"`!:;,.?]/;
                let goodEntry = badChars.test(genre);

                if (goodEntry) throw `Genres must contain only alphabetical characters and/or -/&`
            }
        }
    }
    if (helper.validArray(links, 1, 'string')) {
        for (const link of links) {
            if (helper.validString(link.trim())) link = link.trim();
            let hasSpace = /\s/.test(link);

            if (hasSpace) throw 'Links cannot contain spaces';
        }
    }

    // creating song object
    let songCollection = await songs();

    let newSong = {
        posterId: ObjectId(posterId),
        name: name,
        artist: artist,
        genres: genres,
        overallRating: 0,
        comments: [],
        listenLinks: links
    };

    const insertInfo = await songCollection.insertOne(newSong);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add song';

    const newId = insertionInfo.insertedId.toString();


};

/**
 * returns all song objects from DB in an array
 */
const getAllSongs = async () => {
    let songCollection = await songs();
    let songList = await songCollection.find({}).toArray();
    if (!songList) throw 'Could not get all songs';

    for (let i = 0; i < songList.length; i++) {
        songList[i]._id = songList[i]._id.toString();
        let comments = songList[i].comments
        for (let j = 0; j < comments.length; j++) {
          songList[i].comments[j]._id = songList[i].comments[j]._id.toString();
        }
    }

    return songList;
};

/**
 * returns the song object with _id songId
 * @param {*} songId : string version of ObjectId of song
 */
const getSongById = async (songId) => {
    if (!songId) throw 'You must provide an id to search for';
    if (helper.validString(songId.trim())) songId = songId.trim();
    if (!ObjectId.isValid(songId)) throw 'Invalid song Object ID';

    const songCollection = await songs();
    let song = await songCollection.findOne({_id: ObjectId(songId)});
    if (song === null) throw `No song with id: ${songId}`;

    song._id = song._id.toString();

    return song;
}; 

/**
 * deletes song name from artist artist
 * @param {*} name : name of song - non-spaced string
 * @param {*} artist 
 */
const deleteSong = async (name, artist) => {

};

const updateAll = async () => {

};

const updateSongLink = async () => {

};

const updateGenre = async () => {

};

const updateSongTitle = async () => {

};

const updateArtist = async () => {

};

module.exports = {
    
};
