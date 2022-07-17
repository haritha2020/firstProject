var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var _db;
function getapp(){
    return new Promise(function(resolve,reject){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            console.log("Database connected!");
            _db=db.db("db_1");
            resolve(_db);
        });
    });
}
module.exports={getapp};