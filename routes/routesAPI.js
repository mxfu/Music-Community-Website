// Routes to deal with home page and user log-in and registration
const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const helper = require('../helpers');

router.route('/').get(async (req, res) => {

})

router.route('/register')
    .get(async (req, res) => {

    })
    .post(async (req, res) => {

    })

router.route('/login')
    .get(async (req, res) => {

    })
    .post(async (req, res) => {

    })

router.route('/protected')
    .get(async (req, res) => {

    })
    .post(async (req, res) => {

    })

router.route('/logout')
    .get(async (req, res) => {

    })
    .post(async (req, res) => {

    })

module.exports = router;
