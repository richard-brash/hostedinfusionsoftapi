var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var Config = require('../models/config');
var authLib = require('../lib/auth');

router.param('id', function(req, res, next, id){

    req.id = id;
    next();

});


//  /user
router.get('/', authLib.validateToken, function(req,res){

    //  Find me and populate configs
    Account.findOne({'_id':req.user._id })
        .populate('configs')
        .exec(function(err, user){
            if (err){
                console.log(err);
                res.send(err);
            } else {

                var configs = [];

                user.configs.forEach(function(config){
                    configs.push(config);
                })

                res.json(configs);
            }
        });

});

//  /user/id
router.get('/:id', authLib.validateToken, function(req,res){

    //  Find me and populate configs
    Account.findOne({'_id':req.user._id })
        .populate('configs')
        .exec(function(err, user){
            if (err){
                console.log(err);
                res.send(err);
            } else {
                var cfg = {};
                user.configs.forEach(function(config){
                    if(config._id == req.id){
                        cfg = config;
                    }
                });

                res.json(cfg);
            }
        });

});





module.exports = router;
