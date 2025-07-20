const express = require("express");
const incomeController = require("../controllers/income.controller");

const incomeRouter = express.Router();
incomeRouter.post("/create", incomeController.createIncome);
incomeRouter.get("/get-all", incomeController.getAllIncome);
incomeRouter.patch("/update", incomeController.updateIncome);
incomeRouter.delete("/delete", incomeController.deleteIncome);

module.exports = { incomeRouter };
