

// var http = require('http');
// var querystring = require("querystring");
var url = require('url');
var mime = require('mime');
var fs = require('fs');

//////////////////////////////////////
// Body
//////////////////////////////////////

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

function route(req, res)
{
    var requestURL = req.url;
    var pathname = url.parse(requestURL).pathname;
    
    // non-blocking 방식 - res 이용하여 컨텐츠 리턴

    if ( requestPath[pathname] === undefined) {
        // res_404(req, res);
        checkFileSystem(req, res, pathname);

    } else {
      var path = requestPath[pathname];
        var page = require( path );
        page.response(req, res);
    }
}

//////////////////////////////////////
// Route
//////////////////////////////////////

// URL Root 설정
var rootPrefix = '/history';

// Root이외의 Route 설정
var requestPath = {
    // "/" : './route/index'
};

//***********************************

// Hi-story Application 에 대한 index까지만 지정하고,
// 이하 route는 Application (angular-route)에서 다시 Route한다.

//***********************************

// 경로 매핑
if(global.__useStaticPath){
    requestPath[rootPrefix]        = global.__root + '/server/route/index';
    requestPath[rootPrefix + '/'] = global.__root + '/server/route/index';
}else{
    requestPath[rootPrefix]        = './route/index';
    requestPath[rootPrefix + '/'] = './route/index';
}

//////////////////////////////////////
// Handler
//////////////////////////////////////

function checkFileSystem(req, res, pathname){

    // 파일 읽기
    var prefix =  rootPrefix + '/';
    var filePath = pathname.replace(prefix, '');
    if(filePath.indexOf('/') == 0){
        filePath = filePath.replace('/', '');
    }
    // 절대 경로로 변환
    if(global.__useStaticPath){
        filePath = global.__root + '/' + filePath;
    }
    
    // var tmp  = pathname.lastIndexOf(".");
    // var extension  = pathname.substring((tmp + 1));
    console.log("Anonymous Request : " + filePath);
    console.log("( ", pathname, " )");

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
}

function res_404 (req, res) {
    console.log("404 Not found");
    var content = "<h1>404 Not found</h1>READ FILE ERROR: Internal Server Error!";

    res.writeHead(500, 'text/html');
    res.write(content);
    res.end();
}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.route = route;