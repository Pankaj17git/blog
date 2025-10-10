// controllers/authController.js
const { validationResult } = require('express-validator');
const User = require('../models/User.model');

exports.register = async (req, res) => {
  // express-validator results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  try {
    // check duplicates
    let existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      if (existing.email === email) return res.status(409).json({ message: 'Email already registered' });
      return res.status(409).json({ message: 'Username already taken' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = user.generateJWT();
    // return user safe object
    const userObj = user.toJSON();
    return res.status(201).json({ user: userObj, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { emailOrUsername, password } = req.body;
  try {
    // allow login by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }]
    }).select('+password');

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = user.generateJWT();
    const userObj = user.toJSON();
    return res.json({ user: userObj, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  // req.user set by auth middleware
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['username', 'bio', 'avatarUrl'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });
    // if user tries to change role or isVerified etc, ignore
    await req.user.save();
    res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to update profile' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await req.user.remove();
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to delete account' });
  }
};
