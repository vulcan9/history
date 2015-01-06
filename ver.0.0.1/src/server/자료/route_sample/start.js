
var ContentType = require("../route/ContentType");

//////////////////////////////////////
// Body
//////////////////////////////////////

function response (req, res) {
    
    var content = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+

    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    // '<form action="/upload" method="post">'+
    // '<textarea name="text" rows="20" cols="60"></textarea>'+
    // '<input type="submit" value="Submit text" />'+
    '</form>'+

    '</body>'+
    '</html>';

    res.writeHead(200, ContentType.TEXT_HTML);
    res.write(content);
    res.end();
}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.response = response;