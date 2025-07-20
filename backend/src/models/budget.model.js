const mongoose = require("mongoose");
const budgetSchema = new mongoose.Schema({
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
});
const budgetModel = mongoose.model("Budget", budgetSchema);
module.exports = { budgetModel };
