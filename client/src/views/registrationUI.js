var welcomeUI = require('./welcomeUI.js');

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

  handleGoBackButtonClick: function(){
    window.location = "/";
  },

  createGoBackButton: function(){
    var container = document.getElementById("main");
    var goBackButton = document.createElement("button");
    goBackButton.innerText = "GO BACK";
    container.appendChild(goBackButton);
    goBackButton.onclick = this.handleGoBackButtonClick;
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
    this.createGoBackButton();
  }
}

module.exports = registrationUI;