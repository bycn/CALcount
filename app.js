var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var xml = require('xml');
var request = require('request');



var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/",express.static(path.join(__dirname, 'views')));

app.use("/message", function(req,res,next){
    request.post({
        headers: {'content-type' : 'application/json',
                  'Ocp-Apim-Subscription-Key' : 'fb3bae4c99b04ef29f4f8d9531511d18'
        },
        url:     'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Tags',
        body:    "{url: '" + req.query.sourceImage + "'}"
    }, function(error, response, body){
        if (error) return next(error);
        data = JSON.parse(body).tags
        tags = []
        for(var i = 0; i < data.length; i++){
            tags[i] = data[i]["name"]
        }
        console.log(tags)
        res.json(body)
    });

})
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
  res.render('error');
});

module.exports = app;
