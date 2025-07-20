const { incomeModel } = require("../models/income.model");
const { expenseModel } = require("../models/expense.model");
const moment = require("moment");
const mongoose = require("mongoose");

const metaController = {
  getAllMetaData: async (req, res) => {
    try {
      const userId = req.headers["authentication"];

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
          status: false,
          message: "Invalid userId format",
        });
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      // 1. Monthly Income
      const incomeMonthly = await incomeModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalIncome: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            totalIncome: 1,
          },
        },
      ]);

      // 2. Monthly Expenses
      const expenseMonthly = await expenseModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalExpenses: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            totalExpenses: 1,
          },
        },
      ]);

      const monthlyDataMap = {};

      // Merge income data
      incomeMonthly.forEach((item) => {
        monthlyDataMap[item.month] = {
          month: moment()
            .month(item.month - 1)
            .format("MMM"),
          income: item.totalIncome,
          expenses: 0,
        };
      });

      // Merge expense data
      expenseMonthly.forEach((item) => {
        if (monthlyDataMap[item.month]) {
          monthlyDataMap[item.month].expenses = item.totalExpenses;
        } else {
          monthlyDataMap[item.month] = {
            month: moment()
              .month(item.month - 1)
              .format("MMM"),
            income: 0,
            expenses: item.totalExpenses,
          };
        }
      });

      const monthlyData = Object.values(monthlyDataMap).sort(
        (a, b) =>
          moment().month(a.month).month() - moment().month(b.month).month()
      );

      // 3. Category-wise Income
      const incomeCategoryTotals = await incomeModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            totalAmount: 1,
          },
        },
      ]);

      // 4. Total Income
      const totalIncomeAmountResult = await incomeModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);
      const totalIncomeAmount =
        totalIncomeAmountResult.length > 0
          ? totalIncomeAmountResult[0].totalAmount
          : 0;

      // 5. Category-wise Expense
      const expenseCategoryTotals = await expenseModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            totalAmount: 1,
          },
        },
      ]);

      // 6. Total Expenses
      const totalExpenseAmountResult = await expenseModel.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);
      const totalExpenseAmount =
        totalExpenseAmountResult.length > 0
          ? totalExpenseAmountResult[0].totalAmount
          : 0;

      res.status(200).send({
        status: true,
        message: "Category-wise totals and total amounts fetched successfully",
        data: {
          monthlyData,
          income: {
            total: totalIncomeAmount,
            categoryTotals: incomeCategoryTotals,
          },
          expense: {
            total: totalExpenseAmount,
            categoryTotals: expenseCategoryTotals,
          },
        },
      });
    } catch (error) {
      console.error("Error in getAllMetaData:", error);
      res.status(500).send({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
};

module.exports = { metaController };
