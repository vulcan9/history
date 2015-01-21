


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// bcryptjs : Optimized bcrypt in plain JavaScript
// https://www.npmjs.com/package/bcryptjs
var bcrypt = require('bcryptjs');


//////////////////////////////////////
// Body
//////////////////////////////////////

// 외래키 잡기
// http://mobicon.tistory.com/292

function checkDate(doc){
    if(doc._create === undefined) doc._create = new Date();
    doc._update = new Date();
}

//-----------------------------------
// User DB Schema
//-----------------------------------

function setUser()
{
    var schema = new Schema({
        email:           { type: String, required:true, unique: true, lowercase: true },
        password:    { type: String, required:true, select: false },
        
        // facebook: String,
        // foursquare: String,
        // google: String,
        // github: String,
        // linkedin: String,
        // live: String,
        // yahoo: String,
        // twitter: String,

        displayName: String,
        _create  : { type: Date, default: Date.now },
        _update  : { type: Date, default: Date.now }
    });

    // hook middleware 정의, post는 사후처리
    schema.pre('save', function(next) {
        var doc = this;
        checkDate(doc);

        if (!doc.isModified('password')) {
            return next();
        }

        // 비밀번호 변경된 경우 hash로 변경
        bcrypt.genSalt(10, function(err, salt) {
            console.log('비밀번호 암호화1 : ', salt);
            bcrypt.hash(doc.password, salt, function(err, hash) {
                console.log('비밀번호 암호화2 : ', hash);
                doc.password = hash;
                next();
            });
        });

        /*
        // 비밀번호 변경 체크
        if (doc.isModified('password')) {
            // 비밀번호 변경된 경우 hash로 변경
            bcrypt.genSalt(10, function(err, salt) {
                console.log('비밀번호 암호화1 : ', salt);
                bcrypt.hash(doc.password, salt, function(err, hash) {
                    console.log('비밀번호 암호화2 : ', hash);
                    doc.password = hash;
                    return next();
                });
            });
        }
        return next();
        */
    });

    schema.methods.comparePassword = function(password, done) {
        console.log('비교 : ', password);
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if(err){
                console.log('비교 에러 : ', err);
            }
            console.log('비교 결과 : ', isMatch);
            done(err, isMatch);
        });
    };

    var User = mongoose.model('User', schema);
    return User;
}

//-----------------------------------
// Tool DB Schema
//-----------------------------------

function setTool()
{
    var schema = new Schema({
        // unique ID (email)
        user: { type: String, required:true, unique: true, lowercase: true },
        // Json Data 로 저장
        tool: { type: String, required:true },

        _create  : { type: Date, default: Date.now },
        _update  : { type: Date, default: Date.now }
    });

    schema.pre('save', function(next) {
        var doc = this;
        checkDate(doc);

        return next();
    });

    var Tool = mongoose.model('Tool', schema);
    return Tool;
}

//-----------------------------------
// Project DB Schema
//-----------------------------------

// MongoError: E11000 Duplicate Key Error Index 가 발생하는 경우 
// 콘솔에서 db.project.dropIndexes() 를 실행시킨다.
// http://stackoverflow.com/questions/10081452/drop-database-with-mongoose

function setProject()
{
    var schema = new Schema({
        // _id: Schema.Types.ObjectId,
        // project UID
        uid: { type: String, required:true, unique: true },
        // user ID (_id)
        user: { type: String, required:true },
        // Json Data 로 저장
        project: { type: String },
        
        _create  : { type: Date, default: Date.now },
        _update  : { type: Date, default: Date.now }
    });

    schema.pre('save', function(next) {
        var doc = this;
        checkDate(doc);

        return next();
    });

    var Project = mongoose.model('Project', schema);
    return Project;
}

//-----------------------------------
// Document DB Schema
//-----------------------------------

function setDocument()
{
    var schema = new Schema({
        // document UID
        uid: { type: String, required:true, unique: true },
        // user ID (_id)
        user: { type: String, required:true },
        // Json Data 로 저장
        document: { type: String },
        
        _create  : { type: Date, default: Date.now },
        _update  : { type: Date, default: Date.now }
    });

    schema.pre('save', function(next) {
        var doc = this;
        checkDate(doc);

        return next();
    });

    var Document = mongoose.model('Document', schema);
    return Document;
}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.User = setUser();
exports.Tool = setTool();
exports.Project = setProject();
exports.Document = setDocument();