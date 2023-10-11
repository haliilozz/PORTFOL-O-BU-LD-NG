"use strict";
//? selector
const addForm = document.getElementById("add-form");
const incomeInput = document.getElementById("income-input");
const addBtn = document.getElementById("add-btn");
//?result table
const yourIncomeTd = document.getElementById("your-income");
const yourExpenseTd = document.getElementById("your-expense");
const restTd = document.getElementById("rest");

//?expense form
const expenseForm = document.getElementById("expense-form");
const expenseAreaInput = document.getElementById("expense-area");
const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");

//?expense table
const expenseBody = document.getElementById("expense-body");
const cleanBtn = document.getElementById("clean-btn");
//?variables
let incomes = "";
let expenseList = [];
//?events
addForm.addEventListener("submit", (e) => {
  incomes = Number(incomes) + Number(incomeInput.value);
  e.preventDefault();
  addForm.reset();
  localStorage.setItem("incomes", incomes);
  calculateAndUpdate();
});

window.addEventListener("load", () => {
  incomes = Number(localStorage.getItem("incomes"));

  expenseList = JSON.parse(localStorage.getItem("expenses")) || [];
  expenseList.forEach((expense) => writeExpensesToDOM(expense));
  console.log(expenseList);

  dateInput.valueAsDate = new Date();
  calculateAndUpdate();
});

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    date: dateInput.value,
    area: expenseAreaInput.value,
    amount: amountInput.value,
  };

  expenseList.push(newExpense);

  localStorage.setItem("expenses", JSON.stringify(expenseList));
  writeExpensesToDOM(newExpense);
  calculateAndUpdate();
  expenseForm.reset();
  dateInput.valueAsDate = new Date();
  console.log(newExpense);
});

//?function
const calculateAndUpdate = () => {
  const expenses = expenseList.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  yourIncomeTd.innerText = incomes;
  yourExpenseTd.innerText = expenses;
  restTd.innerText = incomes - expenses;
};
const writeExpensesToDOM = ({ id, amount, date, area }) => {
  expenseBody.innerHTML += `
<tr>
    <td class="col col-1">${date}</td>
    <td class="col col-2">${area}</td>
    <td class="col col-3">${amount}</td>
    <td class="col col-4" ><i id=${id} class="fa-solid fa-trash-can"></i></td>
</tr>
`;
};

expenseBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    e.target.parentElement.parentElement.remove();
    const id = e.target.id;
    console.log(id);

    expenseList = expenseList.filter((expense) => expense.id != id);
    console.log(expenseList);

    localStorage.setItem("expense", JSON.stringify(expenseList));
  }
  calculateAndUpdate();
});

cleanBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete?")) {
    expenseList = [];
    incomes = 0;
    localStorage.clear();
    expenseBody.innerHTML = "";
    calculateAndUpdate();
  }
});
