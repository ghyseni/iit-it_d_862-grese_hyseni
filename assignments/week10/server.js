var express = require("express"),
  http = require("http"),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require("mongoose");

// parse application/json
app.use(bodyParser.json());

const port = 3000;

/* Connect mongoose */
mongoose.connect("mongodb://localhost:27017/User");
var db = mongoose.connection

// get notified if we connect successfully or if a connection error occurs:
db.on("error", console.error.bind(console, "Connection error:"));

// we"re connected!
console.log("Connection successfull!");

//reminder schema declaration
var reminderchema = mongoose.Schema({
  title: String,
  description: String,
  created: String
});

//user schema declaration
var userSchema = mongoose.Schema({
  name: String,
  email: String,
  reminder: [reminderchema]
});

//Model user based on user schema
var User = mongoose.model("User", userSchema);


/* Connect to local server */
app.listen(port, function() {
  console.log(`Started and running on port: ${port}`);
});
