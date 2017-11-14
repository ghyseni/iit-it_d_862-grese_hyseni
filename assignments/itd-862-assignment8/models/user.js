var mongoose = require("mongoose");

//reminderSchema declaration
var reminderSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  created: {
    type: String,
    required: true
  }
});

//user schema declaration
var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  reminder: [reminderSchema]
});

//Model user based on user schema
var User = mongoose.model("User", userSchema);

module.exports = User;
