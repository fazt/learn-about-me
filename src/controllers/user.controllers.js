const User = require('../models/user');

module.exports = {
  renderIndex: (req, res, next) => {
    User.find()
    .sort({ createdAt: 'descending'})
    .exec(function (err, users) {
      if (err) { return next(err); }
      console.log(users);
      res.render('index', { users });
    })
  },

  renderSignup: (req, res) => {
    res.render('signup')
  },

  renderUserProfile: (req, res, next) => {
    User.findOne({ username: req.params.username}, (err, user) => {
      if (err) { return next(err); }
      if(!user) { return next(404); }
      res.render('profile', {user});
    });
  }

}
