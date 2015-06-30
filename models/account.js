/**
 * Created by richardbrash on 12/5/14.
 */
// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var Config = require('../models/config');


// Define our user schema
var AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    parent:{type: Schema.Types.ObjectId, ref: 'Account'},
    configs:[{type: Schema.Types.ObjectId, ref: 'Config'}],

    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Execute before each user.save() call
AccountSchema.pre('save', function(callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

AccountSchema.methods.sanitize = function(){
    return {
        username:this.username,
        email:this.email
    }

}

AccountSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Export the Mongoose model
module.exports = mongoose.model('Account', AccountSchema);
