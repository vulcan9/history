

var mongoose = require('mongoose');

//////////////////////////////////////
// Body
//////////////////////////////////////

var db;

function connect(callback)
{
    // historyDB 없다면 자동 생성됨
    mongoose.connect('mongodb://127.0.0.1/historyDB');
    db = mongoose.connection;
    
    // error
    db.on('error', function(err){
        console.error('[ connection error ] :');
        throw err;
    });

    // success
    db.once('open', function () {
        console.log('DB connection successful...');
        callback();
    });
}



// https://www.npmjs.com/package/mongoose












/*
    var userSchema = new mongoose.Schema({
        email: { type: String, unique: true, lowercase: true },
        password: { type: String, select: false },
        displayName: String,
        facebook: String,
        foursquare: String,
        google: String,
        github: String,
        linkedin: String,
        live: String,
        yahoo: String,
        twitter: String
    });
    var User = mongoose.model('User', userSchema);
*/









//////////////////////////////////////
// Export
//////////////////////////////////////

exports.db = db;
exports.connect = connect;