// Helper functions to be used in other files

// VALIDATION FUNCTIONS

/**
 * checks if string meets minimum length requirement
 * @param {*} str : string
 * @param {*} size : minimum size of string
 * @returns boolean
 */
const validString = (str, size = 0) => {
    if (!str) throw 'You must provide a non-empty string';
    if (typeof(str) !== 'string') throw 'You must provide a string';
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
    if (!arr) throw 'You must provide a non-empty array';
    if (arr.length < size) throw 'Your array must have at least ${size} elements';
    if (type !== null) {
        let allEqual = arr => arr.every(val => typeof(val) === type);
        if (!allEqual) throw 'All elements in array must be of type ${type}';
    }

    return true;
};

// /**
//  * determines if multidimensional array arr meets requirements
//  * @param {*} arr : input array
//  * @param {*} dimension : how many nested arrays there are
//  * @param {*} size : array of desired minimum lengths for array in order
//  * @param {*} types : array of types in order
//  */
// const validArrayMd = (arr, dimension, size = null, types = null) => {

// };

const hasSpace = (str) => {
    if (!str) throw 'You must provide a non-empty string';
    if (typeof(str) !== 'string') throw 'You must provide a string';
    if (str.trim().length === 0) throw 'String cannot be empty string or just spaces';

    str = str.trim();

    return /\s/.test(str);
};

/**
 * returns true if str contains numbers, false if str doesn't contain numbers
 * @param {*} str : string
 * @returns boolean
 */
const hasNumbers = (str) => {
    if (!str) throw 'You must provide a non-empty string';
    if (typeof(str) !== 'string') throw 'You must provide a string';
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
}

module.exports = {
    validString,
    validArray,
    hasSpace,
    hasNumbers,
    getToday 
};
