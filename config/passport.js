const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport')
//User models
const Admin = require('../models/admin');


module.exports = function(passport){
  passport.use(
    new LocalStrategy({emailField: 'email'}, (email,password , done) => {
      //Match user
      Admin.findOne({email: email})
        .then(user => {
          if(!user){
            return done(null, false, {message: 'Email not found'})
          }
          //Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
              return done(null, user)
            }else {
              return done(null, false, {message: 'Password is incorrect'})
            }
          })
        })
        .catch(err => console.log(err))
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, user) => {
      done(err, user)
    })
  })

}
