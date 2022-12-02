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
 * @param {*} name : name of song - non-spaced string
 * @param {*} artist : name of artist - non-spaced string
 * @param {*} genre : list of genres - non-spaced strings
 *  genres are non-spaced strings containing letters and punctuation (-'/&)
 * @param {*} links : list of url links to listen to songs - urls are entered as strings
 */
const postSong = async (name, artist, genre, links) => {

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
