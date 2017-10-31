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


app.get("/users/:userId", function(req, res) {
  User.findById(req.params.userId, "name email", function(err, user) {
    if (err) {
      res.status(404).send({
        "status": 404,
        "error": err.message
      });
      console.error(err);
    } else if (user) {
      res.send({
        "name": user.name,
        "email": user.email
      });
    } else {
      res.status(404).send({
        "status": 404,
      });
    }
  })
});

app.get("/users/:userId/reminders/", function(req, res) {
  var query = {
    "_id": req.params.userId
  };
  if (req.query.title) {
    query = {
      "_id": req.params.userId,
      "reminder.title": req.query.title
    };
  }
  User.findOne(query,
    "reminder.title reminder.description reminder.created", query,
    function(err, user) {
      if (err) {
        res.status(404).send({
          "status": 404,
          "error": err.message
        });
        console.error(err);
      } else if (user) {
        res.send(user.reminder);
      } else {
        res.status(404).send({
          "status": 404,
        });
      }
    })
});

app.get("/users/:userId/reminders/:reminderId", function(req, res) {
  User.findById(req.params.userId,
    function(err, user) {
      if (err) {
        res.status(404).send({
          "status": 404,
          "error": err.message
        });
        console.error(err);
      } else {
        var reminder = user.reminder.id(req.params.reminderId);
        res.send({
          "title": reminder.title,
          "description": reminder.description,
          "created": reminder.created
        });
      }
    })
});

app.post("/users", function(req, res) {

  if(!req.body.name || !req.body.email){
      res.send({
        "message":"Name and Email should not be empty."
      });
      return 0;
  }

  var newUser = new User({
    name: req.body.name,
    email: req.body.email
  });
  newUser.save(function(err, user) {
    if (err) {
      res.status(404).send({
        "status": 404,
        "error": err.message
      });
      console.error(err);
    } else {
      res.send(user);
    }
  });
});

app.post("/users/:userId/reminders", function(req, res) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  if(!req.body.title || !req.body.description){
      res.send({
        "message":"Title and Description should not be empty."
      });
      return 0;
  }

  var newReminder = {
    title: req.body.title,
    description: req.body.description,
    created: localISOTime
  };

  User.findById(req.params.userId, function(err, user) {
    if (err) {
      res.status(404).send({
        "status": 404,
        "error": err.message
      });
      console.error(err);
    } else {
      var reminder = user.reminder.create(newReminder);
      user.reminder.push(reminder);
      user.save(function(err, user) {
        if (err) {
          res.status(404).send({
            "status": 404,
            "error": err.message
          });
          console.error(err);
        } else {
          res.send(reminder);
        }
      });
    }
  });
});

app.delete("/users/:userId/", function(req, res) {
  User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err) {
      res.status(404).send({
        "status": 404,
        "error": err.message
      });
      console.error(err);
    } else {
      res.send(user);
    }
  })
});

app.delete("/users/:userId/reminders/:reminderId", function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err) {
      res.status(404).send({
        "status": 404,
        "error": err.message
      });
      console.error(err);
    } else {
      user.reminder.pull(req.params.reminderId);
      user.save(function(err, user) {
        if (err) {
          res.status(404).send({
            "status": 404,
            "error": err.message
          });
          console.error(err);
        } else if (user) {
          res.send(user.reminder);
        } else {
          res.status(404).send({
            "status": 404,
          });
        }
      });
    }
  })
});


/* Connect to local server */
app.listen(port, function() {
  console.log(`Started and running on port: ${port}`);
});
