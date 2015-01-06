

var http = require('http');
// var fs = require('fs');
var path = require('path');

//////////////////////////////////////
// Body
//////////////////////////////////////

// console.log('__dirname------------->', __dirname);
// var p = path.dirname(require.main.filename);

// 실제 node는 server 폴더의 상위 폴더에서 실행되므로 server.js의 parent로 경로를 보정해 준다.
global.__root = path.resolve(__dirname, '../');

// 절대 경로 사용
global.__useStaticPath = false;
console.log('* root path : ', global.__root);

function start (port, route)
{
    var server = http.createServer(onRequest);
    server.listen(port);
    console.log('Server started !');

    function onRequest(req, res)
    {
        // Favicon
        if (req.url === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            res.end();
            return;
        }
        
        // Route
        route(req, res);
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