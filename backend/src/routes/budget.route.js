const express = require("express");
const { budgetController } = require("../controllers/budget.controller");

const budgetRouter = express.Router();
budgetRouter.post("/create", budgetController.createBudget);
budgetRouter.get("/get-all", budgetController.getAllBudget);
budgetRouter.patch("/update", budgetController.updateBudget);
budgetRouter.delete("/delete", budgetController.deleteBudget);

module.exports = { budgetRouter };
