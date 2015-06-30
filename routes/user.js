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

  Account.find({ $or:[{'parent': req.user._id},{ '_id':req.user._id }]})
      .populate('configs')
      .exec(function(err, users){
        if (err){
          console.log(err);
          res.send(err);
        } else {
          res.json(users);
        }
      });
});

//  /user/id
router.get('/:id', authLib.validateToken, function(req,res){

  Account.findOne( { '_id':req.id } )
      .populate('configs')
      .exec(function(err, user){
        if (err){
          console.log(err);
          res.send(err);
        } else {

          if( (req.id == req.user._id) || (user.parent.equals(req.user._id))  ){
            res.json(user);
          } else {
            res.json({});
          }

        }

      });

});

router.post("/", function(req,res){

  var user = new User(req.body);
  user.save(function(err){
    if (err) {
      console.log(err);
      res.send(err);
    } else{
      res.json({ message: 'Saved!' });
    }
  });

});


//  /user/userid
router.put('/:accountid', function(req,res){

  var body = req.body;
  res.json({body:body});

});


//router.get('/config', function(req,res){
//
//  var clientConfig = new ClientConfig({
//    clientName: "TestTwo",
//    apiKey: "API01",
//    appName: "Asjerguib2345azdjbwerg98hergjhbg9wv8hpwb34g5ubv897ewrg5"
//  });
//
//  clientConfig.save();
//
//  User.findById("549882a9b1e9d77504115740", function(err, user){
//    user.configs.push(clientConfig);
//
//    user.save(function(err){
//      if (err) {
//        console.log(err);
//        res.send(err);
//      } else{
//        res.json({ message: 'Saved!' });
//      }
//    });
//  })
//
//});







module.exports = router;
