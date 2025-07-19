const { incomeModel } = require("../models/income.model");

const incomeController = {
  deleteIncome: async (req, res) => {
    try {
      const { _id } = req.body;
      await incomeModel.findByIdAndDelete(_id);
      res.send({ message: "Income data deleted", status: true, data: null });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
  updateIncome: async (req, res) => {
    try {
      const { _id, ...payload } = req.body;
      console.log(_id, payload);

      const updatedIncome = await incomeModel.findByIdAndUpdate(_id, payload, {
        new: true,
      });

      console.log(updatedIncome);
      res.send({
        message: "Income Updated Successfully",
        status: true,
        data: updatedIncome,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
  getAllIncome: async (req, res) => {
    try {
      const allIncome = await incomeModel.find().sort({ createdAt: -1 }); // ascending order
      res.send({
        message: "All Income data received",
        status: true,
        data: allIncome,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },

  createIncome: async (req, res) => {
    const { source, amount, category, description } = req.body;
    try {
      console.log(req.body);
      const incomeData = await incomeModel.create({
        source,
        amount,
        category,
        description,
      });
      res.send({
        message: "income data created",
        status: true,
        data: incomeData,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || "Internal server error",
        status: false,
      });
    }
  },
};
module.exports = incomeController;
