
var registrationUI = require('../views/leaderboardUI.js');

var leaderboard = function() {
  new leaderboardUI();
}

window.onload = leaderboard;