const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },

    notes: { type: String },
    category: {
      type: String,
      required: true,
      enum: [
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Education",
        "Travel",
        "Other",
      ],
    },
    amount: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);
const expenseModel = mongoose.model("Expense", expenseSchema);
module.exports = { expenseModel };
