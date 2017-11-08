var express = require("express"),
  http = require("http"),
  app = express(),
  router = express.Router(),
  mongoose = require("mongoose"),
  hbs = require("express-handlebars"),
  bodyParser = require('body-parser'),
  usersController = require("./controllers/users.js");
const port = process.env.PORT || 3000;
var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost:27017/User";

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// parse application/json
app.use(bodyParser.json());
//parse "X-www-form-urlencoded"
// app.use(bodyParser.urlencoded())
// set public directory to path /client
app.use(express.static(__dirname + '/client'));

/* Connect mongoose */
mongoose.connect(mongoUri);
var db = mongoose.connection

// get notified if we connect successfully or if a connection error occurs:
db.on("error", console.error.bind(console, "Connection error:"));

// we"re connected!
console.log("Connection successfull!");


//Model user based on user schema
app.get("/", usersController.index);
app.post("/users/", usersController.create);
app.get("/users/:userId", usersController.show);
// app.put("/users/:username", usersController.update);
app.del("/users/:userId", usersController.destroy);

app.get("/users/:userId/reminders/", usersController.showReminders);
app.get("/users/:userId/reminders/:reminderId", usersController.showReminder);
app.post("/users/:userId/reminders/", usersController.createReminder);
app.del("/users/:userId/reminders/", usersController.destroyReminders);
app.del("/users/:userId/reminders/:reminderId", usersController.destroyReminder);


/* Connect to local server */
app.listen(port, function() {
  console.log(`Started and running on port: ${port}`);
});
