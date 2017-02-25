var Questions = require('../models/questions');
var Player = require('../models/player')

///test comment

var currentPlayer;
var questionsArray;
var questionIndex;

var gameUI = function() {
  var questions = new Questions();
  questions.all(function(result) {
    questionsArray = result;
    questionIndex = 0;
    this.render(questionsArray[questionIndex]);
  }.bind(this));
  this.setupPlayer();
}

gameUI.prototype = {
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
      var correctSound = new Audio('data:audio/wav;base64,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');
      correctSound.play();
    } else {
      console.log("incorrect");
      var wrongSound = new Audio("data:audio/wav;base64,SUQzAwAAAAAPdlRJVDIAAAAdAAAARmFtaWx5IEZvcnR1bmVzIFdyb25nIEJ1enplclRQRTEAAAAKAAAAVHYgVGhlbWVzVEFMQgAAAB8AAABodHRwOi8vd3d3Lm1vb25zaGFkZXdvcmxkLm5ldC9DT01NAAAAIQAAAAAAAABEb3dubG9hZGVkIGZyb20gd3d3Lm1vb25zaGFkVENPTgAAAAYAAABCbHVlc1RSQ0sAAAADAAAANzgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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");
      wrongSound.play();
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

module.exports = gameUI;