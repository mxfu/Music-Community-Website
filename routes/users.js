// All routes related to user profiles
const e = require("express");
const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const helper = require("../helpers");
//make sure to include error checking for routes
router.route("/").get(async (req, res) => {
  if (req.session.user) return res.redirect("/private");
  return res.render("home_page");
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.user) return res.redirect("/private");
    //line 15 may need data passed as second parameter
    return res.render("register_page");
  })
  .post(async (req, res) => {
    let info = req.body;
    //let fName info.firstName
    // let lName = info.lastName
    //let uName = info.userName <-- register page inputs have no IDs yet
    //let pass = info.password
    //let cPass = info.confirmPassword
    //error check all parameters above (try catch)
    //userData.createUser (try catch)
    return res.redirect("/login");
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) return res.redirect("/private");
    //line 34 may need data passed as second parameter
    return res.render("login_page");
  })
  .post(async (req, res) => {
    let info = req.body;
    //let uName = info.username <-- register page inputs have no IDs yet
    //let pass = info.password
    //error check all parameters above (try catch)
    //let auth = userData.checkUser (try catch)
    //req.session.user = {userName: uName, userId: auth.uID} < -- if the user does exist
    return res.redirect("/private");
    //if invalid credentials or user doesn't exist / also
    //add error messages for both cases
    return res.render("login_page");
  });

router.route("/private").get(async (req, res) => {});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  //add return render(logout-page/redirect back to home page)
});

module.exports = router;
