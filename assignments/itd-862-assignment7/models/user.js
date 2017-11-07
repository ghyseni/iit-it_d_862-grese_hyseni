var mongoose = require("mongoose");

//reminderSchema declaration
var reminderSchema = mongoose.Schema({
  title: String,
  description: String,
  created: String
});
//user schema declaration
var userSchema = mongoose.Schema({
  name: String,
  email: String,
  reminder: [reminderSchema]
});

//Model user based on user schema
var User = mongoose.model("User", userSchema);

module.exports = User;
