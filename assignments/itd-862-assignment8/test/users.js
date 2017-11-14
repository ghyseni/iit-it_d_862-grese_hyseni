//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

// USERS
describe('Users', () => {
  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => {
      done();
    });
  });

  describe('/GET index', () => {
    it('it should GET an 404 html page', (done) => {
      chai.request(server)
        .get('/e')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/GET index', () => {
    it('it should GET html home page with all users', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/POST user', () => {
    it('it should POST a user', (done) => {
      let user = {
        name: "Grese Hyseni",
        email: "ghyseni@hawk.iit.edu"
      }
      chai.request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.user.should.have.property('name').eql(user.name);
          res.body.user.should.have.property('email').eql(user.email);
          done();
        });
    });
  });

  describe('/POST user', () => {
    it('it should not POST a user without name', (done) => {
      let user = {
        email: "ghyseni@hawk.iit.edu",
      }
      chai.request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('name');
          res.body.errors.name.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/POST user', () => {
    it('it should not POST a user without email', (done) => {
      let user = {
        name: "Grese Hyseni",
      }
      chai.request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('email');
          res.body.errors.email.should.have.property('kind').eql('required');
          done();
        });
    });
  });

  describe('/GET/:userId user', () => {
    it('it should GET a user by the given id', (done) => {
      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu'
      });
      user.save((err, user) => {
        chai.request(server)
          .get('/users/' + user.id)
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Grese Hyseni');
            res.body.should.have.property('email').eql('ghyseni@hawk.iit.edu');
            res.body.should.have.property('reminder').eql([]);
            res.body.should.have.property('_id').eql(user.id);
            done();
          });
      });
    });
  });

  describe('/GET user', () => {
    it('it should GET an 404 html page for missing user', (done) => {
      chai.request(server)
        .get('/users/59f3b98d6f5dd844e06a5861')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User not found!');
          done();
        });
    });
  });

  describe('/DELETE/:userId user', () => {
    it('it should DELETE a user given the id', (done) => {
      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu'
      });
      user.save((err, user) => {
        chai.request(server)
          .delete('/users/' + user.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('User successfully deleted!');
            res.body.result.should.have.property('ok').eql(1);
            res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
  });
});

// REMINDERS
describe('Reminders', () => {

  beforeEach((done) => { //Before each test we empty the database
    User.remove({}, (err) => {
      done();
    });
  });

  describe('/GET reminders', () => {
    it('it should GET an empty array reminders for the giver userId', (done) => {

      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

      let newReminder = {
        title: "ITD 862 Assignment 8",
        description: "Write automated tests for the functionality from assignment 6/7.",
      };

      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu',
      });

      // let reminder = user.reminder.create(newReminder);
      // user.reminder.push(newReminder);

      user.save((err, user) => {
        chai.request(server)
          .get('/users/' + user.id + '/reminders')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
      });

    });
  });

  describe('/GET reminders', () => {
    it('it should GET an array of reminders of length 1 for the giver userId', (done) => {

      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

      let newReminder = {
        title: "ITD 862 Assignment 8",
        description: "Write automated tests for the functionality from assignment 6/7.",
        created: localISOTime
      };

      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu',
      });

      let reminder = user.reminder.create(newReminder);
      user.reminder.push(reminder);

      user.save((err, user) => {
        chai.request(server)
          .get('/users/' + user.id + '/reminders')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            res.body[0].should.have.property('title').eql(reminder.title);
            res.body[0].should.have.property('description').eql(reminder.description);
            done();
          });
      });
    });
  });

  describe('/POST reminder', () => {
    it('it should POST a reminder for the specified user', (done) => {
      let reminder = {
        title: "ITD 862 Assignment 8",
        description: "Write automated tests for the functionality from assignment 6/7.",
      };
      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu'
      });
      user.save((err, user) => {
        chai.request(server)
          .post('/users/' + user.id + '/reminders')
          .send(reminder)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.reminder.should.have.property('title').eql(reminder.title);
            // res.body.reminder.should.have.property('created').eql(reminder.created);
            done();
          });
      });
    });
  });

  describe('/POST reminder', () => {
    it('it should not POST a reminder without the title property', (done) => {
      let reminder = {
        description: "Write automated tests for the functionality from assignment 6/7.",
      };
      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu'
      });
      user.save((err, user) => {
        chai.request(server)
          .post('/users/' + user.id + '/reminders')
          .send(reminder)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('reminder.0.title');
            res.body.errors['reminder.0.title'].should.have.property('kind').eql('required');
            done();
          });
      });
    });
  });

  describe('/GET reminder', () => {
    it('it should GET an 404 html page for missing reminder', (done) => {

      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu',
      });

      user.save((err, user) => {
        chai.request(server)
          .get('/users/' + user.id + '/reminders/123')
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Reminder not found!');
            done();
          });
      });
    });
  });

  describe('/GET reminder', () => {
    it('it should GET the reminder for the given userId and reminderId', (done) => {

      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

      let newReminder = {
        title: "ITD 862 Assignment 8",
        description: "Write automated tests for the functionality from assignment 6/7.",
        created: localISOTime
      };

      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu',
      });

      let reminder = user.reminder.create(newReminder);
      user.reminder.push(reminder);

      user.save((err, user) => {
        chai.request(server)
          .get('/users/' + user.id + '/reminders/' + reminder._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql(reminder.title);
            res.body.should.have.property('description').eql(reminder.description);
            done();
          });
      });
    });
  });

  describe('/Delete reminders', () => {
    it('it should delete reminders for the given userid ', (done) => {
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

      let newReminder = {
        title: "ITD 862 Assignment 8",
        description: "Write automated tests for the functionality from assignment 6/7.",
        created: localISOTime
      };

      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu',
      });

      let reminder = user.reminder.create(newReminder);
      user.reminder.push(reminder);

      user.save((err, user) => {
        chai.request(server)
          .delete('/users/' + user.id + '/reminders/')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.reminder.should.be.a('array');
            res.body.reminder.length.should.be.eql(0);
            res.body.should.have.property('message').eql('Reminders successfully deleted!');
            done();
          });
      });
    });
  });


  describe('/Delete reminder', () => {
    it('it should delete reminder for the given userid and reminderId', (done) => {
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

      let newReminder = {
        title: "ITD 862 Assignment 8",
        description: "Write automated tests for the functionality from assignment 6/7.",
        created: localISOTime
      };

      let user = new User({
        name: 'Grese Hyseni',
        email: 'ghyseni@hawk.iit.edu',
      });

      let reminder = user.reminder.create(newReminder);
      user.reminder.push(reminder);
      user.save((err, user) => {
        chai.request(server)
          .delete('/users/' + user.id + '/reminders/' + reminder.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('reminder').eql(null);
            res.body.should.have.property('message').eql('Reminder successfully deleted!');
            done();
          });
      });
    });
  });

});
