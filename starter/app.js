var budgetController = (function () {

    var x = 23;

    var add = function (a) {
        return x + a;
    }

    return {
        publicTest: function (b) {
            return (add(b));
        }
    }
})();


var UIController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp (expenses).
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();


// GLobal app controller.
// The controller that talks between the budgetController and UIController:
var controller = (function (budgetCtrl, UICtrl) {

    /* var z = budgetCtrl.publicTest(3);

    return {
        anotherPublic: function() {
            console.log(z);
        }
    } */

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function (e) {
    
            if (e.keyCode === 13 || e.which === 13) { // .which is used by older browsers.
                ctrlAddItem();
            }
        });
    };


    var ctrlAddItem = function () {
        // 1. Get field input data. 
        var input = UICtrl.getInput();
        // 2. Add item to budget controller. 

        // 3. Add item to UI. 

        // 4. Calculate budget. 

        // 5. Displa budget on UI. 

        console.log("WOrking");
    }

    return {
        init: function() { // Point of init function: So we can put the code that needs to run once when the program starts, in one place. 
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
