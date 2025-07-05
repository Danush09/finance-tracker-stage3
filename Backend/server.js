const express = require('express');
const app = express();
const transactionRoutes = require('./routes/transactionRoutes'); // adjust path if needed
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json()); // ← ✅ Important: register this BEFORE routes

// ✅ ROUTES
app.use('/api/transactions', transactionRoutes);

// ✅ CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('server running on port 5000'));
  })
  .catch(err => console.error(err));
