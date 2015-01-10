

/*
// satellizer
http://ngmodules.org/modules/satellizer
https://www.npmjs.com/package/satellizer
*/

var mongoose = require('mongoose');
var qs = require('querystring');

// bcryptjs : Optimized bcrypt in plain JavaScript
// https://www.npmjs.com/package/bcryptjs
var bcrypt = require('bcryptjs');

// jwt-simple : JWT(JSON Web Token) encode and decode module
// https://www.npmjs.com/package/jwt-simple
var jwt = require('jwt-simple');

// moment : Parse, validate, manipulate, and display dates
// https://www.npmjs.com/package/moment
var moment = require('moment');

// request : Simplified HTTP request client.
// https://www.npmjs.com/package/request
var request = require('request');

// async : Higher-order functions and common patterns for asynchronous code
var async = require('async');

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

    //////////////////////////////////////
    // Util
    //////////////////////////////////////

    // Login Required Middleware
    function ensureAuthenticated(req, res, next) {

        if (!req.headers.authorization) {
            return res.status(401).send({
                message: 'Please make sure your request has an Authorization header' 
            });
        }
        
        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, config.TOKEN_SECRET);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'Token has expired'
            });
        }

        req.user = payload.sub;
        next();
    }

    // Generate JSON Web Token
    function createToken(user) {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, config.TOKEN_SECRET);
    }

    //////////////////////////////////////
    // Request Route
    //////////////////////////////////////

    //--------------------------------------------------------------------------
    // Create Email and Password Account
    //--------------------------------------------------------------------------
    
    router.post('/auth/signup', function(req, res, next) {

        console.log('config : ', config);

        User.findOne({ email: req.body.email }, function(err, existingUser) {

            console.log('existingUser : ', existingUser);

            if (existingUser) {
                return res.status(409).send({
                    message: 'Email is already taken'
                });
            }

            var user = new User({
                displayName: req.body.displayName,
                email: req.body.email,
                password: req.body.password
            });
            console.log('user : ', user);

            user.save(function() {
                res.send({ token: createToken(user) });
            });
        });

    });






lynndylanhurley/ng-token-auth 으로 다시 시도할것
https://github.com/lynndylanhurley/ng-token-auth
http://ng-token-auth-demo.herokuapp.com/#/




/*
http://localhost:8000/history#/signup
// satellizer
http://ngmodules.org/modules/satellizer
https://www.npmjs.com/package/satellizer
https://satellizer.herokuapp.com/#/profile
*/


//--------------------------------------------------------------------------
// Log in with Email
//--------------------------------------------------------------------------
 
// app.post('/auth/login', function(req, res) {

//     User.findOne({ email: req.body.email }, '+password', function(err, user) {
        
//         if (!user) {
//             return res.status(401).send({
//                 message: 'Wrong email and/or password'
//             });
//         }
        
//         user.comparePassword(req.body.password, function(err, isMatch) {
//             if (!isMatch) {
//                 return res.status(401).send({
//                     message: 'Wrong email and/or password'
//                 });
//             }
//             res.send({ token: createToken(user) });
//         });
//     });

// });











































    //////////////////////////////////////
    // end router define
    //////////////////////////////////////

}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.set = set;