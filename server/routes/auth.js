const express = require('express');
const router = express.Router();
const passport = require('passport');
const { signup, login, googleSuccess, googleFailure, updateRole } = require('../controllers/authController');
const auth = require('../middlewares/auth');

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// Google OAuth routes
// GET /api/auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// GET /api/auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/auth/google/failure' }),
  googleSuccess
);

// GET /api/auth/google/failure
router.get('/google/failure', googleFailure);

// POST /api/auth/update-role (for OAuth users to set their role)
router.post('/update-role', auth, updateRole);

// GET /api/auth/status - Check OAuth configuration
router.get('/status', (req, res) => {
  const oauthConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  res.json({
    oauth: {
      google: {
        configured: oauthConfigured,
        clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing'
      }
    },
    session: {
      secret: process.env.SESSION_SECRET ? 'Set' : 'Missing'
    }
  });
});

module.exports = router;
