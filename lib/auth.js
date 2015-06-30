/**
 * Created by richardbrash on 12/19/14.
 */

// Load required packages
var express = require('express');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var url = require('url');
var jwt = require('jwt-simple');
var moment = require('moment');
var Account = require('../models/account');


var app = express();
app.set('jwtTokenSecret', 'MySup3rSucr3tP@ssw0rd');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new BasicStrategy(
    function(username, password, callback) {
        Account.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, user);
            });
        });
    }
));

passport.use(new LocalStrategy({passReqToCallback : true},
    function(req, username, password, done) {
    Account.findOne({ username: username }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, req.loginmsg = { message: 'Incorrect username.' });
        user.verifyPassword(password, function(err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, req.loginmsg = { message: 'Incorrect password.' });
            }
        });
    });
}));

exports.issueToken = function(user, client){

    var expires = moment().add(7, 'days').valueOf();
    var token = jwt.encode({
        iss: user.id,
        exp: expires,
        client:client
    }, app.get('jwtTokenSecret'));

    return {
        token : token,
        expires: expires,
        user: user.sanitize()
    };
};

exports.validateToken = function(req, res, next){

    // Parse the URL, we might need this
    var parsed_url = url.parse(req.url, true)

    /**
     * Take the token from:
     *
     *  - the POST value access_token
     *  - the GET parameter access_token
     *  - the x-access-token header
     *    ...in that order.
     */
    var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

    if (token) {

        try {
            var decoded = jwt.decode(token, app.get('jwtTokenSecret'))

            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', 400);
            }

            Account.findOne({'_id':decoded.iss })
                .populate('configs')
                .exec(function(err, user){
                    if (!err){
                        //  Make sure we still have access to this client
                        user.configs.forEach(function(config){
                            if(config._id == decoded.client){
                                req.user = user;
                                req.client = decoded.client;
                                return next()
                            }
                        });
                    }
                });


        } catch (err) {
            return next(err)
        }

    } else {
        res.end('Invalid Access token', 400);
    }


}

exports.authenticateLocal = passport.authenticate('local', {session:false});
exports.isAuthenticated = passport.authenticate('basic', { session : false });