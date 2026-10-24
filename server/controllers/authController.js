const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { getJwtSecret } = require('../config/jwt');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, preferredLanguage = 'en', dietaryPreferences = [], avatar = '👨‍🍳' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar,
      preferredLanguage: ['en', 'hi', 'kn', 'te'].includes(preferredLanguage) ? preferredLanguage : 'en',
      dietaryPreferences: Array.isArray(dietaryPreferences) ? dietaryPreferences : [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to SavoryAI.',
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user profile
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving profile',
    });
  }
};

// @route   PUT /api/auth/preferences
// @desc    Update user preferred language, dietary tags, name, avatar
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const { preferredLanguage, dietaryPreferences, name, avatar } = req.body;

    const fieldsToUpdate = {};
    if (preferredLanguage && ['en', 'hi', 'kn', 'te'].includes(preferredLanguage)) {
      fieldsToUpdate.preferredLanguage = preferredLanguage;
    }
    if (Array.isArray(dietaryPreferences)) {
      fieldsToUpdate.dietaryPreferences = dietaryPreferences;
    }
    if (name) {
      fieldsToUpdate.name = name.trim();
    }
    if (avatar) {
      fieldsToUpdate.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating preferences',
    });
  }
};

// @route   POST /api/auth/favorites/toggle
// @desc    Toggle a recipe ID in user favorites
// @access  Private
exports.toggleUserFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      return res.status(400).json({ success: false, message: 'Recipe ID required' });
    }

    const user = await User.findById(req.user._id);
    const index = user.favorites.indexOf(recipeId);
    let isFavorite = false;

    if (index > -1) {
      user.favorites.splice(index, 1);
      isFavorite = false;
    } else {
      user.favorites.push(recipeId);
      isFavorite = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      isFavorite,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error toggling favorite',
    });
  }
};
