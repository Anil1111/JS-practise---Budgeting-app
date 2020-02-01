/* var budgetController = (function () {

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
 */

var budgetController = (function () {

    var Expense = function (id, description, value) { // Function constructors, by convention, start with capitals. 
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) { // Function constructors, by convention, start with capitals. 
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = { // All our data in one neat object.
        allItems: {
            exp: [], // Expenses
            inc: [] // Incomes
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function (type, description, value) { // Type is income or expense.
            var newItem, ID;

            // ID is the last item's ID + 1.
            if (data.allItems[type].length > 0) { // Just for the beginning when there's no items.
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === "exp") {
                newItem = new Expense(ID, description, value);
            } else if (type === "inc") {
                newItem = new Income(ID, description, value);
            }

            // Push new item to our data structure.
            data.allItems[type].push(newItem);

            return newItem;
        },

        testing: function () {
            console.log(data);
        }
    }
})();


var UIController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp (expenses).
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }
        },

        addListFunction: function (obj, type) {
            var html, newHtml, element;

            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="income-%id%">            <div class="item__description">%description%</div>            <div class="right clearfix">                <div class="item__value">+ %value%</div>                <div class="item__delete">                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>                </div>            </div>        </div>';
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix">    <div class="item__value">%value%</div>    <div class="item__percentage">21%</div>    <div class="item__delete">        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>    </div></div></div>';
            }

            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml); // Inserts newHtml before the end of element. So will 'insert' at the bottom.

        },

        clearFields: function() {
            var fieldsList, fieldsArray;

            fieldsList = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue); // querySelectorAll returns a list.

            // We need to convert our list to an array, to use the Array.forEach method. 

            // Trick: We use Array.slice(), as it returns an array. It's a 
            fieldsArray = Array.prototype.slice.call(fieldsList);

            fieldsArray.forEach(function(current, index, entireArray) {
                current.value = "";
            });

            fieldsArray[0].focus(); // Focuses to the Description field.
        },

        getDOMstrings: function () {
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

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function (e) {

            if (e.keyCode === 13 || e.which === 13) { // .which is used by older browsers.
                ctrlAddItem();
            }
        });
    };


    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get field input data. 
        input = UICtrl.getInput();
        // 2. Add item to budget controller. 
        newItem = budgetController.addItem(input.type, input.description, input.value);
        // 3. Add item to UI. 
        UICtrl.addListFunction(newItem, input.type);

        // 4. Clear fields. 
        UICtrl.clearFields();

        // 5. Calculate budget. 

        // 6. Displa budget on UI. 

        console.log("WOrking");
    }

    return {
        init: function () { // Point of init function: So we can put the code that needs to run once when the program starts, in one place. 
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();