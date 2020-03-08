const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

async function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await Admin.findOne({email: email},(err, user) => {
      console.log(user)
      return user
    })
    if (user == null) {
      return done(null, false, console.log('No user with that email'))
    }

    try {
      console.log("PASSWORD", password);
      console.log("USER PASS", user.password)
      await bcrypt.compare(password, user.password, (err, success) => {
        if(err) return done(null, false, console.log('Password incorrect'))
        else return done(null, user, console.log("hnjb"));
      })
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize
