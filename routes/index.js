// Index for all routes
const postRoutes = require('./posts');
const songRoutes = require('./songs');
const userRoutes = require('./users');

const constructorMethod = (app) => {
    // figure out what route base should be stored in

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
