// Transaction Class: Represents a Transaction
class Transaction {
    constructor(date, description, amount) {
        this.date = date;
        this.description = description;
        this.amount = amount;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayTransactions() {
        const transactions = Store.getTransactions();
        transactions.forEach((transaction) => UI.addTransactionToList(transaction));
    }

    static addTransactionToList(transaction) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.amount}</td>
            <td><a href="#" class="btn btn-warning btn-sm update">Update</a></td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteTransaction(el) {
        el.parentElement.parentElement.remove(); // Remove the transaction from the UI
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#date').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#amount').value = '';
    }

    static populateForm(transaction) {
        document.querySelector('#date').value = transaction.date;
        document.querySelector('#description').value = transaction.description;
        document.querySelector('#amount').value = transaction.amount;
    }

    static enableUpdateMode() {
        document.querySelector('#submit-btn').style.display = 'none'; // Hide submit button
        document.querySelector('#update-button').style.display = 'inline'; // Show save button
        document.querySelector('#cancel-button').style.display = 'inline'; // Show cancel button
    }

    static disableUpdateMode() {
        document.querySelector('#submit-btn').style.display = 'inline'; // Show submit button
        document.querySelector('#update-button').style.display = 'none'; // Hide save button
        document.querySelector('#cancel-button').style.display = 'none'; // Hide cancel button
    }
}

// Store Class: Handles Storage
class Store {
    static getTransactions() {
        let transactions;
        if (localStorage.getItem('transactions') === null) {
            transactions = [];
        } else {
            transactions = JSON.parse(localStorage.getItem('transactions'));
        }
        return transactions;
    }

    static addTransaction(transaction) {
        const transactions = Store.getTransactions();
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    static removeTransaction(description) {
        let transactions = Store.getTransactions();
        transactions = transactions.filter((transaction) => transaction.description !== description);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    static updateTransaction(oldDescription, updatedTransaction) {
        let transactions = Store.getTransactions();
        //console.log(transactions);
        //console.log(updatedTransaction);
        //console.log(oldDescription);
        transactions = transactions.map(transaction => 
            transaction.description === oldDescription ? updatedTransaction : transaction
        );
        //console.log(transactions);

        localStorage.setItem('transactions', JSON.stringify(transactions));
        $('#book-list').empty();
        UI.displayTransactions();
    }
}

// Event: Display Transactions
document.addEventListener('DOMContentLoaded', UI.displayTransactions);

// Variable to track the old transaction data
let oldTransactionData = null;

// Event: Add or Update a Transaction
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const date = document.querySelector('#date').value.trim();
    const description = document.querySelector('#description').value.trim();
    const amount = document.querySelector('#amount').value.trim();

    // Validate
    if (date === '' || description === '' || amount === '') {
        UI.showAlert('Please fill in all fields', 'danger');
        return;
    }

    const isUpdating = oldTransactionData !== null;

    if (isUpdating) {
        // Update existing transaction
       //const updatedTransaction = new Transaction(date, description, amount);
        //UI.deleteTransaction(updateElement);
        //UI.addTransactionToList(updatedTransaction);
        //Store.updateTransaction(oldTransactionData.description, updatedTransaction);
        UI.showAlert('Transaction Updated', 'success');
        UI.clearFields();
        UI.disableUpdateMode();
        oldTransactionData = null; // Reset old transaction data
    } else {
        // Add new transaction
        const transaction = new Transaction(date, description, amount);
        UI.addTransactionToList(transaction);
        Store.addTransaction(transaction);
        UI.showAlert('Transaction Added', 'success');
        UI.clearFields();
    }
});


// Variable to store the element to be deleted or updated
let deleteElement;
let updateElement;

// Event: Remove a Transaction
document.querySelector('#book-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        deleteElement = e.target; // Store the element to be deleted
        // Show the modal or directly delete if no modal is required
        Store.removeTransaction(deleteElement.parentElement.previousElementSibling.textContent);
        UI.deleteTransaction(deleteElement);
        UI.showAlert('Transaction Removed', 'success');
    }

    if (e.target.classList.contains('update')) {
        updateElement = e.target.parentElement.parentElement; // Get the row
        const date = updateElement.children[0].textContent;
        const description = updateElement.children[1].textContent;
        const amount = updateElement.children[2].textContent;

        // Populate form for update
        oldTransactionData = { date, description, amount }; // Store old transaction data
        UI.populateForm({ date, description, amount });
        UI.enableUpdateMode(); // Call enableUpdateMode to show save and cancel buttons
    }
});

// Handle cancel button
document.querySelector('#cancel-button').addEventListener('click', () => {
    UI.clearFields();
    UI.disableUpdateMode();
});

//to save
document.querySelector('#update-button').addEventListener('click', () => {
    const updatedDate = document.querySelector('#date').value;
    const updatedDescription = document.querySelector('#description').value;
    const updatedAmount = document.querySelector('#amount').value;

    // Validate
    if (updatedDate === '' || updatedDescription === '' || updatedAmount === '') {
        UI.showAlert('Please fill in all fields', 'danger');
        return;
    }

    // Update existing transaction
    const updatedTransaction = new Transaction(updatedDate, updatedDescription, updatedAmount);
    //UI.deleteTransaction(updateElement);
    UI.addTransactionToList(updatedTransaction);
    Store.updateTransaction(oldTransactionData.description, updatedTransaction);
    UI.showAlert('Transaction Updated', 'success');
    UI.clearFields();
    UI.disableUpdateMode();
    //UI.deleteTransaction(deleteElement);
    const currentUrl = window.location.href;
    console.log(currentUrl);
    location.href = currentUrl;
    console.log(location.href);
    oldTransactionData = null; // Reset old transaction data
});


