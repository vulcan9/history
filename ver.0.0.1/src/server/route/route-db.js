
var mongoose = require('mongoose');
var model = require('../db/model');

function set (router){

    //-----------------------------------
    // DB Schema
    //-----------------------------------

    var User = model.User;
    var Tool = model.Tool;
    var Project = model.Project;
    var Document = model.Document;

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
        message = message || 'success';
        return response.status(code).send({
            message: message
        });
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Request Route
    //
    ////////////////////////////////////////////////////////////////////////////
    
    router.param('user', function(req, res, next, id){
        
        // DB에서 User를 검색한다.
        User.findOne({ _id: id }, function(err, user) {

            errorHandler(err);
            if(err) return res.status(401).send(err);

            if (user) {
                console.log('USER 검색 : ', user._id);

                // 이후 user데이터를 계속 참조할 수 있다.
                req.user = user;
                return next();
            }else{
                return send(res, 401, '사용자를 찾을 수 없습니다.');
            }
        });
    });

    /*
    // this route uses the ":user" named parameter
    // which will cause the 'user' param callback to be triggered
    router.get('/data/:user', function(req, res, next) {
      // req.user WILL be defined here
      // if there was an error, normal error handling will be triggered
      // and this function will NOT execute
    });
    
    router.param('id', function (req, res, next, id) {
        console.log('CALLED ONLY ONCE');
        next();
    });
    */

    // requireAuthentication
    router.route('/user/:user/*')
    .all(function(req, res, next) {

        // 인증되지 않은 상태이면 업데이트 하지 않는다.
        console.log('USER requireAuthentication : ', req.user.email);

        next();
    });

    //--------------------------------------------------------------------------
    // Tool Data
    //--------------------------------------------------------------------------
    
    router.route('/user/:user/tool')
    .post(function(req, res, next) {
        console.log('tool post : ', req.user.email);

        Tool.findOne({ user: req.user._id }, function(err, doc){
            errorHandler(err);
            if(err) return res.status(401).send(err);

            if (!doc) {
                // 데이터 없음
                console.log('* Tool 데이터 생성 : ', req.user._id);
                doc = new Tool({
                    user: req.user._id,
                    // uid: req.body.uid,
                    tool: req.body.tool
                });
            }else{
                // 수정될 값 변경
                doc.tool = req.body.tool;
            }

            doc.save(function(err, doc) {
                if(err){
                    errorHandler(err);
                    return res.send(err);
                }

                // 데이터 업데이트
                console.log('* Tool 데이터 업데이트: ', req.user._id);
                return send(res, 200);
            });
        });

    })
    /*
    .get(function(req, res, next) {
        console.log('project get : ', req.user);
        res.send('get success');
    })
    .put(function(req, res, next) {
        console.log('project put : ', req.user);
        res.send('put success');
    })
    .delete(function(req, res, next) {
        console.log('project delete : ', req.user);
        res.send('delete success');
    });
    */

    //--------------------------------------------------------------------------
    // Project Data
    //--------------------------------------------------------------------------
    
    router.route('/user/:user/project')
    .post(function(req, res, next) {

        console.log('* Project post : ', req.user._id);
        console.log('* Project 데이터 검색 : ', req.body.uid);

        Project.findOne({ uid: req.body.uid }, function(err, doc){
            errorHandler(err);
            if(err) return res.status(401).send(err);

            if (!doc) {
                // 데이터 없음
                doc = new Project({
                    // _id: new mongoose.Types.ObjectId,
                    uid: req.body.uid,
                    user: req.body.user,
                    project: req.body.project
                });
                console.log('* Project 데이터 생성 : ', doc._id);

            }else{
                // 수정될 값 변경
                doc.project = req.body.project;
                console.log('* Project 데이터 업데이트 : ', doc._id);
            }

            doc.save(function(err, doc) {
                if(err){
                    errorHandler(err);
                    return res.send(err);
                }

                // 데이터 업데이트
                console.log('* Project 업데이트 완료: ', req.body.user);
                // return send(res, 200);
                return res.send({ 
                    uid: req.body.uid
                });
            });

        });
    })
    /*
    .get(function(req, res, next) {
        console.log('project get : ', req.user);
        res.send('get success');
    })
    .put(function(req, res, next) {
        console.log('project put : ', req.user);
        res.send('put success');
    })
    .delete(function(req, res, next) {
        console.log('project delete : ', req.user);
        res.send('delete success');
    });
    */

    //--------------------------------------------------------------------------
    // Document Data
    //--------------------------------------------------------------------------
    
    router.route('/user/:user/document')
    .post(function(req, res, next) {

        console.log('* Document post : ', req.user._id);
        console.log('* Document 데이터 검색 : ', req.body.uid);

        Document.findOne({ uid: req.body.uid }, function(err, doc){
        
            errorHandler(err);
            if(err) return res.status(401).send(err);

            if (!doc) {
                // 데이터 없음
                doc = new Document({
                    uid: req.body.uid,
                    user: req.user._id,
                    document: req.body.document
                });
                console.log('* Document 데이터 생성 : ', doc._id);
                
            }else{
                // 수정될 값 변경
                doc.document = req.body.document;
                console.log('* Project 데이터 업데이트 : ', doc._id);
            }

            doc.save(function(err, doc) {
                if(err){
                    errorHandler(err);
                    return res.send(err);
                }

                // 데이터 업데이트
                console.log('* Document 데이터 완료: ', req.user._id);
                return send(res, 200);
            });
        });
        
    })
    /*
    .get(function(req, res, next) {
        console.log('document get : ', req.user);
        res.send('get success');
    })
    .put(function(req, res, next) {
        console.log('document put : ', req.user);
        res.send('put success');
    })
    .delete(function(req, res, next) {
        console.log('document delete : ', req.user);
        res.send('delete success');
    });
    */






































    //////////////////////////////////////
    // end router define
    //////////////////////////////////////

}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.set = set;