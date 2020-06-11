var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Configration files
const config = require('./config')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//configuring signed Cookies
app.use(cookieParser(config.secretKey));

app.use(express.static(path.join(__dirname, 'public')));

//Configuring Session with FileStore to store sessions and Secret to Sign it
app.use(session({
  name:'session-id',
  secret:config.secretKey,
  saveUninitialized:false,
  resave:false,
  store:new FileStore()
}))


//Route for Login and Logout
app.use('/user',require('./routes/user'))

//Route for Getting About Information of User
// User is verified if logged in or not using verifyUser() function in auth.js
app.use('/about',require('./auth').verifyUser,require('./routes/about'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
