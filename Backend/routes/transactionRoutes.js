const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new transaction
router.post('/', async (req, res) => {
  try {
    const { amount, date, description } = req.body;
    const transaction = new Transaction({ amount, date, description });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { amount, date, description } = req.body;
    const updated = await Transaction.findByIdAndUpdate(req.params.id, { amount, date, description }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
