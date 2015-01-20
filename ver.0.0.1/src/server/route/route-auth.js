

/*
// satellizer
http://ngmodules.org/modules/satellizer
https://www.npmjs.com/package/satellizer
*/

// var mongoose = require('mongoose');
var qs = require('querystring');

// bcryptjs : Optimized bcrypt in plain JavaScript
// https://www.npmjs.com/package/bcryptjs
// var bcrypt = require('bcryptjs');

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
// var async = require('async');

var config = require('../config').auth;

function set (router){

    //-----------------------------------
    // DB Schema
    //-----------------------------------

    var User = require('../db/model').User;

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

    function errorHandler(err){
        if(err){
            console.log('\n//////////////////////////////////////////////////////////////////\n');
            console.log('-> [Auth DB Error] : ');
            console.log(err, err.stack);
            console.log('\n//////////////////////////////////////////////////////////////////\n');
        }
    }

    function send(response, code, message){
        return response.status(code).send({
            message: message
        });
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Request Route
    //
    ////////////////////////////////////////////////////////////////////////////

    //--------------------------------------------------------------------------
    // Create Email and Password Account
    //--------------------------------------------------------------------------
    
    router.post('/auth/signup', function(req, res, next) {

        User.findOne({ email: req.body.email }, function(err, user) {

            errorHandler(err);

            if (user) {
                return send(res, 409, 'Email is already taken');
            }

            var user = new User({
                email: req.body.email,
                password: req.body.password,
                displayName: req.body.displayName
            });

            console.log('* signup user : ', user);

            user.save(function() {
                res.send({ 
                    user: user, 
                    token: createToken(user) 
                });
            });
        });

    });

    router.post('/auth/signout', ensureAuthenticated, function(req, res) {

        User.findById(req.user, function(err, user) {

            console.log('* signout user : ', user);

            errorHandler(err);

            if (user == null) {
                // return send(res, 409, 'Email is already removed');
                res.status(200).end();
            }else{
                user.remove(function(err, user) {
                    res.send(user);
                });
            }
        });

    });

    //--------------------------------------------------------------------------
    // Log in with Email
    //--------------------------------------------------------------------------
     
    router.post('/auth/login', function(req, res) {

        User.findOne({ email: req.body.email }, '+password', function(err, user) {
            
            if (!user) {
                console.log('사용자 데이터 없음');
                return send(res, 401, 'Wrong email and/or password');
            }
            
            console.log('* login user : ', user);

            user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) {
                    console.log('비밀번호 일치하지 않음 : ', req.body.password);
                    return send(res, 401, 'Wrong email and/or password');
                }
                res.send({ 
                    user: user, 
                    token: createToken(user) 
                });
            });
        });

    });

    ////////////////////////////////////////////////////////////////////////////
    //
    // Profile
    //
    ////////////////////////////////////////////////////////////////////////////

    //--------------------------------------------------------------------------
    // GET /api/me
    //--------------------------------------------------------------------------
    
    // get Profile
    router.get('/api/me', ensureAuthenticated, function(req, res) {
        User.findById(req.user, function(err, user) {
            console.log('* get Profile user : ', user);
            res.send(user);
        });
    });


    //--------------------------------------------------------------------------
    // PUT /api/me
    //--------------------------------------------------------------------------
     
     // update Profile
    router.put('/api/me', ensureAuthenticated, function(req, res) {
        User.findById(req.user, function(err, user) {
            if (!user) {
                return send(res, 400, 'User not found');
            }

            user.displayName = req.body.displayName || user.displayName;
            user.email = req.body.email || user.email;
            user.save(function(err) {
                console.log('* update Profile user : ', user);
                res.status(200).end(user);
            });
        });
    });

    ////////////////////////////////////////////////////////////////////////////
    //
    // Authenticate
    //
    ////////////////////////////////////////////////////////////////////////////

    //--------------------------------------------------------------------------
    // Login with Google
    //--------------------------------------------------------------------------

    router.post('/auth/google', function(req, res) {
        var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
        var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

        console.log('* google req.body : ', req.body);

        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.GOOGLE_SECRET,
            redirect_uri: req.body.redirectUri,
            grant_type: 'authorization_code'
        };

        // Step 1. Exchange authorization code for access token.
        request.post( accessTokenUrl, { json: true, form: params }, function(err, response, token) {

            var accessToken = token.access_token;
            var headers = { Authorization: 'Bearer ' + accessToken };

            // Step 2. Retrieve profile information about the current user.
            request.get( { url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

                // Step 3a. Link user accounts.
                if (req.headers.authorization) {

                    User.findOne({ google: profile.sub }, function(err, existingUser) {
                        if (existingUser) {
                            return send(res, 409, 'There is already a Google account that belongs to you');
                        }
                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);
                        User.findById(payload.sub, function(err, user) {
                            if (!user) {
                                return send(res, 400, 'User not found');
                            }
                            user.google = profile.sub;
                            user.displayName = user.displayName || profile.name;
                            user.save(function() {
                                console.log('* google save user : ', user);
                                res.send({
                                    user: user, 
                                    token: createToken(user) 
                                });
                            });
                        });
                    });

                } else {

                    // Step 3b. Create a new user account or return an existing one.
                    User.findOne({ google: profile.sub }, function(err, existingUser) {
                        if (existingUser) {
                            console.log('* google existingUser : ', existingUser);
                            return res.send({
                                user: existingUser, 
                                token: createToken(existingUser) 
                            });
                        }
                        var user = new User();
                        user.google = profile.sub;
                        user.displayName = profile.name;
                        user.save(function(err) {
                            console.log('* google save user : ', user);
                            res.send({
                                user: user, 
                                token: createToken(user) 
                            });
                        });
                    });

                }

            });
        });
    });

    //--------------------------------------------------------------------------
    // Login with Facebook
    //--------------------------------------------------------------------------

    router.post('/auth/facebook', function(req, res) {
        var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
        var graphApiUrl = 'https://graph.facebook.com/me';
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: config.FACEBOOK_SECRET,
            redirect_uri: req.body.redirectUri
        };

        // Step 1. Exchange authorization code for access token.
        request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
            if (response.statusCode !== 200) {
                return send(res, 500, accessToken.error.message);
            }
            accessToken = qs.parse(accessToken);

            // Step 2. Retrieve profile information about the current user.
            request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
                if (response.statusCode !== 200) {
                    return send(res, 500, profile.error.message);
                }

                if (req.headers.authorization)
                {
                    User.findOne({ facebook: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            return send(res, 409, 'There is already a Facebook account that belongs to you');
                        }

                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);
                        User.findById(payload.sub, function(err, user) {
                            if (!user) {
                                return send(res, 400, 'User not found');
                            }
                            
                            user.facebook = profile.id;
                            user.displayName = user.displayName || profile.name;
                            user.save(function() {
                                console.log('* facebook save user : ', user);
                                res.send({
                                    user: user, 
                                    token: createToken(user) 
                                });
                            });
                        });
                    });

                } else {

                    // Step 3b. Create a new user account or return an existing one.
                    User.findOne({ facebook: profile.id }, function(err, existingUser) {
                        if (existingUser) {
                            console.log('* facebook existingUser : ', existingUser);
                            return res.send({
                                user: existingUser, 
                                token: createToken(existingUser) 
                            });
                        }
                        var user = new User();
                        user.facebook = profile.id;
                        user.displayName = profile.name;
                        user.save(function() {
                            console.log('* facebook save user : ', user);
                            res.send({
                                user: user, 
                                token: createToken(user) 
                            });
                        });
                    });

                }
            });
        });
    });

    //--------------------------------------------------------------------------
    // Login with Twitter
    //--------------------------------------------------------------------------
     
    router.get('/auth/twitter', function(req, res) {
        var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        var authenticateUrl = 'https://api.twitter.com/oauth/authenticate';

        if (!req.query.oauth_token || !req.query.oauth_verifier) {

            var requestTokenOauth = {
                consumer_key: config.TWITTER_KEY,
                consumer_secret: config.TWITTER_SECRET,
                callback: config.TWITTER_CALLBACK
            };

            // Step 1. Obtain request token for the authorization popup.
            request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
                var oauthToken = qs.parse(body);
                var params = qs.stringify({
                    oauth_token: oauthToken.oauth_token
                });

                // Step 2. Redirect to the authorization screen.
                res.redirect(authenticateUrl + '?' + params);
            });

        } else {

            var accessTokenOauth = {
                consumer_key: config.TWITTER_KEY,
                consumer_secret: config.TWITTER_SECRET,
                token: req.query.oauth_token,
                verifier: req.query.oauth_verifier
            };

            // Step 3. Exchange oauth token and oauth verifier for access token.
            request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, profile) {
                profile = qs.parse(profile);

                // Step 4a. Link user accounts.
                if (req.headers.authorization) {

                    User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
                        if (existingUser) {
                            return send(res, 409, 'There is already a Twitter account that belongs to you');
                        }

                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);
                        User.findById(payload.sub, function(err, user) {
                            if (!user) {
                                return send(res, 400, 'User not found');
                            }
                            
                            user.twitter = profile.user_id;
                            user.displayName = user.displayName || profile.screen_name;
                            user.save(function(err) {
                                console.log('* twitter save user : ', user);
                                res.send({
                                    user: user, 
                                    token: createToken(user) 
                                });
                            });
                        });
                    });

                } else {

                    // Step 4b. Create a new user account or return an existing one.
                    User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
                        if (existingUser) {
                            console.log('* twitter existingUser : ', existingUser);
                            return res.send({
                                user: existingUser, 
                                token: createToken(existingUser) 
                            });
                        }

                        var user = new User();
                        user.twitter = profile.user_id;
                        user.displayName = profile.screen_name;
                        user.save(function() {
                            console.log('* twitter save user : ', user);
                            res.send({
                                user: user, 
                                token: createToken(user) 
                            });
                        });
                    });

                }
            });

        }
    });

    //--------------------------------------------------------------------------
    // Login with Windows Live
    // Step 1. Exchange authorization code for access token.
    // Step 2. Retrieve profile information about the current user.
    // Step 3. [if] Link user accounts.
    // Step 3. [else] Create a new user or return an existing account.
    //--------------------------------------------------------------------------
    /*
    router.post('/auth/live', function(req, res) {
        async.waterfall([
            function(done) {
                var accessTokenUrl = 'https://login.live.com/oauth20_token.srf';
                var params = {
                    code: req.body.code,
                    client_id: req.body.clientId,
                    client_secret: config.WINDOWS_LIVE_SECRET,
                    redirect_uri: req.body.redirectUri,
                    grant_type: 'authorization_code'
                };
                request.post(accessTokenUrl, { form: params, json: true }, function(err, response, accessToken) {
                    done(null, accessToken);
                });
            },
            function(accessToken, done) {
                var profileUrl = 'https://apis.live.net/v5.0/me?access_token=' + accessToken.access_token;
                request.get({ url: profileUrl, json: true }, function(err, response, profile) {
                    console.log(profile);
                    done(err, profile);
                });
            },
            function(profile) {
                if (!req.headers.authorization) {

                    User.findOne({ live: profile.id }, function(err, user) {
                        if (user) {
                            return res.send({
                                user: user, 
                                token: createToken(user) 
                            });
                        }
                        var newUser = new User();
                        newUser.live = profile.id;
                        newUser.displayName = profile.name;
                        newUser.save(function() {
                            res.send({
                                user: newUser, 
                                token: createToken(newUser) 
                            });
                        });
                    });

                } else {

                    User.findOne({ live: profile.id }, function(err, user) {
                        if (user) {
                            return res.status(409).send({ message: 'There is already a Windows Live account that belongs to you' });
                        }
                        var token = req.headers.authorization.split(' ')[1];
                        var payload = jwt.decode(token, config.TOKEN_SECRET);
                        User.findById(payload.sub, function(err, existingUser) {
                            if (!existingUser) {
                                return res.status(400).send({ message: 'User not found' });
                            }
                            existingUser.live = profile.id;
                            existingUser.displayName = existingUser.name;
                            existingUser.save(function() {
                                var token = createToken(existingUser);
                                res.send({ token: token });
                            });
                        });
                    });
                }
            }
        ]);
    });
    */

    //--------------------------------------------------------------------------
    // Unlink Provider
    //--------------------------------------------------------------------------

    router.get('/auth/unlink/:provider', ensureAuthenticated, function(req, res) {
        var provider = req.params.provider;
        User.findById(req.user, function(err, user) {
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }
            user[provider] = undefined;
            user.save(function() {
                res.status(200).end();
            });
        });
    });





































    //////////////////////////////////////
    // end router define
    //////////////////////////////////////

}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.set = set;