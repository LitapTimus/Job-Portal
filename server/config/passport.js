const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.SERVER_URL ? `${process.env.SERVER_URL}/api/auth/google/callback` : "http://localhost:5000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let existingUser = await User.findOne({ googleId: profile.id });
    
    if (existingUser) {
      return done(null, existingUser);
    }

    // Check if user exists with same email (link accounts)
    existingUser = await User.findOne({ email: profile.emails[0].value });
    
    if (existingUser) {
      // Link Google account to existing user
      existingUser.googleId = profile.id;
      existingUser.avatar = profile.photos[0].value;
      existingUser.authProvider = 'google';
      await existingUser.save();
      return done(null, existingUser);
    }

    // Create new user - we'll need to set role later
    const newUser = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
      authProvider: 'google',
      role: 'candidate' // Default role, can be changed later
    });

    done(null, newUser);
  } catch (error) {
    done(error, null);
  }
}));

module.exports = passport;
