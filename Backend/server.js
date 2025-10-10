// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.route');

const app = express();

// middlewares
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// rate limiter (optional)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});
app.use(limiter);

// routes
app.use('/api/auth', authRoutes);

// health
app.get('/health', (req, res) => res.send('OK'));

// global error fallback
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Mongo connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}
start();
