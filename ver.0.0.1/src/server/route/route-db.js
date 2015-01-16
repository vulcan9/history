

/*
// satellizer
http://ngmodules.org/modules/satellizer
https://www.npmjs.com/package/satellizer
*/

var mongoose = require('mongoose');
var qs = require('querystring');

// bcryptjs : Optimized bcrypt in plain JavaScript
// https://www.npmjs.com/package/bcryptjs
// var bcrypt = require('bcryptjs');

// jwt-simple : JWT(JSON Web Token) encode and decode module
// https://www.npmjs.com/package/jwt-simple
// var jwt = require('jwt-simple');

// moment : Parse, validate, manipulate, and display dates
// https://www.npmjs.com/package/moment
// var moment = require('moment');

// request : Simplified HTTP request client.
// https://www.npmjs.com/package/request
var request = require('request');

// async : Higher-order functions and common patterns for asynchronous code
// var async = require('async');

var config = require('../config').auth;

function set (router){
    /*
    router.use (function(req, res, next) {
        console.log('auth route : ---------------->');
        next();
    });
    */

    //-----------------------------------
    // DB Schema
    //-----------------------------------

    /*
    var userSchema = new mongoose.Schema({
        email: { type: String, unique: true, lowercase: true },
        password: { type: String, select: false },
        displayName: String,
        facebook: String,
        foursquare: String,
        google: String,
        github: String,
        linkedin: String,
        live: String,
        yahoo: String,
        twitter: String
    });

    // hook middleware 정의
    userSchema.pre('save', function(next) {
        var user = this;
        if (!user.isModified('password')) {
            return next();
        }
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                next();
            });
        });
    });

    userSchema.methods.comparePassword = function(password, done) {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            done(err, isMatch);
        });
    };

    var User = mongoose.model('User', userSchema);
    */

    //////////////////////////////////////
    // Util
    //////////////////////////////////////

    function errorHandler(err){
        if(err){
            console.log('\n//////////////////////////////////////////////////////////////////\n');
            console.log('-> [Call DB Error] : ');
            console.log(err, err.stack);
            console.log('\n//////////////////////////////////////////////////////////////////\n');
        }
    }

    function send(response, code, message){
        return response.status(401).send({
            message: message
        });
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Request Route
    //
    ////////////////////////////////////////////////////////////////////////////

    router.post('/data/save/document', function(req, res, next) {
        res.send('success');
    });
    
    router.post('/data/save/project', function(req, res, next) {
        res.send('success');
    });

    //--------------------------------------------------------------------------
    // Create Email and Password Account
    //--------------------------------------------------------------------------
    





































    //////////////////////////////////////
    // end router define
    //////////////////////////////////////

}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.set = set;