
// var querystring = require("querystring");
var url = require('url');
var mime = require('mime');
// var fs = require('fs');

var authRoute = require('./route-auth');
var dbRoute = require('./route-db');


/*
                                       url.parse(string).query
                                                     |
        url.parse(string).pathname        |
                                 |                   |
                                 |                   |
                               -----     -------------------
http://localhost:8888/  start  ? foo=bar  &hello=world
                                                ----            -----
                                                  |                  |
                                                  |                  |
                       querystring(string)["foo"]           |
                                                                     |
                                      querystring(string)["hello"]
*/

function set (router, app){
    
    console.log('\n');
    console.log('# Route 설정');

    //////////////////////////////////////
    // Route 변수 설정
    //////////////////////////////////////

    var PATH_ROOT = app.get('PATH_ROOT');
    var PATH_USE_STATIC = app.get('PATH_USE_STATIC');
    var PATH_SERVER = app.get('PATH_SERVER');

    // URL Root 설정
    var URL_HOME_PREFIX = app.get('URL_HOME_PREFIX');

    // 경로 매핑
    // 상대 경로는 본 파일로부터의 상대 경로임
    // var _path_prefix = (PATH_USE_STATIC) ? PATH_ROOT : '.';

    //************************************************************************

    // Hi-story Application 에 대한 index까지만 지정하고,
    // 이하 route는 Application (angular-route)에서 다시 Route한다.

    /*
    // Root이외의 Route 설정
    var _url_map = {
        "/" : '/route/index',
        // "/auth/signup" : 
    };
    for(var key in _url_map){
        _url_map[key] = PATH_SERVER + _url_map[key];
    }
    _url_map[URL_HOME_PREFIX] = _url_map['/'];
    */

    //************************************************************************

    // 경로 매핑
    console.log('\t * 절대경로 사용 : ', PATH_USE_STATIC);
    // console.log('\t * root : ', _url_map[URL_HOME_PREFIX]);

    console.log('# Route 설정 완료.');
    console.log('\n');

    //////////////////////////////////////
    // Route 미들웨어
    //////////////////////////////////////

    // a middleware with no mount path, gets executed for every request to the router
    // 모든 요청에 대해 DB_OBJECT객체를 참조할 수 있도록 값을 추가해준다
    router.use( function (req, res, next) {
        
        console.log('\n');
        console.log('-------------------------------------------');
        console.log('# Request URL : ', req.originalUrl);
        console.log('\t * time:', Date.now());
        console.log('\t * Request Type : ', req.method);

        if(app){
            var db = app.get('DB_OBJECT');
            req.db = db;
            console.log("\t * DB_OBJECT Setting.");
        }

        console.log("\t * Cookies: ", req.cookies)
        
        next();
    });

    //-----------------------------------
    // Middleware Test : http://expressjs.com/guide/using-middleware.html
    //-----------------------------------

    /*
    // a middleware sub-stack which handles GET requests to /user/:id

    app.get('/user/:id', function (req, res, next) {
        console.log('ID:', req.params.id);
        next();
    }, function (req, res, next) {
        res.send('User Info');
    });
    // handler for /user/:id which prints the user id
    app.get('/user/:id', function (req, res, next) {
        res.end(req.params.id);
    });
    */

    ////////////////////////////////////////////////////////////////////////////
    // Page Routing
    ////////////////////////////////////////////////////////////////////////////

    //-----------------------------------
    // Home Page
    //-----------------------------------

    router.get(URL_HOME_PREFIX, function(req, res, next) {
        var actualPath;
        if(PATH_USE_STATIC){
            actualPath = PATH_SERVER + '/route/index';
        }else{
            // 상대 경로는 본 파일로부터의 상대 경로임
            actualPath = './index';
        }

        checkServerPage(URL_HOME_PREFIX, actualPath, req, res, next);
    });

    /*
    router.use('/404_NOT_FOUND', function(req, res, next) {
        res_404 (req, res, next);
    });
    */

    //////////////////////////////////////
    // route Response가 정의된 JS 파일을 검사한다.
    //////////////////////////////////////

    function checkServerPage(routeString, actualPath, req, res, next) {
        var requestURL = req.originalUrl;
        var pathname = url.parse(requestURL).pathname;
        var pattern = getPattern(routeString);
        var match = pattern.test(pathname);

        
        // console.log('\t - actualPath : ', actualPath);
        // console.log('pattern : ', pattern);
        // console.log('match : ', match);

        if(match == false){
            // 파일시스템에서 파일 링크로 읽어들여 서비스 함
            next();
            return;
        }

        console.log('\n');
        console.log('\t - pathname : ', pathname);
        console.log('\t - actualPath : ', actualPath);

        // 해당 경로의 JS 파일에 링크를 연결한다.
        var file = require( actualPath );
        try{
            // 해당 파일은 response 인터페이스가 정의되어 있어야 한다.
            if(!file || !file.response){
                var msg = '해당 파일이 없거나 인터페이스가 구현되어 있지 않습니다.';
                throw new Error(msg);
            }
            // 응답
            file.response(req, res);
            return;
        }
        catch(err){
            console.log('# [Route Exception] : ' + err);
            console.log(err.stack);
            next();
        }
    }

    //-----------------------------------
    // Pattern 체크
    //-----------------------------------
    
    function getPatternString (word){
        // var patternString = '\/' + word + '(\W|$)(\/|\#)*(\/)*';
        var patternString = '' + word + '(\\W|$)(\\/|\\#)*(\\/)*($|\\s)';
        return patternString;
    }
    function getPatternExpression (word){
        var expression = '/' + getPatternString(word) + '/gm';
        return expression;
    }
    function getPattern (word){
        var patternString = getPatternString(word);
        var pattern = new RegExp(patternString, 'gm');
        return pattern;
    }

    //-----------------------------------
    // 404 Page
    //-----------------------------------

    function res_404 (req, res) {
        console.log("# 404 Not found");
        var content = "<h1>404 Not found</h1>READ FILE ERROR: Internal Server Error!";

        res.writeHead(404, 'text/html');
        res.write(content);
        res.end();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Auth Request Routing 정의
    ////////////////////////////////////////////////////////////////////////////











    
    
    authRoute.set (router);

    dbRoute.set (router);










    ////////////////////////////////////////////////////////////////////////////
    // 마지막으로 파일시스템을 조사한다. (이미지, css등의 요청)
    ////////////////////////////////////////////////////////////////////////////


    router.use(function(req, res, next){

        var requestURL = req.originalUrl;
        var pathname = url.parse(requestURL).pathname;

        // 파일 읽기 (가상 prefix 제거)
        var prefix =  URL_HOME_PREFIX + '/';
        var filePath = pathname.replace(prefix, '');
        if(filePath.indexOf('/') == 0){
            filePath = filePath.replace('/', '');
        }

        // var ext = path.extname(filePath);
        var mimeType = mime.lookup(pathname);

        console.log('\n');
        console.log('\t * Anonymous Request : ', pathname);
        console.log('\t - filePath : ', filePath);
        console.log('\t - mimeType : ', mimeType);
        console.log('\n');

        var options = {
            root: PATH_ROOT,
            dotfiles: 'deny',
            // headers: {
            //     'x-timestamp': Date.now(),
            //     'x-sent': true
            // }
        };
        res.sendFile(filePath, options, function (err) {
            if (err) {
                console.log('\n//////////////////////////////////////////////////////////////////\n');
                console.log('-> [File Route Error] : ');
                console.log(err, err.stack);
                console.log('\n//////////////////////////////////////////////////////////////////\n');
                
                // res.status(err.status).end();
                res_404 (req, res);

            }else {
                console.log('-> Response Result  success : ', filePath);
            }
        });
    });

    /*
    // 파일 직접 읽어 보내기
    router.use(function(req, res, next){

        var requestURL = req.originalUrl;
        var pathname = url.parse(requestURL).pathname;

        // 파일 읽기 (가상 prefix 제거)
        var prefix =  URL_HOME_PREFIX + '/';
        var filePath = pathname.replace(prefix, '');
        if(filePath.indexOf('/') == 0){
            filePath = filePath.replace('/', '');
        }

        // 경로 변환
        var actualPath;
        if(PATH_USE_STATIC){
            actualPath = PATH_ROOT + '/' + filePath;
        }else{
            // 상대 경로는 본 파일로부터의 상대 경로임
            actualPath = './' + filePath;
        }

        console.log('\t * Path : [ ', pathname, ' ]');
        console.log("\t * Anonymous Request : ", actualPath);
        // console.log("\t - pathname : ( ", pathname, " )");

        // 서비스
        // res.sendfile(actualPath);

        // non-blocking 방식 - res 이용하여 컨텐츠 리턴
        var mimeType = mime.lookup(pathname);
        fs.readFile(filePath, function(error, contents){

            if(error){

                console.log(error);
                res_404 (req, res);

            }else{

                // req.setEncoding("utf8");
                // console.log("req query : ", req.query);

                // res.writeHead(200, 'text/html');
                res.setHeader('Content-Type', mimeType);
                res.writeHeader(200);

                // res.write(contents);
                res.end(contents);
            }
        });
    });
    */

    /*
    router.use(function(req, res, next){
        // req.setEncoding("utf8");
        res.setHeader('Content-Type', 'text/html');
        res.writeHeader(200);
        // res.write(contents);
        res.end(contents);
    });
    */

    //////////////////////////////////////
    // mount the router on the app
    //////////////////////////////////////

    app.use('/', router);

}

//////////////////////////////////////
// Export
//////////////////////////////////////

module.exports.set = set;



