// var http = require('http');
// var querystring = require("querystring");
var url = require('url');
var ContentType = require("../route/ContentType");

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
        res_404(req, res);
        console.log("Not Found Request : " + pathname);

    } else {
      var path = requestPath[pathname];
        var page = require( path );
        page.response(req, res);
    }
}

//////////////////////////////////////
// Route
//////////////////////////////////////

var requestPath = {
    "/" : '../route_sample/start',
    "/start" : '../route_sample/start',
    "/upload" : '../route_sample/upload',
    "/show" : '../route_sample/show'
};

//////////////////////////////////////
// Handler
//////////////////////////////////////

function res_404 (req, res) {
    console.log("404 Not found");
    var content = "404 Not found";

    res.writeHead(200, ContentType.TEXT_PLAIN);
    res.write(content);
    res.end();
}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.route = route;