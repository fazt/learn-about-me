const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  displayName: String,
  bio: String
});

userSchema.methods.name = function() {
  return this.displayName || this.username;
};

// before the model saved
const SALT_FACTOR = 10;
const noop = function () { };

userSchema.pre('save', function (done) {
  var user = this;
  // skipt this logic if password isn't modified
  if (!user.isModified("password")) {
    return done;
  }
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, function (err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  })
});

userSchema.methods.checkPassword = function (guess, done) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
