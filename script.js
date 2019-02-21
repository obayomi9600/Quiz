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

    return {
        addQuestionOnLocalStorage: function(newQuestText, opts) {
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

            optionsArr = [];
            isChecked = false;

            for(var i = 0; i < opts.length; i++) {
                if(opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }

                if(opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            //[ {id: 0} {id: 1} ]
            // Creating id dynamically for each question collection
            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }
            if(newQuestText.value !== "") { // If questions field is empty
                if(optionsArr.length > 1) { // At least two options included
                    if(isChecked) { // Correct answer must be selected
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
                        getStoredQuests = questionLocalStorage.getQuestionCollection();
                        getStoredQuests.push(newQuestion);
                        questionLocalStorage.setQuestionCollection(getStoredQuests);
                        // Clear all fiels after inserting questions
                        newQuestText.value = "";
                        for(var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }
                        console.log(questionLocalStorage.getQuestionCollection());
                        // Error messages for wrong inputs on inserting questions & options
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
    };

})(); // End of QuizController

// User Interface controller Module 

var UIController = (function() {

    var domItems = {
        // Admin Panel Elements
        questInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionsText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container")
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
        }
    };

})(); // End of UIController

// Controller Module 
// Given access to UIController and quizController Modules

var controller = (function(quizCtrl, UICtrl) {

    var selectedDomItems = UICtrl.getDomItems;
    
    UICtrl.addInputsDynamically();
    
    selectedDomItems.questInsertBtn.addEventListener('click', function() {
        
        var adminOptions = document.querySelectorAll('.admin-option');

        quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionsText, adminOptions);

    });

})(quizController,UIController); // End of controller