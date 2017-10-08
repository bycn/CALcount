/**
 * Created by bryanchen on 10/8/17.
 */
var User = require('../models/Users.js');

module.exports = function(req,res,next){
    User.findOne({uid: req.query.uid}, function (err, user) {
        console.log("here")
        if (err) {
            console.log(err);
            return next(err);
        }
        if (user) {
            console.log("user already exists");
            return next()
        }
        console.log("new User");
        var newUser = new User({
            uid: req.query.uid,
            name: req.query.name,
            meals: []
        });
        newUser.save(function (err) {
            if (err) return next(err);
            res.send("User created")
        });
    })
}