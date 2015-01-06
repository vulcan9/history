

// var mime = require('mime');
var fs = require('fs');

//////////////////////////////////////
// Body
//////////////////////////////////////

function response (req, res)
{

    /*
    fs.exists('./index.html', function(exists){
        console.log(exists ? "it's there" : "no passwd!");
    });
    //*/
    
    // var mimeType = mime.lookup(pathname);
    // var tmp  = pathname.lastIndexOf(".");
    // var extension  = pathname.substring((tmp + 1));

    // 파일 읽기 (node 실행 경로가 root임)
    var file_path = 'index.html';
    fs.readFile(file_path, function(error, contents){

        if(error){

            console.log(error);
            // res.writeHeader(500, 'text/html');
            
            res.setHeader('Content-Type', 'text/html');
            res.writeHeader(500);

            res.end("<h1>FS READ FILE ERROR: Internal Server Error!</h1>");    

        }else{

            // req.setEncoding("utf8");
            // console.log("req query : ", req.query);
            // res.writeHead(200, 'text/html');
            
            res.setHeader('Content-Type', 'text/html');
            res.writeHeader(200);
            // res.write(contents);
            res.end(contents);
            
        }
    });
}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.response = response;