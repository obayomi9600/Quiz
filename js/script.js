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

	var quizProgress = {
		questionIndex: 0
	};

	// ------PERSON CONSTRUCTOR--------
	function Person(id, firstname, lastname, score) {
		this.id = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.score = score;
	}
	var currentPersonData = {
		fullname: [],
		score: 0
	};

	var adminFullName = ['Martins', 'Obayomi'];

	var personLocalStorage = {
		setPersonData: function(newPersonData) {
			localStorage.setItem('personData', JSON.stringify(newPersonData));
		},
		getPersonData: function() {
			return JSON.parse(localStorage.getItem('personData'));
		},
		removePersonData: function() {
			localStorage.removeItem('personData');
		}
	}

	if (personLocalStorage.getPersonData() === null) {
		personLocalStorage.setPersonData([]);
	}

	return {

		getQuizProgress: quizProgress,

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
		},

		checkAnswer: function(ans) {
			if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
				currPersonData.score++;
				return true;
			} else {
				return false;
			}
		},

		isFinished: function() {
			return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
		},

		addPerson: function() {
			var newPerson, personId, personData;

			if (personLocalStorage.getpersonData().length > 0) {
				personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
			} else {
				personId = 0;
			}

			newPerson = new Person(personId, currentPersonData.fullname[0], currentPersonData.fullname[1], currentPersonData.score);
			personData = personLocalStorage.getPersonData();
			personData.push(newPerson);
			personLocalStorage.setPersonData(personData);
		},

		getCurPersonData: currPersonData,

		getAdminFullName: adminFullName,

		getPersonLocalStorage: personLocalStorage
	};

})(); // End of QuizController

// ------- UI controller Module-------------

