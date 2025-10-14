const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');


const authRoutes = require('./routes/auth.route');
const postsRoutes = require('./routes/posts.route');
const uploadRoutes = require('./routes/upload.route')



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
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);


// global error fallback
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: 'Something went wrong' });
});

// Static files for images
app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use('/api/upload', uploadRoutes);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);



module.exports = app