const mongoose = require("mongoose");
const incomeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },

    source: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Rental",
        "Other",
      ],
    },
    amount: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);
const incomeModel = mongoose.model("Income", incomeSchema);
module.exports = { incomeModel };
