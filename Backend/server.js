const express = require('express');
const app = express();
const transactionRoutes = require('./routes/transactionRoutes'); 
const mongoose = require('mongoose');
const cors = require('cors');
const budgetRoutes = require('./routes/Budget');

require('dotenv').config();

app.use(cors());
app.use(express.json()); 

app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('server running on port 5000'));
  })
  .catch(err => console.error(err));
