/**
 * Created by richardbrash on 11/24/14.
 */

var express = require('express');
var InfusionsoftApiClient = require('../lib/InfusionsoftApiClient');
var Config = require('../config');
var rbmJSONResponse = require("../lib/rbmJSONResponse");

var router = express.Router();

router.param('service', function(req, res, next, service){

    req.service = service;
    next();

});

router.param('appName', function(req, res, next, appName){

    var input = req.body;
    var config = Config.ISConfig(appName);
    req.appname = appName;

    if(input.ApiToken == config.ApiToken){
        req.config = config;
    }

    next();

});

router.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();

});

//router.post('/api/:service', authLib.validateToken, function(req, res){
//
//    if(req.user){
//
//        var input = req.body;
//
//        InfusionsoftApiClient.Caller(req.client, req.service, input, function(error, value){
//            if(!error){
//                res.json({success:true, data: value, error:null});
//
//            } else {
//                res.json({success:false, data:null, error: error});
//            }
//        });
//
//    } else {
//        res.json({success:false, data:null, error: "Access Token not valid"});
//    }
//
//});


router.post('/api/:appName/:service', function(req, res){

    if(req.config){

        var input = req.body;


        InfusionsoftApiClient.Caller(req.config,req.service, input.input, function(error, data){
            if(error){
                res.json(rbmJSONResponse.errorResponse(error));
            } else {
                res.json(rbmJSONResponse.successResponse(data));
            }
        })

    } else {
        res.json(rbmJSONResponse.errorResponse({message:"Access Token not valid"}));
    }

});

router.post("/valueadd/formhandler", function(req,res){

    var input = req.body;

    var grpid = null;
    var asid = null;
    var successUrl = null;
    var errorUrl = null;
    var clientid = null;
    var dupcheck = null;
    var posted = {};

    for(var attrib in input){

        switch(attrib){
            case "clientid":
                clientid = input[attrib];
                break;
            case "dupcheck":
                dupcheck = input[attrib];
                break;
            case "successUrl":
                successUrl = input[attrib];
                break;
            case "errorUrl":
                errorUrl = input[attrib];
                break;
            case "runaction":
                asid = input[attrib];
                break;
            case "addtogroup":
                grpid = input[attrib];
                break;
            default:
                posted[attrib] = input[attrib];

        }

    }

    var service = null;
    var packet = [posted];

    if(dupcheck == null){
        service = "ContactService.add";
    } else{
        service = "ContactService.addWithDupCheck";
        packet = packet.concat(dupcheck);

    }

    InfusionsoftApiClient.Caller(clientid, service, packet, function(error, value){

        if(!error){

            if(grpid != null){
                InfusionsoftApiClient.Caller(clientid, "ContactService.addToGroup", [value, parseInt(grpid)], function(error, valuegrp){});
            }

            if(asid != null){
                InfusionsoftApiClient.Caller(clientid, "ContactService.runActionSequence", [value, parseInt(asid)], function(error, valueas){});
            }

            posted["Id"] = value;
            posted["message"] = "Data posted";
            
            res.redirect(errorUrl + "#" + JSON.stringify(posted));


        } else {
            res.redirect(errorUrl + "#" + error.message);
        }
    });

});


module.exports = router;

