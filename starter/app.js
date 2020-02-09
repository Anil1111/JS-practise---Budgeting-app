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

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current, index, completeIndex) {
            sum += current.value;
        });

        data.totals[type] = sum;
    }

    var data = { // All our data in one neat object.
        allItems: {
            exp: [], // Expenses
            inc: [] // Incomes
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 // -1, as in "it doesn't exist"
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

        deleteItem: function(type, id) {
            var ids, index;

            // We need to get the index of the id in data. Steps:
            // 1. Get an array ("ids") with the ids. 
            // 2. From "ids", find the index of our id.
            var ids = data.allItems[type].map(function(current, index, allArray) {
                return current.id;
            });
            index = ids.indexOf(id);

            console.log(index);

            if (index !== -1) {
                data.allItems[type].splice(index, 1); // Delete the data.
            }
        },

        calculateBudget: function () {
            // Calculate total income and expenses.
            calculateTotal("exp");
            calculateTotal("inc");

            // Calculate the budget: income - expenses. 
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the % of income that's been spent. 
            if (data.totals.inc > 0) { // If the total income is 0, you shouldn't do the division (you can't divide by 0).
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100); // Round to the nearest whole number.
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container"
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp (expenses).
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },

        addListFunction: function (obj, type) {
            var html, newHtml, element;

            if (type === "inc") {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%">            <div class="item__description">%description%</div>            <div class="right clearfix">                <div class="item__value">+ %value%</div>                <div class="item__delete">                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>                </div>            </div>        </div>';
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">    <div class="item__value">%value%</div>    <div class="item__percentage">21%</div>    <div class="item__delete">        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>    </div></div></div>';
            }

            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml); // Inserts newHtml before the end of element. So will 'insert' at the bottom.

        },

        clearFields: function () {
            var fieldsList, fieldsArray;

            fieldsList = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue); // querySelectorAll returns a list.

            // We need to convert our list to an array, to use the Array.forEach method. 

            // Trick: We use Array.slice(), as it returns an array. It's a 
            fieldsArray = Array.prototype.slice.call(fieldsList);

            fieldsArray.forEach(function (current, index, entireArray) {
                current.value = "";
            });

            fieldsArray[0].focus(); // Focuses to the Description field.
        },

        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
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

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    };

    var updateBudget = function () {
        // Calculate budget.
        budgetController.calculateBudget();

        // Return budget. 
        var budget = budgetController.getBudget();

        console.log(budget);
        // Display budget in UI.
        UIController.displayBudget(budget);

    }

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get field input data. 
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // Budget and Value must be filled in.
            // 2. Add item to budget controller. 
            newItem = budgetController.addItem(input.type, input.description, input.value);
            // 3. Add item to UI. 
            UICtrl.addListFunction(newItem, input.type);

            // 4. Clear fields. 
            UICtrl.clearFields();

            // Cauclate and update budget. 
            updateBudget();
        }
    }

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        // We are using #eventDelegation for these handlers, so relying on #eventBubbling.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // #DOMTraversing.

        if (itemID) {
            // ID is something like "inc-3" (item income number 3);

            splitID = itemID.split("-");
            type = splitID[0]; // income (inc) or expense (exp)
            ID = parseInt(splitID[1]);

            // Delete item from data structure. 
            budgetController.deleteItem(type, ID);

            // Delete item from UI.
            
            // Update and show new budget.
        }
    }

    return {
        init: function () { // Point of init function: So we can put the code that needs to run once when the program starts, in one place. 
            console.log("Application started.");
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();