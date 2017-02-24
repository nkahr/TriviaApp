/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {


var registrationUI = function() {
  this.removeContent("question");
  this.removeContent("main");
  this.createForm();
}

registrationUI.prototype = {
  removeContent: function(htmlElementId) {
    var toClear = document.getElementById(htmlElementId);
    while (toClear.firstChild) {
        toClear.removeChild(toClear.firstChild);
    }
  }, 

  createInputField: function(form, type, name, value) {
    var input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.name = name;
    form.appendChild(input);
  },

  createSubmitButton: function(form, type, value) {
    var input = document.createElement("input");
    input.type = type;
    input.value = value;
    form.appendChild(input);
    return input;
  },

  createForm: function() {
    var container = document.getElementById("main");
    var form = document.createElement("form");
    form.action = "/api/players/"; 
    form.method="post";
    container.appendChild(form);
    this.createInputField(form, "text", "name", "Name");
    this.createInputField(form, "text", "password", "Password");
    var submitButton = this.createSubmitButton(form, "submit", "SUBMIT");
  }

}

module.exports = registrationUI;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Questions = __webpack_require__(4);
var Player = __webpack_require__(3)

var currentPlayer;
var questionsArray;
var questionIndex;

var UI = function() {
  var questions = new Questions();
  questions.all(function(result) {
    questionsArray = result;
    questionIndex = 0;
    this.render(questionsArray[questionIndex]);
  }.bind(this));
  this.setupPlayer();
}

UI.prototype = {
  createText: function(text) {
    var p = document.createElement('p');
    p.innerText = text;
    return p;
  }, 

  setupPlayer: function() {
    var currentSavedPlayer = localStorage.getItem("currentPlayer");
    if (!currentSavedPlayer) {
      currentPlayer = {
        name: "Test Player", 
        score: 0
      };
      this.savePlayer(currentPlayer);
    } else {
      currentPlayer = JSON.parse(currentSavedPlayer);
    }
  },

  appendText: function(element, text) {
    var pTag = this.createText(text);
    element.appendChild(pTag);
  }, 

  savePlayer: function(playerObject) {
    var dataToSave = JSON.stringify(playerObject);
    localStorage.setItem("currentPlayer", dataToSave);
  },

  checkAnswer: function(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
      console.log("correct");
      currentPlayer.score += 1;
      this.savePlayer(currentPlayer);
    } else {
      console.log("incorrect");
    }
    questionIndex += 1;
    this.removeQuestion();
    this.render(questionsArray[questionIndex]);
  },

  removeQuestion: function() {
    var divToRemove = document.getElementById("question");
    while (divToRemove.firstChild) {
        divToRemove.removeChild(divToRemove.firstChild);
    }
  },

  renderButtons: function(question) {
    var containerDiv = document.getElementById('question');
    question.possibleAnswers.forEach(function(answer) {
      var answerButton = document.createElement('button');
      this.appendText(answerButton, answer);
      containerDiv.appendChild(answerButton);
      answerButton.addEventListener('click', function(){
          this.checkAnswer(answer, question.correctAnswer);
      }.bind(this));
    }.bind(this));
  },

  render: function(question) {
    if (questionIndex < questionsArray.length) {
      var containerDiv = document.getElementById('question');
      var p = document.createElement('p');
      this.appendText(p, question.questionString)
      containerDiv.appendChild(p);
      this.renderButtons(question);
    }
  }

}

module.exports = UI;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var UI = __webpack_require__(1);
var registrationUI = __webpack_require__(0);


var welcomeUI = function() {
  this.createWelcomeText();
  this.createPlayButton();
  this.createRegisterButton();
}

welcomeUI.prototype = {
  createWelcomeText: function() {
    var welcomeText = document.createElement('p');
    welcomeText.innerText = "This is a game";
    var div = document.getElementById('main')
    div.appendChild(welcomeText);
  }, 

  handleButtonClick: function() {
    new UI();
  },

  handleRegisterButtonClick: function() {
    new registrationUI();
  },

  createPlayButton: function() {
    var playButton = document.createElement('button');
    playButton.innerText = "PLAY";
    var div = document.getElementById('main')
    div.appendChild(playButton);
    playButton.onclick = this.handleButtonClick;
  }, 

  createRegisterButton: function() {
    var registerButton = document.createElement('button');
    registerButton.innerText = "REGISTER";
    var div = document.getElementById('main')
    div.appendChild(registerButton);
    registerButton.onclick = this.handleRegisterButtonClick;
  }

}

module.exports = welcomeUI;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var Player = function(options){
  this.name = options.name;
  this.password = options.password;
  this.scores = options.scores;
};

module.exports = Player;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var Questions = function() {
}

Questions.prototype = {
  makeRequest: function(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = callback;
    request.send();
  }, 

  makePostRequest: function(url, callback, entryData) {
    var request = new XMLHttpRequest();
    request.open("POST", url);//we request the POST connection
    request.setRequestHeader("Content-type", "application/json");//hey api, the POSTed file is in JSON
    request.onload = callback;
    request.send(entryData);
  },

  makePutRequest: function(url, callback, entryData){
    request.open("PUT", url);
    request.setRequestHeader("Content-type", "application/json");
    request.onload = callback;
    request.send(entryData);
  },

  makeDeleteRequest: function(url, callback){
    request.open("DELETE", url);
    request.setRequestHeader("Content-type", "application/json");
    request.onload = callback;
    request.send();
  },

  // makePostRequest: function(url, callback, entryData) {
  //   var request = new XMLHttpRequest();
  //   request.open("POST", url);//we request the POST connection
  //   request.setRequestHeader("Content-type", "application/json");//hey api, the POSTed file is in JSON
  //   request.onload = callback;
  //   request.send(entryData);
  // },

  // /////////////////////TO BE CHECKED/////////////////////////////////////////////////
  // makePutRequest: function(url, callback, entryData){
  //   request.open("PUT", url);
  //   request.setRequestHeader("Content-type", "application/json");
  //   request.onload = callback;
  //   request.send(entryData);
  // },

  // makeDeleteRequest: function(url, callback){
  //   request.open("DELETE", url);
  //   request.setRequestHeader("Content-type", "application/json");
  //   request.onload = callback;
  //   request.send();
  // },

  all: function(callback) {
    this.makeRequest('http://localhost:3000/api/questions', function() {
      if (this.status != 200) return;
        var jsonString = this.responseText;
        var result = JSON.parse(jsonString);
        callback(result);
    });
  }
  // add: function(newQuestion, callback){
  //   var questionToAdd = JSON.stringify(newQuestion);
  //   this.makePostRequest('http://localhost:3000/api/questions', questionToAdd, callback);
  // },

  // update: function(question, callback){
  //   var questionUpdate = JSON.stringify(question);
  //   this.makePutRequest('http//localhost:3000/api/questions', questionUpdate, callback);
  // },

  // delete: function(question, callback){
  //   this.makeDeleteRequest("http//localhost:3000/api/questions", question, callback);
  // }
}

module.exports = Questions;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var UI = __webpack_require__(1);
var welcomeUI = __webpack_require__(2);
var registrationUI = __webpack_require__(0);

var welcome = function() {
  new welcomeUI();
}

var registration = function() {
  new registrationUI();
}

var app = function() {
  new UI();
}

window.onload = welcome;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map