// Helper functions to be used in other files
const { ObjectId } = require('mongodb');

module.exports = {
    /*
        username --> 5 characters, non-empty, no spaces, alphanumeric, no special characters
        password --> 6 characters, non-empty, no spaces, 1 capital letter, lowercase, uppercase, and special character
    */
    checkUsername(username) {
        //check for existence of arguments
        if ((!username || !password)) {
            throw "must provide both a username and password";
        }

        if (typeof username !== "string" || typeof password !== "string") {
            throw "username and password must be strings";
        }

        //check username for letters and numbers only 
        let unRegex = /^[a-zA-Z0-9]+$/;
        let verify = true;

        if (username.trim().match(unRegex) === null) {
            verify = false;
        }

        if (verify === false) {
            throw "username must be letters only";
        }

        //check username be at least 4 characters
        if (username.trim().length < 5) {
            throw "username must be at least 5 characters"
        }

        return username;

    },

    checkPassword(password) {
        //check password for any character
        let pwRegex = /^(?=.*?[A-Z])(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/gm

        if (password.trim().match(pwRegex) === null) {
            verify = false;
        }

        if (verify === false) {
            throw "password must have at least 1 uppercase letter, 1 number, and 1 special character";
        }

        //check password is at least 6 characters
        if (password.trim().length < 6) {
            throw "password must be at least 6 characters"
        }

        return password;
    }
};
