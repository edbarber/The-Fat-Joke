// Ionic Starter App
//import { TextToSpeech, TTSOptions } from '@ionic-native/text-to-speech';

const FIREBASE_URL = "https://the-fat-joke.firebaseio.com/";

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var module = angular.module('starter', ['ionic', 'firebase'])
var jokes = []; // current list of jokes to choose from

function initializeJokes(category) {
  var ref = new Firebase(FIREBASE_URL);
  var firebaseMessages = ref.child(category); // get the child from the root based on category
  
  firebaseMessages.on("value", function(snapshot) {
    // iterate through all the children inside each child from the root based on category
    snapshot.forEach(function(child) {
      jokes.push(child.val());   // add it to the list of jokes
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
  $scope.showTTSButton = false;
  $scope.welcomeText = "Select the joke button to generate a joke";
  $scope.line = "The Fat Joke!";
  $scope.theJoke = "Here is what you have to read and laugh!";
  $scope.hideMessage = false;
  //$scope.index = -1; //By default don't read a joke

  // call this to go back to the previous window
  $scope.goBack = function() {
    history.back();
    $scope.stopReading();
  }

  $scope.generateJoke = function(queryStringParameter) {
    if (jokes.length == 0) {
      // there are no jokes left, so generate a new list of jokes
      initializeJokes(getUrlParameter(queryStringParameter));
    }
    
    // pick a random index from the jokes list
    var index = Math.trunc(Math.random() * jokes.length - 1);
    //Save the joke string before split
    $scope.theJoke = jokes[index];
    // split the line breaks into a new array 
    // (can't seem to just output it raw)
    var result = jokes[index].split("\n");  
    // take it the joke we just stored 
    // (so we don't have duplicate random jokes)
    jokes.splice(index, 1); 
    // use this array to output the lines seperately rather than on one line
    $scope.jokeLines = result;  
    // used to hide initial message if jokes are shown
    $scope.hideMessage = $scope.jokeLines.length > 0;

    //Get text and call TTS
    $scope.line = $scope.jokeLines[0];
    $scope.showTTSButton = true;
    $scope.readText();
  }

  //*********** Read text - TTS ***************
  $scope.readText = function () {
    var divText = ($scope.jokeLines != null)? $scope.theJoke: $scope.welcomeText;
    
    window.TTS.speak({text: divText, locale: 'en-US', rate: 0.8 }, function () {
      console.log("READ SUCCESS");
    }, function (reason) {
      console.log("READ error: " + reason);
    });
  }

  //********** Stop reading - TTS *************
  $scope.stopReading = function (t) {
    window.TTS.speak({text: '', locale: 'en-US', rate: 0.8 }, function () {
      console.log("STOP SUCCESS");
    }, function (reason) {
      console.log("STOP error: " + reason);
    });
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

