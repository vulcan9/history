console.log('\n\n');
console.log('::::::::::::::::: HI-STORY Server :::::::::::::::::');
console.log(' 1. mongodb.bat를 먼저 실행하세요.');
console.log(' 2. nodeRun.bat를 먼저 실행하세요.');
console.log(' 3. mongo.exe 콘솔은 이후에 사용하실수 있습니다.');

console.log(' 4. 브라우져에서 (예 : http://localhost:8000/history) 를 통해 접속하세요');
console.log('\n');



/**
 * 참고 사이트
 * http://expressjs.com/4x/api.html
 * https://github.com/strongloop/express/wiki/Migrating%20from%203.x%20to%204.x
 */

var path = require('path');
var fs = require('fs');

//-----------------------------------
// EXPRESS 4.X
//-----------------------------------

var express = require('express');
var app = express();

// app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 절대 경로 사용
app.set('PATH_USE_STATIC', false);
console.log(' * 절대 경로 사용 여부 : ', app.get('PATH_USE_STATIC'));

// 실제 node는 server 폴더의 상위 폴더에서 실행되므로 server.js의 parent로 경로를 보정해 준다.
var _path_root = path.resolve(__dirname, '../');
app.set('PATH_ROOT', _path_root);
var _path_server = __dirname;
app.set('PATH_SERVER', _path_server);

console.log(' * server 실행 JS 파일 : ', require.main.filename);
console.log(' * 실행 JS 파일 폴더 : ', path.dirname(require.main.filename));
// console.log(' * __dirname 변수 : ', __dirname);
console.log(' * ROOT : ', _path_root);
console.log(' * SERVER ROOT : ', _path_server);

// URL Root 설정 (Home url에 쓰이는 가상 경로)
app.set('URL_HOME_PREFIX', '/history');
console.log(' * HOME URL : ', app.get('URL_HOME_PREFIX'));
console.log('\n');

// console.log('\n\n');

////////////////////////////////////////////////////////////////////////////
// Middleware
////////////////////////////////////////////////////////////////////////////

var favicon = require('serve-favicon');
app.use(favicon(_path_root + '/favicon.ico'));

//-----------------------------------
// morgan : https://www.npmjs.com/package/morgan
//-----------------------------------
// app.use(express.logger('dev'));

var logger = require('morgan');
app.use(logger('dev'));

// create a write stream (in append mode)
// var log_file = _path_server + '/access.log';
// var accessLogStream = fs.createWriteStream(log_file, {flags: 'a'})
// app.use(logger('combined', {stream: accessLogStream}));

//-----------------------------------
// method-override :  https://www.npmjs.com/package/method-override
//-----------------------------------

var methodOverride = require('method-override');
app.use(methodOverride());
// override with the X-HTTP-Method-Override header in the request
// app.use(methodOverride('X-HTTP-Method-Override'));

//-----------------------------------
// express-session : https://www.npmjs.com/package/express-session
//-----------------------------------

var secret = 'Hi-Story-Cookie';
console.log(' * 쿠키 secret : ', secret);

var session = require('express-session');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret 
}));

/*
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));
*/

//-----------------------------------
// body-parser : https://www.npmjs.com/package/body-parser
//-----------------------------------

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var multer = require('multer');
app.use(multer());

//-----------------------------------
// cookie-parser : https://www.npmjs.com/package/cookie-parser
//-----------------------------------

var cookieParser = require('cookie-parser');
app.use(cookieParser(secret));

//-----------------------------------
// serve-static : https://www.npmjs.com/package/serve-static
//-----------------------------------

// 정적 디렉토리 설정
// "less-middleware": "0.1.12"
// app.use(require('less-middleware')({ src: _path_server + '/public' }));

var serveStatic = require('serve-static');

// Serve up folder
var dir_public = path.join(_path_server, 'public');
var serve = serveStatic(dir_public, {
    'index': ['index.html', 'index.htm']
});
app.use(serve);
// app.use(express.static(path.join(_path_server, 'public')));

//-----------------------------------
//라우터 설정 : http://expressjs.com/4x/api.html#router
//-----------------------------------

var router = express.Router({
    strict : false,
    caseSensitive : true,
    mergeParams : false
});
var routeConfig = require('./route/route-configuration');
routeConfig.set(router, app);

//-----------------------------------
// errorHandler : https://www.npmjs.com/package/errorhandler
//-----------------------------------

// error handling middleware should be loaded after the loading the routes
// development only

var envMode = app.get('env');
console.log(' * ENV mode : ', envMode);

if ('development' == envMode) {

    var errorhandler = require('errorhandler');
    // app.use(errorHandler());

    var notifier = require('node-notifier');
    app.use(errorhandler({log: errorNotification}));

    function errorNotification(err, str, req) {
        var title = '--> Error in ' + req.method + ' ' + req.url;
        notifier.notify({
            title: title,
            message: str
        });
    }
}


////////////////////////////////////////////////////////////////////////////
// 설정
////////////////////////////////////////////////////////////////////////////

/*
//Templete 지정
setTemplete();

function setTemplete(engine){
    var path = _path_server + '/templates';
    app.set('views', path);
    console.log('# Views path : ', path);

    if(engine){
        app.set('view engine', engine);
        console.log('# Views engine : ', engine);
    }
}
*/
process.on('uncaughtException', function (err) {
    console.log('# [Caught Exception] : ' + err);
    console.log(err.stack);
});

////////////////////////////////////////////////////////////////////////////
// 연결
////////////////////////////////////////////////////////////////////////////

//-----------------------------------
// 서버 설정
//-----------------------------------

//app.set('port', process.env.PORT || 3000);
var config = require('./config');
var configData = config.set('local');
console.log('# Server ConfigData : ', configData);
console.log('\n');

//-----------------------------------
// DataBase - Server 연결
//-----------------------------------

// DB 연결
dbConnect();

function dbConnect(){
    
    var DB = require('./db/database');

    DB.connect( configData.database, function(err, db){

        if (err) throw '# DB연결 실패 : \n' + err;
        
        // db 객체를 저장해 둔다
        app.set('DB_OBJECT', db);

        // Server 연결
        serverConnect();
    }); 
}

// Express 4.x에서는 http.createServer 사용안함
// var http = require('http');
// var server = http.createServer(onRequest);

function serverConnect(){
    var port = configData.port;
    app.listen(port);

    console.log('# Express Server Start !!! - ', port, ' port');
    console.log('\n');
}



