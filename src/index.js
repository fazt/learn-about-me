const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const routes = require('./routes');

const express = require('express');
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', {
  useMongoClient: true
}).then(() => console.log('conneted to db'))
.catch((err) => console.error(err));

const setupPassport = require('./config/passport');
setupPassport();

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'faztweb',
  resave: true,//session will be updated even when it hasn’t been modified
  saveUninitialized: true // This resets sessions that are uninitialized.
}));
app.use(flash());
// passport
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});
