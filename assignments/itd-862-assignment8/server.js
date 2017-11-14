var express = require("express"),
  http = require("http"),
  app = express(),
  mongoose = require("mongoose"),
  morgan = require('morgan'),
  hbs = require("express-handlebars"),
  bodyParser = require('body-parser'),
  usersController = require("./controllers/users.js"),
  config = require('config'), //load the db connection from the db location from the JSON files
  options = {
    server: {
      socketOptions: {
        keepAlive: 1,
        connectTimeoutMS: 30000
      }
    },
    replset: {
      socketOptions: {
        keepAlive: 1,
        connectTimeoutMS: 30000
      }
    }
  };

const port = process.env.PORT || 3000;
var mongoUri = process.env.MONGOLAB_URI || config.DBHost;

/* Connect mongoose */
mongoose.connect(mongoUri, options);
var db = mongoose.connection
db.on("error", console.error.bind(console, "Connection error:"));

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

// we"re connected!
console.log("Connection successfull!");

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: 'application/json'
}));

// set public directory to path /client
app.use(express.static(__dirname + '/client'));


//Model user based on user schema
app.get("/", usersController.index);
app.post("/users/", usersController.create);

app.route("/users/:userId")
  .get(usersController.show)
  .delete(usersController.destroy);

app.route("/users/:userId/reminders/")
  .get(usersController.showReminders)
  .post(usersController.createReminder)
  .delete(usersController.destroyReminders);

app.route("/users/:userId/reminders/:reminderId")
  .get(usersController.showReminder)
  .delete(usersController.destroyReminder);

/* Connect to local server */
app.listen(port, function() {
  console.log(`Started and running on port: ${port}`);
});

module.exports = app;
