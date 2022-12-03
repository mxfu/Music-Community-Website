// Helper functions to be used in other files
const { ObjectId } = require('mongodb');

// VALIDATION FUNCTIONS

/**
 * checks if string meets minimum length requirement
 * @param {*} str : string
 * @param {*} size : minimum size of string
 * @returns boolean
 */
const validString = (str, size = 0) => {
    if (!str) throw 'You must provide a non-empty string';
    if (typeof (str) !== 'string') throw 'You must provide a string';
    if (str.trim().length === 0) throw 'String cannot be empty string or just spaces';
    if (str.trim().length < size) throw `Inputted string must contain at least ${size} non-space characters`;

    return true;
};

/**
 * determines if array arr meets minimum size and is of type type
 * doesn't work for multidimensional arrays
 * @param {*} arr : input array
 * @param {*} size : desired minimum length of array
 * @param {*} type : type of contents, if null type doesn't matter
 * @returns boolean
 */
const validArray = (arr, size = 1, type = null) => {
    if (!arr) throw `You must provide a non-empty array`;
    if (arr.length < size) throw `Your array must have at least ${size} elements`;
    if (type !== null) {
        let allEqual = arr => arr.every(val => typeof (val) === type);
        if (!allEqual) throw `All elements in array must be of type ${type}`;
    }

    return true;
};

/**
 * returns true if str contains numbers, false if str doesn't contain numbers
 * @param {*} str : string
 * @returns boolean
 */
const hasNumbers = (str) => {
    if (!str) throw 'You must provide a non-empty string';
    if (typeof (str) !== 'string') throw 'You must provide a string';
    if (str.trim().length === 0) throw 'String cannot be empty string or just spaces';

    str = str.trim();

    return /\d/.test(str);
};

/**
 * gets todays date and returns it in form mm/dd/yyyy, is only for C.E. dates
 */
let getToday = () => {
    let today = new Date;
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (yyyy < 10) {
        yyyy = '000' + yyyy;
    } else if (yyyy < 100) {
        yyyy = '00' + yyyy;
    } else if (yyyy < 1000) {
        yyyy = '0' + yyyy;
    }

    today = mm + '/' + dd + '/' + yyyy;
    return today;
};

/*
        username --> 5 characters, non-empty, no spaces, alphanumeric, no special characters
        password --> 6 characters, non-empty, no spaces, 1 capital letter, lowercase, uppercase, and special character
    */
const checkUsername = (username) => {
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

};

const checkPassword = (password) => {
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
};

module.exports = {
    validString,
    validArray,
    hasNumbers,
    getToday,
    checkUsername,
    checkPassword,

};
