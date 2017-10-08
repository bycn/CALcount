var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var xml = require('xml');
var request = require('request');



var app = express();
var api_key = process.env.API_KEY
console.log(api_key)
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/",express.static(path.join(__dirname, 'views')));

app.use("/message", function(req,res,next){
    var headers = {
        "requests": [
            {
                "image": {
                    "source": {
                        "imageUri": req.query.sourceImageUrl
                    }
                },
                "features": [
                    {
                        "type": "LABEL_DETECTION"
                    }
                ]
            }
        ]
    }
    request.post({
        headers: {'content-type' : 'application/json'},
        url:     'https://vision.googleapis.com/v1/images:annotate?key=' + api_key,
        body:   JSON.stringify(headers)
    }, function(error, response, body){
        if (error) return next(error);
        console.log(api_key)
        console.log('https://vision.googleapis.com/v1/images:annotate?key=' + api_key)
        data = JSON.parse(body).responses
        console.log(data)
        //tags = []
        //for(var i = 0; i < data.length; i++){
        //    tags[i] = data[i]["name"]
        //}
        //console.log(tags)
        //tags = tags.filter(function(e){
        //    wrong_words = ["plate","dish","food","table","meal","dinner"]
        //    for(var i = 0; i <  wrong_words.length; i++){
        //        if (e == wrong_words[i]){
        //            return false
        //        }
        //    }
        //    return true
        //})
        res.json(data)
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
