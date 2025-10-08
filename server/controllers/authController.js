const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'Email exists' });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, passwordHash, role });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(201).json({ token, user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid creds' });
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid creds' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
};

// Google OAuth Success
exports.googleSuccess = async (req, res) => {
  if (req.user) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    
    // Check if user needs to complete role selection
    if (!req.user.role || req.user.role === 'candidate') {
      // Redirect to role selection page with token
      res.redirect(`${process.env.CLIENT_URL}/role-selection?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    } else {
      // Redirect to dashboard with token
      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    }
  } else {
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

// Google OAuth Failure
exports.googleFailure = (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
};

// Update user role after Google OAuth
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;
    
    if (!['candidate', 'recruiter'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { role }, 
      { new: true }
    );
    
    res.json({ user, msg: 'Role updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
