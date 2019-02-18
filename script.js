// Quiz controller Module - IIFE
var quizController = (function() {})();

// User Interface Module - IIFE
var UIController = (function() {})();

// Controller Module - IIFE
// Given access to UIController and quizController Modules
var controller = (function(quizCtrl, UICtrl) {})(quizController, UIController);
