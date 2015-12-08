'use strict';

let socket = io.connect('VulcunChat-dev.elasticbeanstalk.com');
let app = angular.module('chatApp', ['btford.socket-io']);
let dictionary;

app.factory('socket', (socketFactory) => {
  let socket = io.connect('VulcunChat-dev.elasticbeanstalk.com');
  return socketFactory({
    ioSocket: socket
  });
})

.controller('mainCtrl', ($scope, $filter, $http, socket) => {
  $scope.messages = [];

  $.get("/randomWords")
    .then(data => {
        dictionary = data;
        console.log(dictionary);
      }, err => console.log(error)) ;

  $.get("messages")
    .then( data => $scope.messages = data,
    err => console.log(error) );

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
    swal({
      title: 'Thanks!',
      type: 'success',
      text: `Have fun chatting ${$scope.name}!`,
      timer: 1800,
      showConfirmButton: false
    });
  });

  socket.on('history', history => $scope.messages = history);
  socket.on('message', message => $scope.messages.push(message));

  $scope.newMessage = function () {
    if ($scope.message === '') return;
    else {
      let newMessage = {};
      newMessage.text = $filter('censor')($scope.message);
      newMessage.name = $scope.name;
      socket.emit('newMessage', newMessage);
      $scope.message = '';
    }
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
  })
  .directive('scrollBottom', function ($timeout) {
    return {
      scope: {
        scrollBottom: "="
      },
      link: function ($scope, $element) {
        $scope.$watchCollection('scrollBottom', function (newValue) {
          if (newValue) {
            $timeout(function () {
              $element.scrollTop($element[0].scrollHeight);
            }, 0);
          }
        });
      }
    }
  });
