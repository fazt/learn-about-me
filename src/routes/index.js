const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

router.get('/', (req, res, next) => {
  User.find()
  .sort({ createdAt: 'descending'})
  .exec(function (err, users) {
    if (err) { return next(err); }

    res.render('index', { users });
  })
});

router.get('/signup', (req, res) => {
  res.render('signup')
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({username: username}, (err, user) => {
    if (err) { return next(err); }
    if (user) {
      req.flash('error', 'User already exists');
      return res.redirect('/signup');
    }
    var newUser = new User({
      username: username,
      password: password
    });
    newUser.save(next);
  });
}, passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/users/:username', (req, res, next) => {
  User.findOne({ username: req.params.username}, (err, user) => {
    if (err) { return next(err); }
    if(!user) { return next(404); }
    res.render('profile', {user});
  });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get("/edit", ensureAuthenticated, function(req, res) {
  res.render("edit");
});

router.post("/edit", ensureAuthenticated, function(req, res, next) {
  console.log(req.body);
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  const user = new User(req.user);
  console.log(user);
  user.save(function(err) {
    console.log('llego');
    if (err) {
      next(err);
      return;
    }
    req.flash("info", "Profile updated!");
    res.redirect("/edit");
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }
}

module.exports = router;
