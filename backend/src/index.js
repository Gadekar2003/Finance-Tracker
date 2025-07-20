const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { authRouter } = require("./routes/auth.route");
const cors = require("cors");
const { incomeRouter } = require("./routes/income.route");
const { expenseRouter } = require("./routes/expense.routes");
const { budgetRouter } = require("./routes/budget.route");
const { metaRouter } = require("./routes/meta.route");

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});
app.use("/auth", authRouter);
app.use("/income", incomeRouter);
app.use("/expenses", expenseRouter);
app.use("/budget", budgetRouter);
app.use("/metadata", metaRouter);
// MongoDB connection (clean, no deprecated options)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
