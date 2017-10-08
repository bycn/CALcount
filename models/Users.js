/**
 * Created by bryanchen on 10/7/17.
 */
/**
 * Created by bryanchen on 7/14/16.
 */
//var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;
var mongoose = require("mongoose");
var userSchema = mongoose.Schema({
    uid: {type: Number, required: true, unique: true},
    name: { type: String, required: true},
    meals: {type: Object}
});

//userSchema.methods.checkPassword = function(guess, done) {
//    bcrypt.compare(guess, this.password, function(err, isMatch) {
//        done(err, isMatch);
//    });
//};
var User = mongoose.model("User", userSchema);
module.exports =  User;
