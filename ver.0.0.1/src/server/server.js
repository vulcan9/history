

var http = require('http');
// var fs = require('fs');
// var path = require('path');
var router = require("./router");

//////////////////////////////////////
// Body
//////////////////////////////////////

function start (port)
{
    var server = http.createServer(onRequest);
    server.listen(port);
    console.log('Server started !');

    function onRequest(req, res)
    {
        // Favicon
        // '/'는 로컬일때 드라이브 루트임(D://)
        if (req.url === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            res.end();
            return;
        }
        
        // Route
        router.route(req, res);
    }


    // END start
}

/*
fs.readdir("/", function (error, files) {
    content = files;
    res.writeHead(200, {'Content-Type': 'text/plain'} );
    res.end(error);
    console.log('favicon requested : ', files);
});
//*/

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.start = start;