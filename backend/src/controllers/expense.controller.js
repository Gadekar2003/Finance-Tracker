const { expenseModel } = require("../models/expense.model");

const expenseController = {
  deleteExpense: async (req, res) => {
    try {
      const { _id } = req.body;
      await expenseModel.findByIdAndDelete(_id);
      res.send({ message: "Expense data deleted", status: true, data: null });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
  updateExpense: async (req, res) => {
    try {
      const { _id, ...payload } = req.body;
      console.log(_id, payload);

      const updatedExpense = await expenseModel.findByIdAndUpdate(
        _id,
        payload,
        {
          new: true,
        }
      );

      console.log(updatedExpense);
      res.send({
        message: "Expense Updated Successfully",
        status: true,
        data: updatedExpense,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
  getAllExpense: async (req, res) => {
    try {
      const allExpense = await expenseModel.find().sort({ createdAt: -1 }); // ascending order
      res.send({
        message: "All Expense data received",
        status: true,
        data: allExpense,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },

  createExpense: async (req, res) => {
    const { notes, amount, category, description } = req.body;
    try {
      console.log(req.body);
      const expenseData = await expenseModel.create({
        notes,
        amount,
        category,
        description,
      });
      res.send({
        message: "expense data created",
        status: true,
        data: expenseData,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
};
module.exports = expenseController;
