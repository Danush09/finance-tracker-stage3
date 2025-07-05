// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // or Date
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Rent", "Utilities", "Travel", "Entertainment"],
  },
});
module.exports = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
