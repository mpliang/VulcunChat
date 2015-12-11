'use strict';

var express = require('express');
var http = require('http');
var async = require('async');
var router = express.Router();
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var Chance = require('chance');
var chance = new Chance();
var User = require('../models/User');
var randomWords = require('random-words');


router.get('/', (req, res) => {
  res.render('index');
});


//sends the length of the db
router.get('/users', (req, res) => {
  User.count({}, (err, data) => {
    console.log(data);
    res.json(data);
  })
});


//adds 10 million users to db 50,000 at a time (200 times)
router.get('/addData', (req, res, next) => {
  async.timesSeries(200, (n, next) => {
    console.log('n:', n);

    var users = [];
    for (var i = 0; i < 50000; i++) {
      var user = {};
      user.full_name = `${chance.first()} ${chance.last()}`;
      user.email = chance.email();
      user.city = chance.city();
      users.push(user);
    }

    User.create(users, (err, saved) => {
      if (err) {
        console.log('err:', err);
        return next(err);
      }
      next();
    });
  })
});

//query to search names in db
router.get('/users/:query', (req, res, next) => {
  let regex = new RegExp(req.params.query, 'i')
  User.find({
    full_name: regex
  }, (err, data) => {
    console.log('query results: ', data);
    res.status(err ? 400 : 200).send(err || data);
  })
});


//route to get 100 random words
router.get('/randomWords', (req, res) => res.send(randomWords(100)))

module.exports = router;
