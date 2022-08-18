var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var str = "";
var json;

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
	"Ticket_Number": date + "-" + time + "-" + lname.toUpperCase() + "-" + phonenumber.slice(phonenumber.length-3) 
	+ "-" + seat_class.slice(0,4).toUpperCase(),	
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


  json = JSON.stringify(data);
  str = JSON.parse(json);

  db.collection("Bookings").insertOne(data, function (err, documents) {
    if (err) throw err;

    console.log("Document Inserted");
  });
  res.redirect("/PrintTicket");
  //return res.send("Data inserted into database.");
});


app.route('/Book').get(function(req, res){
	res.sendFile(__dirname + "/Book.html");
});

app.route('/PrintTicket').get(function(req, res) {
  res.send(" <div style = 'background-color: #f2f2f2; padding: 5px 20px 15px 20px; border: 1px solid lightgrey; border-radius: 3px;'> <h1 style='text-align:center;'>Ticket Details</h1>" +
           "<div> <table style='margin-left:590px;'> <tr><td><b>Ticket Number: </b></td><td> "+ str.Ticket_Number +"</td></tr><tr><td><b>Full Name: </b></td><td>" + str.Full_Name + "</td></tr><tr><td><b>Phone#: </b></td><td>" + str.Phone +
           "</td></tr><tr><td><b>Email: </b></td><td>" + str.Email + "</td></tr><tr><td><b>Departure: </b></td><td>" + str.Departure + "</td></tr><tr><td><b>Destination: </b></td><td>" +
           str.Destination + "</td></tr><tr><td><b>Date: </b></td><td>" + str.Date + "</td></tr><tr><td><b>Time: </b></td><td>" + str.Time + "</td></tr><tr><td><b>Seat Type: </b></td><td>" +
           str.Seat_Type + "</td></tr> </table></div>" + "<p align='center'><input type='button' value='PRINT'onclick='window.print(); return true;'></p></div>");
});

app.use("/", function (req, res) {
  res.sendFile(__dirname +"/Index.html");
})
//document.getElementById("form_id").submit();
var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listen on http://" + host + ":" + port);
});