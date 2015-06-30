var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var ejs = require('ejs');
var passport = require('passport');
var nodemailer = require('nodemailer');

//  Require the routes
var routes = require('./routes/index');
var user = require('./routes/user');
var client = require('./routes/client');
var account = require('./routes/account');
var infusionsoftapi = require('./routes/infusionsoftAPI');


// Connect to the beerlocker MongoDB
//mongoose.connect('mongodb://localhost:27017/hostedapi');

var app = express();

app.use(passport.initialize());

app.set("env", "development");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Use the routes
app.use('/', routes);
app.use('/user', user);
app.use('/client', client);
app.use('/account', account);
app.use('/infusionsoft', infusionsoftapi);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
