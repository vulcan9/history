
var ContentType = require("../route/ContentType");
// var querystring = require("querystring");
var fs = require('fs');


//////////////////////////////////////
// Body
//////////////////////////////////////

function response (req, res) {
    
    console.log("Request handler 'show' was called.");
    fs.readFile("./route_sample/temp/test.png", "binary", function(error, file) {
        
        if(error) {
            res.writeHead(500, ContentType.TEXT_PLAIN);
            res.write(error + "\n");
            res.end();
        } else {
            res.writeHead(200, ContentType.IMAGE_PNG);
            res.write(file, "binary");
            res.end();
        }

    });
}

//////////////////////////////////////
// Export
//////////////////////////////////////

exports.response = response;