var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var str = "";

mongoose.connect("mongodb://localhost:27017/Trains");

var db = mongoose.connection;
db.on('error', console.log.bind(console,"Connection Error"));
db.once('open', function(callback) {
  console.log("Connection succeeded");
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/', function(req, res){
  var fname = req.body.first_name;
  var lname = req.body.last_name;
  var phonenumber = req.body.phone_number;
  var email = req.body.email;
  var dep = req.body.departure;
  var dest = req.body.destination;
  var date = req.body.date;
  var time = req.body.time;
  var seat_class = req.body.class;

  var data = {
    "Ticket_Number": date + "-" + time + "-" + lname.toUpperCase() + "-" + phonenumber.slice(phonenumber.length-3) +
                     "-" + seat_class.slice(0,4).toUpperCase(),
    "Full_Name": fname + " " + lname,
    "First_Name": fname,
    "Last_Name": lname,
    "Phone": phonenumber,
    "Email": email,
    "Departure": dep,
    "Destination": dest,
    "Date": date,
    "Time": time,
    "Seat_Type": seat_class
  };

  var json = JSON.stringify(data);
  str = JSON.parse(json);

  db.collection("Bookings").insertOne(data, function (err, documents) {
    if (err) throw err;

    console.log("Document Inserted");
  });
  res.redirect("/PrintTicket");
  //return res.send("Data inserted into database.");
});

app.route('/PrintTicket').get(function(req, res) {
  res.send("<h1 style='text-align:center; text-decoration:underline;'>Ticket Details</h1>" +
           "<p style='text-align:center'><b>Ticket Number: </b>" + str.Ticket_Number +
           "<br><b>Full Name: </b>" + str.Full_Name + "<br><b>Phone#: </b>" +
           str.Phone + "<br><b>Email: </b>" + str.Email + "<br><b>Departure: </b>" + str.Departure +
           "<br><b>Destination: </b>" + str.Destination + "<br><b>Date: </b>" + str.Date + "<br><b>Time: </b>" +
           str.Time + "<br><b>Seat Type: </b>" + str.Seat_Type + "</p>" +
           "<p align='center'><input type='button' value='PRINT'onclick='window.print(); return true;'></p>");
});

app.use("/", function (req, res) {
  res.sendFile(__dirname + "/booking.html");
});

var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listen on http://" + host + ":" + port);
});
