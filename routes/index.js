// Index for all routes
const apiRoutes = require('./routesAPI');
const playlistRoutes = require('./playlists');
const songRoutes = require('./songs');
const userRoutes = require('./users');

const constructorMethod = (app) => {
    // figure out what route base should be stored in
    app.use('/', apiRoutes);
    app.use('/register', apiRoutes);
    app.use('/login', apiRoutes);
    app.use('/logout', apiRoutes);
    app.use('/protected', apiRoutes);
    app.use('/playlists', playlistRoutes);
    app.use('/song', songRoutes);
    app.use('/user', userRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
