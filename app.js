'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');
var randomWords = require('random-words');
var Chance = require('chance');
var chance = new Chance();

var app = express();

var io = socket_io();
app.io = io;


//route to get all the messages
var history = [];
app.get('/messages', (req, res) => res.send(history));

//socket.io logic
io.on('connection', (socket) => {
  socket.emit('history', history);
  socket.on('newMessage', (message) => {
    history.push(message);
    io.emit('message', message);
  });
  //on connection, this interval runs ever 5 seconds to deliver 1000 random messages
  // setInterval(() => {
  //   let newMessages = randomMessages();
  //   history = history.concat(newMessages);
  //   socket.emit('history', history)
  // }, 5000);

  //this interval clears the history every 30 seconds to not clog memory
  // setInterval(() => {
  //   history = [];
  // }, 30000);


//   let randomMessages = () => {
//     let msg = [];
//     for (let i = 0; i < 1000; i++) {
//       msg.push({
//         text: `${randomWords({min:3, max: 10, join: ' '})}.`,
//         name: `${chance.first()} ${chance.last()}`
//       });
//     }
//     return msg;
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.use('/', require('./routes/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
