/**
 * Created by bryanchen on 10/7/17.
 */
var api_key = process.env.API_KEY
var request = require('request');
console.log(api_key)
module.exports = function(req,res,next){
    req.query.sourceImageUrl = decodeURIComponent(req.query.sourceImageUrl);
    if(!req.query.sourceImageUrl){
        res.end(404)
    }
    var headers = {
        "requests": [
            {
                "image": {
                    "source": {
                        "imageUri": req.query.sourceImageUrl)
                    }
                },
                "features": [
                    {
                        "type": "LABEL_DETECTION"
                    }
                ]
            }
        ]
    };
    request.post({
        headers: {'content-type' : 'application/json'},
        url:     'https://content-vision.googleapis.com/v1/images:annotate?key=' + api_key,
        body:   JSON.stringify(headers)
    }, function(error, response, body){
        if (error) return next(error);
        console.log(body);
        data = JSON.parse(body).responses[0].labelAnnotations;
        tags = [];
        for(var i = 0; i < data.length; i++){
            tags[i] = data[i]["description"]
        }
        tags = tags.filter(function(e){
            wrong_words = ["plate","dish","food","table","meal","dinner","cuisine"]
            for(var i = 0; i <  wrong_words.length; i++){
                if (e == wrong_words[i]){
                    return false
                }
            }
            return true
        });
        res.json(tags)
    });

}