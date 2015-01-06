
var ContentType = require("../route/ContentType");
var querystring = require("querystring");

// 파일 업로드
var formidable = require('formidable');
var fs = require('fs');

//////////////////////////////////////
// Body
//////////////////////////////////////

function response (req, res) {

    /*
    req.setEncoding("utf8");
    var postData = "";
    req.addListener("data", function(postDataChunk) {
        postData += postDataChunk;
        console.log("Received POST data chunk '"+ postDataChunk + "'.");
    });
    req.addListener("end", function() {
        var text = querystring.parse(postData).text;
        var content = "You've sent : " + text;
        res.writeHead(200, ContentType.TEXT_PLAIN);
        res.write(content);
        res.end();
    });
    */

    /*
    // formidable 예제
    https://www.npmjs.com/package/formidable

    // parse a file upload
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, ContentType.TEXT_HTML);
        res.write('received upload:\n\n');
        res.end(sys.inspect({fields: fields, files: files}));
    });

    // show a file upload form
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
    */

    // fs.rename(oldPath, newPath, callback)
    var form = new formidable.IncomingForm();
    form.parse(req, function(error, fields, files) {
        var oldPath = files.upload.path;
        var newPath = './route_sample/temp/test.png';

        // BUG : cross-device link not permitted 에러 발생
        // C:\Users\dongil\AppData\Local\Temp 폴더에 임시 저장하게 되는데
        // 이 파일을 다른 파티션으로 경로를 변경하는 과정에서 에러 발생함

        // fs.renameSync(oldPath, newPath);
        // renamed();
        // fs.rename(oldPath, newPath, renamed);

        var is = fs.createReadStream(oldPath);
        var os = fs.createWriteStream(newPath);
        is.pipe(os);
        is.on('end',function() {
            fs.unlinkSync(oldPath);
            renamed();
        });
    });

    function renamed (err){
        var content;
        if(err){
            console.log('renamed : ', err);
            content = err.path;
        }else{
            content = "received image:<br/>" + "<img src='/show' />";
        }
        
        res.writeHead(200, ContentType.TEXT_HTML);
        res.write(content);
        res.end();
    }
}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.response = response;