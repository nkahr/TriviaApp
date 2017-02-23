var express = require('express');
// var app = express();
var questionRouter = express.Router();

var QuestionsQuery = require('../client/db/questionsQuery');
var query = new QuestionsQuery();

questionRouter.get('/', function(req, res) {
  query.all(function(results) {
    res.json(results);
  });
});

module.exports = questionRouter;