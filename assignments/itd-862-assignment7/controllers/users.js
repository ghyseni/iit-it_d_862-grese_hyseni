var User = require("../models/user.js"),
  mongoose = require("mongoose");

var UsersController = {};

UsersController.index = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      res.render(error).send({
        "error": err.message
      });
      console.error(err);
    } else {
      res.render('index', {
        title: 'Reminders',
        users: users
      });
    }
  })

};


// Show a User
UsersController.show = function(req, res) {
  console.log(req.params.userId);
  User.findById(req.params.userId, function(err, user) {
    console.log(user);
    if (err) {
      res.render('error', {
        "error": err.message
      });
      console.error(err);
    } else {
      res.render('user', {
        user: user
      });
    }
  })
};
// Create a new user
UsersController.create = function(req, res) {
  console.log(req.body);
  if (!req.body.username || !req.body.email) {
    res.status(400).send({
      "message": "Name and Email should not be empty."
    });
    return 0;
  }
  var newUser = new User({
    name: req.body.username,
    email: req.body.email
  });
  newUser.save(function(err, user) {
    if (err) {
      res.status(404).send({
        "status": 404,
        "error": err.message
      });
    } else {
      res.send(user);
    }
  });

};

// Delete an existing user
UsersController.destroy = function(req, res) {
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
};


// Update an existing user
UsersController.showReminder = function(req, res) {
  User.findById(req.params.userId,
    function(err, user) {
      if (err) {
        res.render('error', {
          "error": err.message
        });
      } else {
        var reminder = user.reminder.id(req.params.reminderId);
        if (reminder) {
          var time = reminder.created.replace("T", " ");
          time = time.substring(0, time.length - 4);
          reminder.created = time;
        }
        res.render('reminder', {
          userId: user._id,
          reminder: reminder
        });
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
        });
      } else {
        console.log(user);
        res.render('reminders', {
          user: user,
        });
      }
    })
};

// Update an existing user
UsersController.createReminder = function(req, res) {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  if (!req.body.title) {
    res.status(400).send({
      "message": "Title should not be empty."
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
      console.log(reminder);
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
};

// Update an existing user
UsersController.destroyReminder = function(req, res) {
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
};

module.exports = UsersController;
