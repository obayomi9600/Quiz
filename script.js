// Quiz controller Module 

var quizController = (function() {

	// Question Constructor 
	function Question(id, questionText, options, correctAnswer) {
		this.id = id;
		this.questionText = questionText;
		this.options = options;
		this.correctAnswer = correctAnswer;
	}

	// Set, get and remove questions from localStorage

	var questionLocalStorage = {
		setQuestionCollection: function(newCollection) {
			localStorage.setItem('questionCollection', JSON.stringify(newCollection));
		},
		getQuestionCollection: function() {
			return JSON.parse(localStorage.getItem('questionCollection'));
		},
		removeQuestionCollection: function() {
			localStorage.removeItem('questionCollection');
		}
	};
	if (questionLocalStorage.getQuestionCollection() === null) {
		questionLocalStorage.setQuestionCollection([]);
	}

	return {

		getQuestionLocalStorage: questionLocalStorage,

		addQuestionOnLocalStorage: function(newQuestText, opts) {
			var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

			if (questionLocalStorage.getQuestionCollection() === null) {
				questionLocalStorage.setQuestionCollection([]);
			}

			optionsArr = [];
			isChecked = false;

			for (var i = 0; i < opts.length; i++) {
				if (opts[i].value !== "") {
					optionsArr.push(opts[i].value);
				}

				if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
					corrAns = opts[i].value;
					isChecked = true;
				}
			}

			//[ {id: 0} {id: 1} ]
			// Creating id dynamically for each question collection
			if (questionLocalStorage.getQuestionCollection().length > 0) {
				questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
			} else {
				questionId = 0;
			}
			if (newQuestText.value !== "") { // If questions field is empty
				if (optionsArr.length > 1) { // At least two options included
					if (isChecked) { // Correct answer must be selected
						newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
						getStoredQuests = questionLocalStorage.getQuestionCollection();
						getStoredQuests.push(newQuestion);
						questionLocalStorage.setQuestionCollection(getStoredQuests);
						// Clear all fiels after inserting questions
						newQuestText.value = "";
						for (var x = 0; x < opts.length; x++) {
							opts[x].value = "";
							opts[x].previousElementSibling.checked = false;
						}
						// Error messages for wrong inputs on inserting questions & options
						return true;
					} else {
						alert('You missed to check correct answer, or you checked answer without value');
						return false;
					}
				} else {
					alert('You must insert at least two options');
					return false;
				}
			} else {
				alert('Please, Insert Question');
				return false;
			}
		}
	};

})(); // End of QuizController

// User Interface controller Module 

var UIController = (function() {

	var domItems = {
		// Admin Panel Elements
		questInsertBtn: document.getElementById("question-insert-btn"),
		newQuestionsText: document.getElementById("new-question-text"),
		adminOptions: document.querySelectorAll(".admin-option"),
		adminOptionsContainer: document.querySelector(".admin-options-container"),
		insertedQuestionsWrapper: document.querySelector(".inserted-questions-wrapper"),
		questUpdateBtn: document.getElementById("question-update-btn"),
		questDeleteBtn: document.getElementById("question-delete-btn"),
        questsClearBtn: document.getElementById("questions-clear-btn")
	};

	return {
		getDomItems: domItems,

		// Add inputs dynamically
		addInputsDynamically: function() {

			var addInput = function() {
				var inputHTML, z;
				// Create new classname Incrimented by one for every new input
				z = document.querySelectorAll(".admin-options").length;
				// Insert new input dynamicaly
				inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="0"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';
				domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
				// Remove focus event from last input field                
				domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
				// Add focus event on the next input field inserted
				domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

			}

			domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
		},

		createQuestionList: function(getQuestions) {
			var questHTML, numberingArr;
			numberingArr = [];
			domItems.InsertedQuestionsWrapper.innerHTM = "";
			for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
				numberingArr.push(i + 1);
				questHTML = '<p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

				domItems.insertedQuestionsWrapper.insertAdjacentHTML('afterbegin', questHTML);
			}
		},
		
		// Edit questions event
		editQuestList: function(event, storageQuestList, addInpsDynFn, updateQuestListFn) {
		    var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;
		    
		    if('question-'.indexOf(event.target.id)) {
		        getId = parseInt(event.target.id.split('-')[1]);
		        getStorageQuestList = storageQuestList.getQuestionCollection();
		        
		        for(var i=0; i<getStorageQuestList.length; i++) {
		            if(getStorageQuestList[i].id === getId) {
		                foundItem = getStorageQuestList[i];
		                placeInArr = i;
		            }
		        }
		        
		        domItems.newQuestionText.value = foundItem.questionText;
		        domItems.adminOptionsCOntainer.innerHTML = '';
		        
		        optionHTML = '';
		        
		        for(var x = 0; x < foundItem.options.length; x++) {
		            optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x +'" name="answer" value=""><input type="text" class="admin-option admin-option-' + x +'" value="' + foundItem.options[x] +'"></div>';
		        }
		        
		        domItems.adminOptionsCOntainer.innerHTML = optionHTML;
		        
		        domItems.questUpdateBtn.style.visibility = 'visible';
		        domItems.questDeleteBtn.style.visibility = 'visible';
		        domItems.questInsertBtn.style.visibility = 'hidden';
                domItems.questsClearBtn.style.pointerEvents = 'none';
		        
		        addInpsDynFn();
                
                var updateQuestion = function() {
                    var newOptions, optionEls;
                    newOptions = [];
                    optionEls = document.querySelectorAll(".admin-option");
                    foundItem.questionText = domItem.newQuestionsText.value;
                    
                    foundItem.correctAnser = '';
                    
                    for(var i = 0; i < optionEls.length; i++) {
                        if(optionEls[i].value !++ '') {
                            newOptions.push(optionEls[i].value);
                            if(optionEls[i].previousElementSibling.checked) {
                                foundItem.correctAnser = optionEls[i].value;
                            }
                        }
                    }
                    foundItem.options = newOptions;
                    
                    if(foundItem.questiontext !== '') {
                        if(foundItem.options.length > 1) {
                            if(foundItem.correctAnswer !== '') {
                    getStorageQuestList.splice(placeInArr, 1, foundItem);
                    storageQuestList.setQuestionCollection(getStorageQuestList);
                    domItems.newQuestionsText.value = '';
                    for(var i = 0; i < options.length; i++) {
                        optionEls[i].value = '';
                        optionEls[i].previousElementSibling.checked = false;
                    }
                    
                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    domItems.questInsertBtn.style.visibility = 'visible';
                    domItems.questsClearBtn.style.pointerEvents = '';
                                
                    updateQuestListFn(storageQuestList);
                            } else {
                                alert('You missed to check correct answer, or you checked answer without value');
                            }
                        } else {
                            alert('You must insert at least two options');
                        }
                    } else {
                        alert('Please, Insert Question');
                    }
                }
                
                domItems.questUpdateBtn.onclick = updateQuestion;
		    }
		    
		}
	};

})(); // End of UIController

// Controller Module 
// Given access to UIController and quizController Modules

var controller = (function(quizCtrl, UICtrl) {

	var selectedDomItems = UICtrl.getDomItems;

	UICtrl.addInputsDynamically();

	UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

	selectedDomItems.questInsertBtn.addEventListener('click', function() {

		var adminOptions = document.querySelectorAll('.admin-option');

		var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionsText, adminOptions);

		if (checkBoolean) {
			UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
		}

	});
	
selectedDomItems.insertedQuestionsWrapper.addEventListener('click', function() {
    UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
});

})(quizController, UIController); // End of controller