var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose')
mongoose.connect("mongodb://gcoreb:testdb7@ds039484.mlab.com:39484/gcoreb")
var User = require('./models/Users.js');


//routes
var food_data = require("./endpoints/food-data.js");
var calorie_details = require("./endpoints/calorie-details.js");
var signup = require("./endpoints/signup.js");

var app = express();
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/",express.static(path.join(__dirname, 'views')));

app.use("/food-data", food_data);
app.use("/calorie-details", calorie_details);
app.use("/signup", signup);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
