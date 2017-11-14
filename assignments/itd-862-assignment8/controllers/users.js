var User = require("../models/user.js"),
  mongoose = require("mongoose");

var UsersController = {};

UsersController.index = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(users);
    }
  })
};


// Show a User
UsersController.show = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({
          message: "User not found!",
        });
      }
    }
  })
};
// Create a new user
UsersController.create = function(req, res) {
  var newUser = new User({
    name: req.body.name,
    email: req.body.email
  });
  newUser.save(function(err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({
        message: "User successfully added!",
        user
      });
    }
  });
};

// Delete an existing user
UsersController.destroy = function(req, res) {
  User.remove({
    _id: req.params.userId
  }, function(err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({
        message: "User successfully deleted!",
        result
      });
    }
  })
};

// Update an existing user
UsersController.showReminder = function(req, res) {
  User.findById(req.params.userId,
    function(err, user) {
      if (err) {
        res.status(500).send(err);
      } else {
        var reminder = user.reminder.id(req.params.reminderId);
        if (reminder) {
          var time = reminder.created.replace("T", " ");
          time = time.substring(0, time.length - 4);
          reminder.created = time;
          res.send(reminder);
        } else {
          res.status(404).send({
            message: "Reminder not found!"
          });
        }

      }
    })
};

// Update an existing user
UsersController.showReminders = function(req, res) {
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
    function(err, user) {
      if (err) {
        res.render('error', {
          "error": err.message
        }).send(err);
      } else if (user) {
        reminder = user.reminder;
        // if (req.query.title) {
        //   reminder = [];
        //   var newReminder = true;
        //   while (newReminder == true) {
        //     newReminder = user.reminder.filter(function(reminder) {
        //       return reminder.title === req.query.title;
        //     }).pop();
        //     reminder.push(newReminder);
        //   }
        //
        // }

        res.send(reminder);
      }
    })
};

// Update an existing user
UsersController.createReminder = function(req, res) {

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  var newReminder = {
    title: req.body.title,
    description: req.body.description,
    created: localISOTime
  };

  User.findById(req.params.userId, function(err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      var reminder = user.reminder.create(newReminder);
      user.reminder.push(reminder);
      user.save(function(err, user) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send({
            message: "Reminder successfully added!",
            reminder
          });
        }
      });
    }
  });
};

// Update an existing user
UsersController.destroyReminder = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      user.reminder.pull(req.params.reminderId);
      user.save(function(err, user) {
        if (err) {
          res.status(500).send(err);
        } else if (user) {
          res.send({
            message: "Reminder successfully deleted!",
            reminder:user.reminder.id(req.params.reminderId)
          });
        } else {
          res.status(404).send({
            "status": 404,
          });
        }
      });
    }
  })
};
// Update an existing user
UsersController.destroyReminders = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      user.reminder = [];
      user.save(function(err, user) {
        if (err) {
          res.status(500).send(err);
        } else if (user) {
          res.send({
            message: "Reminders successfully deleted!",
            reminder: user.reminder
          });
        } else {
          res.status(404).send({
            "status": 404,
          });
        }
      });
    }
  })
};

module.exports = UsersController;
