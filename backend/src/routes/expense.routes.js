const express = require("express");
const expenseController = require("../controllers/expense.controller");

const expenseRouter = express.Router();
expenseRouter.post("/create", expenseController.createExpense);
expenseRouter.get("/get-all", expenseController.getAllExpense);
expenseRouter.patch("/update", expenseController.updateExpense);
expenseRouter.delete("/delete", expenseController.deleteExpense);

module.exports = { expenseRouter };
