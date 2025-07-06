const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets for a given month
router.get('/', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Query param 'month' is required in format YYYY-MM" });
  }

  try {
    const budgets = await Budget.find({ month });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update a budget entry
router.post('/', async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({ error: "All fields (category, amount, month) are required." });
    }

    const existing = await Budget.findOne({ category, month });

    let budget;
    if (existing) {
      existing.amount = amount;
      budget = await existing.save();
    } else {
      budget = new Budget({ category, amount, month });
      await budget.save();
    }

    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
