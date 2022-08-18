var mongodb = require('mongodb').MongoClient;

mongodb.connect("mongodb://localhost/", function(err,db) {
  if (err) {
    throw err;
  }
  else {
    var trainDB = db.db("Trains");
    trainDB.createCollection("Bookings", function(err,result) {
      if (!err)
        console.log("Collection has been created");
    });
  }
});