var UIController = (function() {

	var domItems = {
		// Admin Panel Elements
		adminPanelSection: document.querySelector(".admin-panel-container"),
		questInsertBtn: document.getElementById("question-insert-btn"),
		newQuestionsText: document.getElementById("new-question-text"),
		adminOptions: document.querySelectorAll(".admin-option"),
		adminOptionsContainer: document.querySelector(".admin-options-container"),
		insertedQuestionsWrapper: document.querySelector(".inserted-questions-wrapper"),
		questUpdateBtn: document.getElementById("question-update-btn"),
		questDeleteBtn: document.getElementById("question-delete-btn"),
		questsClearBtn: document.getElementById("questions-clear-btn"),
		resultsListsWrapper: document.querySelector(".results-list-wrapper"),
		/* ------- Quiz Section Elements ------- */
		quizSection: document.querySelector(".quiz-container"),
		askedQuestText: document.getElementById("asked-question-text"),
		quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
		progressBar: document.querySelector("progress"),
		progressPar: document.getElementById("progress"),
		instAnsContainer: document.querySelector(".instant-answer-container"),
		instAnsText: document.getElementById("instant-answer-text"),
		instAnsDiv: document.getElmentById("instant-answer-wrapper"),
		emotionIcon: document.getElementById("emotion"),
		nextQuestBtn: document.getElementById("next-question-btn"),
		// ---------- LANDING PAGE ELEMENTS
		landingPageSection: document.querySelector(".landing-page-container"),
		startQuizBtn: document.getElementById("start-quiz-btn"),
		firstNameInput: document.getElementById("firstname"),
		lastNameInput: document.getElementByUd("lastname"),
		// -----------final result section element-----
		finalResultSection: document.querySelector(".final-result-container"),
		finalScoreText: document.getElementById("final-score-text")
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

			if ('question-'.indexOf(event.target.id)) {
				getId = parseInt(event.target.id.split('-')[1]);
				getStorageQuestList = storageQuestList.getQuestionCollection();

				for (var i = 0; i < getStorageQuestList.length; i++) {
					if (getStorageQuestList[i].id === getId) {
						foundItem = getStorageQuestList[i];
						placeInArr = i;
					}
				}

				domItems.newQuestionText.value = foundItem.questionText;
				domItems.adminOptionsCOntainer.innerHTML = '';

				optionHTML = '';

				for (var x = 0; x < foundItem.options.length; x++) {
					optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value=""><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';
				}

				domItems.adminOptionsCOntainer.innerHTML = optionHTML;

				domItems.questUpdateBtn.style.visibility = 'visible';
				domItems.questDeleteBtn.style.visibility = 'visible';
				domItems.questInsertBtn.style.visibility = 'hidden';
				domItems.questsClearBtn.style.pointerEvents = 'none';

				addInpsDynFn();

				var backDefaultView = function() {
					var updatedOptions;

					domItems.newQuestionsText.value = '';
					updatedOptions = document.querySelectorAll('.admin-option');

					for (var i = 0; i < updatedOptions.length; i++) {
						updatedOptions[i].value = '';
						updatedOptions[i].previousElementSibling.checked = false;
					}

					domItems.questUpdateBtn.style.visibility = 'hidden';
					domItems.questDeleteBtn.style.visibility = 'hidden';
					domItems.questInsertBtn.style.visibility = 'visible';
					domItems.questsClearBtn.style.pointerEvents = '';

					updateQuestListFn(storageQuestList);
				}

				var updateQuestion = function() {
					var newOptions, optionEls;
					newOptions = [];
					optionEls = document.querySelectorAll(".admin-option");
					foundItem.questionText = domItems.newQuestionsText.value;

					foundItem.correctAnser = '';

					for (var i = 0; i < optionEls.length; i++) {
						if (optionEls[i].value !== '') {
							newOptions.push(optionEls[i].value);
							if (optionEls[i].previousElementSibling.checked) {
								foundItem.correctAnser = optionEls[i].value;
							}
						}
					}
					foundItem.options = newOptions;

					if (foundItem.questiontext !== '') {
						if (foundItem.options.length > 1) {
							if (foundItem.correctAnswer !== '') {
								getStorageQuestList.splice(placeInArr, 1, foundItem);
								storageQuestList.setQuestionCollection(getStorageQuestList);
								backDefaultView();
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
				var deleteQuestion = function() {
					getStorageQuestList.spice(placeInArr, 1);
					storageQuestList.setQuestionCollection(getStorageQuestList);
					backDefaultView();
				}
				domItems.questDeleteBtn.onclick = deleteQuestion;
			}

		},
		clearQuestList: function(storageQuestList) {
			if (storageQuestList.getQuestionCollection() !== null) {
				if (storageQuestList.getQuestionCollection().length > 0) {
					var conf = confirm('Warning! You will lose entire question list');
					if (conf) {
						storageQuestList.removeQuestionCollection();
						domItems.insertedQuestionsWrapper.innerHTML = "";
					}
				}
			}
		},

		displayQuestion: function(storageQuestList, progress) {
			var newOptionHTML, characterArr;

			characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];
			if (storageQuestList.getQuestionCollection().length > 0) {
				domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
				domItems.quizOptionsWrapper = "";

				for (var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {
					newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + '</span><p  class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';

					domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
				}
			}
		},

		displayProgress: function(storageQuestList, progress) {
			domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
			domItems.progressBar.value = progress.questionIndex + 1;
			domItems.progressBar.textContent = (progress.questionIndex + 1) + '/' + storageQuestList.getQuestionCollection().length;
		},

		newDesign: function(ansResult, selectedAnswer) {
			var twoOptions, index;

			index = 0;

			if (ansResult) {
				index = 1;
			}

			twoOptions = {
				instAnswerText: ['This is a wrong anser', 'This is a correct answer'],
				instAnswerClass: ['red', 'green'],
				emotionType: ['images/sad.png', 'images/happy.png'],
				optionSpanBg: ['rgba(200, 0, 0 .7', 'rgba(0, 250, 0, .2']
			};
			domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";
			domItems.instAnsContainer.style.opacity = "1";
			domItems.instAnsText.textContent = twoOptions.anstAnserText[index];
			domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
			domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);

			selectedAnswer.previousElementSibling.style.backgroundCOlor = twoOptions.optionSpanBg[index];
		},

		resetDesign: function() {
			domItems.quizOptionsWrapper.style.cssText = "";
			domItems.instAnsContainer.style.opacity = "0";
		},

		getFullName: function(currPerson, storageQuestList, admin) {

			if (domItems.firstnameINput.value !== "" && domItems.lastNameInput.value !== "") {

				if (!(domItems.firstNameInput.value === admin[0] && donItems.lastNameInput.value === admin[1])) {
					if (storageQuestList.getQuestionCollection().length > 0) {
						currPerson.fullname.push(domItems.firstNameInput.value);
						currPerson.fullname.push(domItems.lastNameInput.value);

						domItems.landingPageSection.style.display = "none";
						domItems.quizSection.style.display = "block";
					} else {
						alert("Quiz is not ready, please contact administrator");
					}

				} else {
					domItems.landingPageSection.style.display = "none";
					domItems.adminPanelSection.style.display = "block";
				}
			} else {
				alert("Please, enter your firstname and lastname");
			}

		},

		finalResult: function(currPerson) {
			domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', your final score is ' + currPerson.score;
			domItems.quizSection.style.display = "none";
			domItems.finalResultSection.style.display = "block";
		},

		addResultOnPanel: function(userData) {
			var resultHTML;

			domItems.resultsListsWrapper.innerHTML = "";
			for (var i = 0; i < userData.getPersonData().length; i++) {
				resultHTML = '<p class="person person- + i + "><span class="person-' + i + '">' + userData.getPersonData()[i].firstname + ' ' + userData.getPersonData()[i].firstname + ' - ' + userData.getPersonData()[i].score + ' Points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
				domItems.resultsListsWrapper.insertAdjacentHTML('afterbegin', resultHTML);
			}
		},

		deleteResult: function(event, userData) {
			var getId, personsArr;

			personsArr = userData.getPersonData();

			if ('delete-result-btn'.indexOf(event.target.id)) {
				getId = parseInt(event.target.id.split('_')[i]);

				for (var i = 0; i < personsArr.length; i++) {
					if (personsArr[i].id === getId) {
						personsArr.splice(i, 1);
						userData.setPersonData(personsArr);
					}
				}
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

	selectedDomItems.questsClearBtn.addEventListener('click', function() {
		UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
	});

	UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

	UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

	selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e) {
		var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

		for (var i = 0; i < updatedOptionsDiv.length; i++) {

			if (e.target.className === 'choice-' + i) {

				var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

				var aswerResult = quizCtrl.checkAnswer(answer);

				UICtrl.newDesign(aswerResult, answer);

				if (quizCtrl.isFinished()) {
					// Finish Quiz
					selectedDomItems.nextQuestBtn.textContent = 'Finish';
				}

				var nextQuestion = function(questData, progress) {
					if (quizCtrl.isFInished()) {
						// Finish Quiz
						quizCtrl.addPerson();

						UICtrl.finalResult(quizCtrl.getCurrPersonData)

					} else {
						UICtrl.resetDesign();
						// Move to next question
						quizCtrl.getQuizProgress.questionIndex++;
						// Display next question
						UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
						// Update progress bar
						UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
					}
				}

				selectedDomItems.nextQuestBtn.onclick = function() {
					nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
				}
			}
		}
	});

	selectedDomItems.startQuizBtn.addEventListener('click', function() {
		UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFUllName);
	});

	selectedDomItems.lastNameInout.addEventListener('focus', function() {
		selectedDomItems.lastNameInput.addEventListener('keypress', function(e) {
			if (e.keyCode === 13) {
				UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFUllName);
			}
		});
	});

	UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

	selectedDomItems.resultsListsWrapper.addEventListener('click', function() {

		UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);

		UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
	});

})(quizController, UIController); // End of controller