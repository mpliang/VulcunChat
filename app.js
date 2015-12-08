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
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', function (req, res) {
  res.render('index');
});

app.get('/randomWords', (req, res) => {
  res.send(randomWords(100));
})
var history = [];

io.on('connection', function(socket) {
  socket.emit('history', history);

  socket.on('newMessage', function(message) {
    history.unshift(message);
    io.emit('message', message);
  });

  setInterval(function(){
    let newMessages = randomMessages();
    history = newMessages.concat(history);
    socket.emit('history', history)
  },5000);

  // (()=> {
  //   console.log(randomWords(100));
  // })()


  let randomMessages = () => {
    let msg = [];
    for (let i=0; i<1; i++){
      msg.push({
        text: `${randomWords({min:3, max: 10, join: ' '})}.`,
        name: `${chance.first()} ${chance.last()}`
      });
    }
    return msg;
  }
});

server.listen(PORT);
