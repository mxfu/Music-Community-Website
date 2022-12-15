// Index for all data functions
const playlistData = require('./playlists');
const songData = require('./songs');
const userData = require('./users');
const commentData = require('./comments');

module.exports = {
    playlists: playlistData,
    songs: songData,
    users: userData,
    comments: commentData
};
