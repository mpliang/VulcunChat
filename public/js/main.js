'use strict';

let socket = io.connect('http://localhost:3000');
let app = angular.module('chatApp', ['btford.socket-io']);
let dictionary;

app.factory('socket', (socketFactory) => {
  let socket = io.connect('http://localhost:3000');
  return socketFactory({
    ioSocket: socket
  });
})

.controller('mainCtrl', ($scope, $filter, $http, socket) => {
  $scope.messages = [];

  $.get("http://localhost:3000/randomWords")
    .then(data => {
      dictionary = data;
      console.log(dictionary);
    },
      err => console.log(error));

  swal({
    title: "Welcome to simple chat!",
    type: "input",
    closeOnConfirm: false,
    confirmButtonText: 'Go!',
    confirmButtonColor: '#4CAF50',
    animation: "slide-from-top",
    inputPlaceholder: "Please enter your name"
  }, inputValue => {
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("Please enter a name!");
      return false
    }
    $scope.name = inputValue;
    swal(`Thanks!`)
  });

  socket.on('history', history => $scope.messages = history);
  socket.on('message', message => $scope.messages.unshift(message));

  $scope.newMessage = function () {
    let newMessage = {};
    newMessage.text = $filter('censor')($scope.message);
    newMessage.name = $scope.name;
    console.log(newMessage);
    socket.emit('newMessage', newMessage);
    $scope.message = '';
  };

})

.filter('censor', function () {
  return function (input) {
    if (!input) {
      return;
    }
    return input.split(' ').map(function (val) {
      if (dictionary.indexOf(val.toLowerCase()) >= 0) {
        return val.replace(/./g, '*');
      } else {
        return val;
      }
    }).join(' ');
  }
});
