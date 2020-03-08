const express = require("express");
const {Router} = require("express");
const Admin = require("../models/admin");
const router = Router();
const passport = require('passport');


router.post("/", passport.authenticate('local', { failureRedirect: '/error' }),  function(req, res, next) {
	// const { email, password } = req.body;
  console.log('here')
});



module.exports = router;
