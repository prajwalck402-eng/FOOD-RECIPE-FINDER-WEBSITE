const mongoose = require('mongoose');

const GroceryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Produce', 'Dairy & Eggs', 'Pantry & Grains', 'Meat & Seafood', 'Spices & Oils', 'Bakery', 'Other'],
    default: 'Produce',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  recipeSource: {
    type: String,
    default: 'Manual Entry',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('GroceryItem', GroceryItemSchema);
