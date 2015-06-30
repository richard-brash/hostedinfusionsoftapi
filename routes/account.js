var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Config = require('../models/config');
var authLib = require('../lib/auth');

router.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();

});

router.param('client', function(req, res, next, client){

    req.client = client;
    next();

});


router.get("/token/:client", authLib.authenticateLocal, function(req,res){

    //  We got here authenticated
    Account.findOne({'_id':req.user._id })
        .populate('configs')
        .exec(function(err, user){
            if (err){
                console.log(err);
                res.send(err);
            } else {
                var cfg = null;
                user.configs.forEach(function(config){
                    //  We are checking to see if this Client config has been granted to us
                    if(config._id == req.client){
                        cfg = config;
                    }
                });

                if(cfg != null){
                    res.json(authLib.issueToken(req.user, req.client));
                } else {
                    res.send("Not authorized!");
                }

            }
        });




});


module.exports = router;
