var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose')
var LocalStrategy = require('passport-local')
var cors = require('cors')
var passport = require('passport')
var User = require('./model/user')


var app = express();

//COrS handeling
app.use(cors())


//Configration files
const config = require('./config')

mongoose.connect(config.mongoUrl,(err)=>{
  if(err) console.log(err)
  else console.log("mongodb connected successfully")
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(User.authenticate()),)

app.use(passport.initialize())
app.use((req,res,next)=>{
  console.log(req.body)
  next()
})

app.use('/confirm-email',require('./routes/confirm_email'))
app.use('/verify',require('./routes/verify'))

//Route for Login and Logout
app.use('/user',require('./routes/user'))

//Route for Getting About Information of User
// User is verified if logged in or not using verifyUser() function in auth.js
app.use('/about',require('./routes/about'))

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
