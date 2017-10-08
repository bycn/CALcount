var User = require('../models/Users.js');
module.exports = function(req,res){
    User.findOne({uid: req.query.uid}, function(err,user){
        if(err) {console.log(err)}
        else{
            user.meals.push(eval(req.query.meal));
            user.markModified('meals');
            user.save();
            res.send("saved")
        }
    })
}