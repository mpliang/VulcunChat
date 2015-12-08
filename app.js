'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var server = http.Server(app);

var io = require('socket.io')(server);
var Chance = require('chance');
var chance = new Chance();
var randomWords = require('random-words');


app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/randomWords', (req, res) => res.send(randomWords(100)))
var history = [];

app.get('/messages', (req, res) => res.send(history));

io.on('connection', (socket) => {
  socket.emit('history', history);
  socket.on('newMessage', (message) => {
    history.push(message);
    io.emit('message', message);
  });

  () => {
    setInterval(() => {
      let newMessages = randomMessages();
      history = history.concat(newMessages);
      socket.emit('history', history)
    }, 5000);
  }


  let randomMessages = () => {
    let msg = [];
    for (let i = 0; i < 100; i++) {
      msg.push({
        text: `${randomWords({min:3, max: 10, join: ' '})}.`,
        name: `${chance.first()} ${chance.last()}`
      });
    }
    return msg;
  }
});

server.listen(PORT);
