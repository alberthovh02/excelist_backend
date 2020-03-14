const express = require("express");
const {Router} = require("express");
const Admin = require("../models/admin");
const router = Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');


router.post("/", function(req, res, next) {
	// const { email, password } = req.body;
  const { login, password } = req.body;

  const adminUser = Admin.findOne({login}, (err, user) => {

    if(!err){
      if(user && user.password === password){
        jwt.sign({user}, "mysecretkey", (err, token) => {
          console.log('jwt')
            return res.json({
              code: 200,
              message: "Successfully logged in",
              token: token
            })
        })
        // next()
    }
    else if(!user) {
      return res.json({code: 400, message: "User not found"})

    }
    else {
      return res.json({code: 400, message: "wrong password"})
      next()
    }
  }
  else{
    return res.json({code: 400, message: "User not found"})
  }

});
})

module.exports = router;
