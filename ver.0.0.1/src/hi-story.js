console.log('\n\n');
console.log('///////////////////////////////////////////////////////////////////////////');
console.log('///////////////////////////// HI-STORY Server /////////////////////////////');
console.log('///////////////////////////////////////////////////////////////////////////');
console.log('\n');

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
var config = require('./server/config');

//-----------------------------------
// EXPRESS 4.X
//-----------------------------------

var express = require('express');
var app = express();

// app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

var SERVER = 'local';
console.log(' * SERVER URL : ', SERVER);

var ENV_MODE = app.get('env');
console.log(' * ENV_MODE : ', ENV_MODE);

// URL Root 설정 (Home url에 쓰이는 가상 경로)
var URL_HOME_PREFIX = '/history';
app.set('URL_HOME_PREFIX', URL_HOME_PREFIX);
console.log(' * URL_HOME_PREFIX : ', URL_HOME_PREFIX);

// 절대 경로 사용
var PATH_USE_STATIC = false;
app.set('PATH_USE_STATIC', PATH_USE_STATIC);
console.log(' * 절대 경로 사용 여부 : ', PATH_USE_STATIC);

// 실제 node는 server 폴더의 상위 폴더에서 실행되므로 server.js의 parent로 경로를 보정해 준다.
// var PATH_ROOT = path.resolve(__dirname, './');
var PATH_ROOT = __dirname;
app.set('PATH_ROOT', PATH_ROOT);
console.log(' * PATH_ROOT : ', PATH_ROOT);

// 서버 폴더 경로
var PATH_SERVER = path.resolve(__dirname, './server');
app.set('PATH_SERVER', PATH_SERVER);
console.log(' * PATH_SERVER (root) : ', PATH_SERVER);

// console.log(' * server 실행 JS 파일 : ', require.main.filename);
// console.log(' * 실행 JS 파일 폴더 : ', path.dirname(require.main.filename));
// console.log(' * __dirname 변수 : ', __dirname);

console.log('\n');
// console.log('\n\n');

////////////////////////////////////////////////////////////////////////////
// Middleware
////////////////////////////////////////////////////////////////////////////

var favicon = require('serve-favicon');
app.use(favicon(PATH_ROOT + '/favicon.ico'));

//-----------------------------------
// morgan : https://www.npmjs.com/package/morgan
//-----------------------------------
// app.use(express.logger('dev'));

var logger = require('morgan');
app.use(logger('dev'));

// create a write stream (in append mode)
// var log_file = PATH_SERVER + '/access.log';
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
app.use(bodyParser.urlencoded({ extended: true }));
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

// 참고 : http://www.sitepoint.com/serving-static-files-with-node-js/

// 정적 디렉토리 설정
// "less-middleware": "0.1.12"
// app.use(require('less-middleware')({ src: PATH_SERVER + '/public' }));

var serveStatic = require('serve-static');

/*
// Serve up folder
var dir_public = path.join(PATH_SERVER, 'public');
var serve = serveStatic(dir_public, {
    'index': ['index.html', 'index.htm']
});
app.use(serve);
*/
// app.use(express.static(path.join(PATH_SERVER, 'public')));


// app.use(serveStatic(PATH_ROOT + '/data'));
app.use(serveStatic(PATH_ROOT + '/publish', {
    // dotfiles: 'deny',
    // extensions : ['js']
}));

// app.use(serveStatic(PATH_ROOT + '/publish/css'));
// app.use(serveStatic(PATH_ROOT + '/publish/data'));
// app.use(serveStatic(PATH_ROOT + '/publish/js'));
// app.use(serveStatic(PATH_ROOT + '/publish/libs'));
// app.use(serveStatic(PATH_ROOT + '/publish/templates'));

//-----------------------------------
//라우터 설정 : http://expressjs.com/4x/api.html#router
//-----------------------------------

var router = express.Router({
    strict : false,
    caseSensitive : true,
    mergeParams : false
});
var routeConfig = require('./server/route/route-configuration');
routeConfig.set(router, app);

//-----------------------------------
// errorHandler : https://www.npmjs.com/package/errorhandler
//-----------------------------------

// error handling middleware should be loaded after the loading the routes
// development only

if (ENV_MODE === 'development') {

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


//-----------------------------------
// // Force HTTPS on Heroku
//-----------------------------------

/*
if (ENV_MODE === 'production') {
    app.use(function(req, res, next) {
        var protocol = req.get('x-forwarded-proto');
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}
*/


////////////////////////////////////////////////////////////////////////////
// 설정
////////////////////////////////////////////////////////////////////////////

/*
//Templete 지정
setTemplete();

function setTemplete(engine){
    var path = PATH_SERVER + '/templates';
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

var serverConfig= config.server(SERVER);
console.log('# Server Config : ', serverConfig);
console.log('\n');

//-----------------------------------
// DataBase - Server 연결
//-----------------------------------

// DB 연결
dbConnect();

function dbConnect(){
    
    var DB = require('./server/db/database');

    DB.connect( serverConfig.database, function(err, db){

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
    var port = serverConfig.port;
    app.listen(port);

    console.log('# Express Server Start !!! - ', port, ' port');
    console.log('\n');
}



