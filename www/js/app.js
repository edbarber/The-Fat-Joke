// Ionic Starter App

const FIREBASE_URL = "https://the-fat-joke.firebaseio.com/";
const FIREBASE_CATEGORY_PATH = "";

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var module = angular.module('starter', ['ionic', 'firebase'])
var jokes = []; // current list of jokes to choose from

function initializeJokes(category) {
  var ref = new Firebase(FIREBASE_URL);
  var firebaseMessages = ref.child(FIREBASE_CATEGORY_PATH + category);
  
  firebaseMessages.on("value", function(snapshot) {
    snapshot.forEach(function(child) {
      jokes.push(child.val());    
    });
  });
}

// https://davidwalsh.name/query-string-javascript
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

module.controller('jokeCtrl', function($scope, $firebaseObject) {
  $scope.getJoke = function(queryStringParameter) {
    if (jokes.length == 0) {
      initializeJokes(getUrlParameter(queryStringParameter));
    }
    
    var index = Math.trunc(Math.random() * jokes.length - 1);
    var result = jokes[index];
    
    jokes.splice(index, 1);

    return result;
  }
})

module.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
