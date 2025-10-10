// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authCtrl = require('../controllers/authController.controller');
const { authenticate } = require('../middleware/auth');

// Register
router.post('/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 }).withMessage('Username 3-30 chars')
      .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Username can contain letters, numbers, - and _'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
      .matches(/\d/).withMessage('Password must contain a number')
      // optionally: .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a special character')
  ],
  authCtrl.register
);

// Login
router.post('/login',
  [
    body('emailOrUsername').notEmpty().withMessage('Email or username required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  authCtrl.login
);

// Protected routes
router.get('/me', authenticate, authCtrl.getProfile);
router.put('/me', authenticate, authCtrl.updateProfile);
router.delete('/me', authenticate, authCtrl.deleteAccount);

module.exports = router;
