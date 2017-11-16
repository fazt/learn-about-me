const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function () {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy(
    (username, password, done) => {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, {message: "That user doesn't exist"});
        }
        user.checkPassword(password, function(err, isMatch) {
          if (err) { return done(err); }
          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'invalid password'});
          }
        });
      });
    }
  ))
}
