// Index for all data functions
const postData = require('./posts');
const songData = require('./songs');
const userData = require('./users');

module.exports = {
    posts: postData,
    songs: songData,
    users: userData
};
