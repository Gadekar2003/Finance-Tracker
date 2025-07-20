const { budgetModel } = require("../models/budget.model");
const { expenseModel } = require("../models/expense.model");

const budgetController = {
  deleteBudget: async (req, res) => {
    try {
      const { _id } = req.body;
      await budgetModel.findByIdAndDelete(_id);
      res.send({ message: "Budget data deleted", status: true, data: null });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
  updateBudget: async (req, res) => {
    try {
      const { _id, ...payload } = req.body;
      console.log(_id, payload);

      const updatedBudget = await budgetModel.findByIdAndUpdate(_id, payload, {
        new: true,
      });
      res.send({
        message: "budget Updated Successfully",
        status: true,
        data: updatedBudget,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
  getAllBudget: async (req, res) => {
    try {
      const userId = req.headers["authentication"]; // or lowercase version

      const allBudget = await budgetModel
        .find({ userId })
        .sort({ createdAt: -1 });

      const expenseCategories = [
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Education",
        "Travel",
        "Other",
      ];

      // Calculate total expenses per category
      const expenseDataByCategory = {};

      for (let category of expenseCategories) {
        const totalExpense = await expenseModel.aggregate([
          { $match: { category } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        expenseDataByCategory[category] = totalExpense[0]?.total || 0;
      }

      // Prepare final response data with comparison
      const comparedData = allBudget.map((budget) => {
        const spent = expenseDataByCategory[budget.category] || 0;
        const remaining = budget.amount - spent;
        const overBudget = spent > budget.amount;

        return {
          _id: budget._id,
          createdAt: budget.createdAt,
          updatedAt: budget.updatedAt,
          category: budget.category,
          budgeted: budget.amount,
          spent,
          remaining,
          overBudget,
        };
      });

      res.send({
        message: "All Budget data with expenses comparison",
        status: true,
        data: comparedData,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
  createBudget: async (req, res) => {
    const { category, amount } = req.body;
    try {
      console.log(req.body);
      const budgetData = await budgetModel.create({
        amount,
        category,
      });
      res.send({
        message: "budget data created",
        status: true,
        data: budgetData,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
};
module.exports = { budgetController };
