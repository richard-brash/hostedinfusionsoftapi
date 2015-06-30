/**
 * Created by richardbrash on 12/5/14.
 */
// Load required packages
var mongoose = require('mongoose');
var Account = require('../models/account');
var Schema = mongoose.Schema;

// Define our client schema
var ConfigSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    config:{type:Object, required:true},
    owner:{type: Schema.Types.ObjectId, ref: 'Account'}
});

module.exports = mongoose.model('Config', ConfigSchema);