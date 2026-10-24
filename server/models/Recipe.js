const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  cuisine: {
    type: String,
    default: 'Global',
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Appetizer'],
    default: 'Dinner',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Master Chef'],
    default: 'Medium',
  },
  prepTime: {
    type: Number,
    default: 15,
  },
  cookTime: {
    type: Number,
    default: 25,
  },
  servings: {
    type: Number,
    default: 4,
  },
  calories: {
    type: Number,
    default: 450,
  },
  macros: {
    protein: { type: Number, default: 25 },
    carbs: { type: Number, default: 40 },
    fat: { type: Number, default: 15 },
    fiber: { type: Number, default: 6 },
  },
  dietaryTags: [{
    type: String,
  }],
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Produce', 'Dairy & Eggs', 'Pantry & Grains', 'Meat & Seafood', 'Spices & Oils', 'Bakery', 'Other'],
      default: 'Produce',
    },
  }],
  instructions: [{
    stepNumber: { type: Number, required: true },
    instruction: { type: String, required: true },
    durationMinutes: { type: Number, default: 0 },
    chefTip: { type: String, default: '' },
  }],
  chefSecret: {
    type: String,
    default: '',
  },
  beveragePairing: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isAiGenerated: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 12,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Recipe', RecipeSchema);
