



//////////////////////////////////////
// Body
//////////////////////////////////////

var db;

function connect(database, callback)
{
        var type = database.type;

        if(type == "mongodb"){
            db = set_mongoDB(database, callback);
        }
        else
        {
            console.log('# 아직 지원되지 않는 DB 형식입니다.');
        }
}



//////////////////////////////////////
// DB : mongoDB
//////////////////////////////////////

// https://www.npmjs.com/package/mongoose

function set_mongoDB(database, callback){
    
    var mongoose = require('mongoose');

    //-----------------------------------
    // DB 연결
    //-----------------------------------
    
    var host = database.host;
    var port = database.port;

    // historyDB 없다면 자동 생성됨
    var uri = 'mongodb://' + host + ((port)?':' + port : '') + '/historyDB';
    console.log('# DB connected to : ', uri);

    mongoose.connect(uri);
    db = mongoose.connection;
    
    // error
    db.on('error', function(err){
        console.error('[ connection error ]');
        // throw err;
        if(callback && typeof callback == "function"){
            callback(err, db);
        }
    });

    // success
    db.once('open', function () {
        console.log('DB connection successful...');
        if(callback && typeof callback == "function"){
            callback(null, db);
        }
    });

    return db;
    // end mongoDB
}
















//////////////////////////////////////
// Export
//////////////////////////////////////

// exports.db = db;
exports.connect = connect;