
console.log('::::::::::::::::: HI-STORY Server :::::::::::::::::');
console.log(' 1. mongodb.bat를 먼저 실행하세요.');
console.log(' 2. nodeRun.bat를 먼저 실행하세요.');
console.log(' 3. mongo.exe 콘솔은 이후에 사용하실수 있습니다.');

console.log(' 4. 브라우져에서 (예 : http://localhost:8000/history) 를 통해 접속하세요');

var server = require('./server');
var database = require('./database');
var path = require('path');


//-----------------------------------
// 설정값
//-----------------------------------

/*
var config = {
    local: {
        mode: 'local',
        port: 3000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        }
    },
    staging: {
        mode: 'staging',
        port: 4000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        }
    },
    production: {
        mode: 'production',
        port: 5000,
        mongo: {
            host: '127.0.0.1',
            port: 27017
        }
    }
};
*/

// console.log('__dirname------------->', __dirname);
// var p = path.dirname(require.main.filename);

// 실제 node는 server 폴더의 상위 폴더에서 실행되므로 server.js의 parent로 경로를 보정해 준다.
global.__root = path.resolve(__dirname, '../');

// 절대 경로 사용
global.__useStaticPath = false;
console.log(' * root path : ', global.__root);

//-----------------------------------
// DB-Server 연결
//-----------------------------------

// 서버 환경 연결
connect();

function connect (){
    // DB 연결 
    database.connect (function(){
        // Server 실행
        server.start(8000);
    });
}

//-----------------------------------
// DataBase - Server 연결
//-----------------------------------

/*
function dbConnect(){
    var DB = require('./app/db');
    DB.connect(config.database, function(err, db){
        if (err) {
            throw '# DB연결 실패 : \n' + err;
        }
        console.log('# DB connected to : ', 'mongodb://' + config.database.host + ':' + config.database.port);
        
        // db 객체를 저장해 둔다
        // app.set('DB_OBJECT', db);

        // Server 연결
        serverConnect();
    }); 
}
*/


/*

// satellizer
// http://ngmodules.org/modules/satellizer
https://www.npmjs.com/package/satellizer













var MongoClient = require('mongodb').MongoClient;

module.exports = {
    connect : function(database, callback){
        
        var host = database.host;
        var port = database.port;
        var type = database.type;
        
        if(type == "mongodb")
        {
            MongoClient.connect(
                'mongodb://' + host + ':' + port + '/fdeskViewer', 
                function(err, db)
                {
                    if(callback && typeof callback == "function"){
                        if (err){
                            console.log('Sorry, there is no mongo db server running.');
                        }else{
                            callback(err, db);
                        }
                    }
                }
            );
        }
        else
        {
            console.log('# 아직 지원되지 않는 DB 형식입니다.');
        }
    }
};

function callback(err, db)
{
        var attachDB = function(req, res, next){
            req.db = db;
            next();
        };
        



        app.all('/admin*', attachDB, function(req, res, next) {
            Admin.run(req, res, next);
        });         
        app.all('/blog/:id', attachDB, function(req, res, next) {
            Blog.runArticle(req, res, next);
        }); 
        app.all('/blog', attachDB, function(req, res, next) {
            Blog.run(req, res, next);
        }); 
        app.all('/services', attachDB, function(req, res, next) {
            Page.run('services', req, res, next);
        }); 
        app.all('/careers', attachDB, function(req, res, next) {
            Page.run('careers', req, res, next);
        }); 
        app.all('/contacts', attachDB, function(req, res, next) {
            Page.run('contacts', req, res, next);
        }); 
        app.all('/', attachDB, function(req, res, next) {
            Home.run(req, res, next);
        });
}
*/






























