// Format amount input as a comma-separated number
function formatAmount(e) {
    let value = e.target.value;

    // Check if the input contains a period (for decimals)
    if (value.includes('.')) {
        let [integerPart, decimalPart] = value.split('.');

        // Ensure the decimal part is at most 2 digits
        decimalPart = decimalPart.substring(0, 2);

        // Format the integer part with commas
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Combine the formatted integer part with the decimal part
        e.target.value = `${integerPart}.${decimalPart}`;
    } else {
        // Format the value as a comma-separated number
        e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// Attaching the function to the input event
const amountInput = document.querySelector('#amount');
amountInput.addEventListener('input', formatAmount);

// Datepicker Initialization
$(document).ready(function () {
    $('.datepicker').datepicker({
        format: 'dd-M-yyyy', // Bootstrap datepicker format
        autoclose: true,
        todayHighlight: true
    }).on('changeDate', function (e) {
        // Format the selected date
        const selectedDate = e.format(); // Gets the selected date
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-GB', options);
        $(this).val(formattedDate); // Set the formatted date back to the input field
    });
});

function amountTotal() {
    var bm1 = Store.getTransactions();
    
    var total = 0;
    for (var i = 0; i < bm1.length; i++) {

        var amount = parseFloat(bm1[i].amount.replace(/,/g, ''));
        total += amount;
    }

    //console.log(total);
    document.querySelector('.tot-num').textContent = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


//console.log(localStorage);
amountTotal();

function calculateCurrentMonthTotal() {
    const bm2 = Store.getTransactions();
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'short' });
    const currentYear = currentDate.getFullYear();
    let currentMonthTotal = 0;

    bm2.forEach(transaction => {
        const [day, month, year] = transaction.date.split('-');
        if (month === currentMonth && parseInt(year) === currentYear) {
            currentMonthTotal += parseFloat(transaction.amount.replace(/,/g, ''));
        }
    });

    document.querySelector('.cur-mon-num').textContent = currentMonthTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


calculateCurrentMonthTotal();

function calculatePreviousMonthTotal() {
    const bm3 = Store.getTransactions();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const previousMonth = currentDate.toLocaleString('en-US', { month: 'short' });
    const previousMonthYear = currentDate.getFullYear();
    let previousMonthTotal = 0;

    bm3.forEach(transaction => {
        const [day, month, year] = transaction.date.split('-');
        if (month === previousMonth && parseInt(year) === previousMonthYear) {
            previousMonthTotal += parseFloat(transaction.amount.replace(/,/g, ''));
        }
    });

document.querySelector('.prev-mon-num').textContent = previousMonthTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

calculatePreviousMonthTotal();

function calculateCurrentYearTotal() {
    const bm4 = Store.getTransactions();
    const currentYear = new Date().getFullYear();
    let currentYearTotal = 0;

    bm4.forEach(transaction => {
        const [day, month, year] = transaction.date.split('-').map(Number);
        if (year === currentYear) {
            currentYearTotal += parseFloat(transaction.amount.replace(/,/g, ''));
        }
    });

    document.querySelector('.cur-yr-num').textContent = currentYearTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
calculateCurrentYearTotal();

function calculatePreviousYearTotal() {
    const bm5 = Store.getTransactions();
    const previousYear = new Date().getFullYear() - 1;
    let previousYearTotal = 0;

    bm5.forEach(transaction => {
        const [day, month, year] = transaction.date.split('-').map(Number);
        if (year === previousYear) {
            previousYearTotal += parseFloat(transaction.amount.replace(/,/g, ''));
        }
    });


document.querySelector('.prev-yr-num').textContent = previousYearTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
}
calculatePreviousYearTotal();

window.onload = function () {
    calculateCurrentMonthTotal();
    calculatePreviousMonthTotal();
    calculateCurrentYearTotal();
    calculatePreviousYearTotal();
};

document.addEventListener('DOMContentLoaded', function () {
    const sortSelect = document.getElementById('sortAmount');
    const tableBody = document.getElementById('book-list');


    sortSelect.addEventListener('change', function () {
        const sortValue = this.value;
        const rows = Array.from(tableBody.querySelectorAll('tr'));

        // Parse the amount from each row and store along with the row element
        const rowAmountPairs = rows.map(row => {
            const amountCell = row.querySelector('td:nth-child(3)'); 
            const amount = parseFloat(amountCell.textContent.trim()); 
            return { row, amount };
        });

        // Sort the rows based on the selected sort order
        if (sortValue === 'asc') {
            rowAmountPairs.sort((a, b) => a.amount - b.amount);
        } else if (sortValue === 'desc') {
            rowAmountPairs.sort((a, b) => b.amount - a.amount);
        }


        tableBody.innerHTML = '';
        rowAmountPairs.forEach(pair => {
            tableBody.appendChild(pair.row);
        });
    });
});

