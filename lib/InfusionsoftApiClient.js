/**
 * Created by richardbrash on 11/24/14.
 */
/**
 * Created by richardbrash on 11/20/14.
 */

var xmlrpc = require('xmlrpc');
var Config = require('../models/config');


function InfusionsoftApiClient(){

    this.Caller = function(config, service, input, callback){

        var client = xmlrpc.createSecureClient('https://' + config.AppName + '.infusionsoft.com/api/xmlrpc');

        var data = [config.ApiKey].concat(input);

        client.methodCall(service, data, function(error, value){
            if(!error){
                callback(null, value);

            } else {
                callback(error, null);
            }
        });

    }

    //this.Caller = function(clientid, service, input, callback){
    //
    //    //  Get the config for the clientid passed in
    //    Config.findOne( { '_id':clientid } )
    //        .exec(function(err, clientConfig){
    //            if(!err){
    //
    //                var client = xmlrpc.createSecureClient('https://' + clientConfig.config.appName + '.infusionsoft.com/api/xmlrpc');
    //
    //                var data = [clientConfig.config.apiKey].concat(input);
    //
    //                client.methodCall(service, data, function(error, value){
    //                    if(!error){
    //                        callback(null, value);
    //
    //                    } else {
    //                        callback(error, null);
    //                    }
    //                });
    //            }
    //        });
    //
    //
    //}

}


//InfusionsoftApiClient.prototype.Query = function(table, skip, take, filter, wantedFields, callback ){
//
//    var self = this;
//    self.Caller("DataService.query", [table, skip, take, filter, wantedFields], function(result){
//
//        self.Caller("DataService.count", [table, filter], function(count){
//            result.totalForFilter = count.data;
//            callback(result);
//        });
//
//
//    });
//}
//
//InfusionsoftApiClient.prototype.Load = function(table, id, wantedFields, callback){
//    this.Caller("DataService.load", [table, id,wantedFields], callback);
//}
//
//
//InfusionsoftApiClient.prototype.Add = function(table, data, callback){
//    this.Caller("DataService.add", [table, data], callback);
//}
//
//InfusionsoftApiClient.prototype.Update = function(table, id, data, callback){
//    this.Caller("DataService.delete", [table, id, data], callback);
//}
//
//InfusionsoftApiClient.prototype.Delete = function(table, id, callback){
//    this.Caller("DataService.delete", [table, id], callback);
//}
//
//InfusionsoftApiClient.prototype.Count = function(table, filter){
//    this.Caller("DataService.count", [table, filter], callback);
//}

module.exports = new InfusionsoftApiClient();