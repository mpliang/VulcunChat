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

router.get('/users', (req, res) => {
  User.find({}, (err, data) => {
    console.log(data.length);
    res.json(data.length);
  })
});

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


router.get('/users/:query', (req, res, next) => {
  let regex = new RegExp(req.params.query, 'i')
  User.find({
    full_name: regex
  }, (err, data) => {
    console.log('query results: ', data);
    res.status(err ? 400 : 200).send(err || data);
  })
});

router.get('/randomWords', (req, res) => res.send(randomWords(100)))


// io.on('connection', (socket) => {
//   socket.emit('history', history);
//   socket.on('newMessage', (message) => {
//     history.push(message);
//     io.emit('message', message);
//   });
//
//   setInterval(() => {
//     let newMessages = randomMessages();
//     history = history.concat(newMessages);
//     socket.emit('history', history)
//   }, 5000);
//
//   setInterval(() => {
//     history = [];
//   }, 30000);
//
//
//
//   let randomMessages = () => {
//     let msg = [];
//     for (let i = 0; i < 10; i++) {
//       msg.push({
//         text: `${randomWords({min:3, max: 10, join: ' '})}.`,
//         name: `${chance.first()} ${chance.last()}`
//       });
//     }
//     return msg;
//   }
// });

module.exports = router;
