const GroceryItem = require('../models/GroceryItem');

exports.getGroceryItems = async (req, res) => {
  try {
    const items = await GroceryItem.find().sort({ category: 1, createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch grocery items', error: error.message });
  }
};

exports.addGroceryItem = async (req, res) => {
  try {
    const { name, amount, category, recipeSource } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Item name is required' });
    }
    const item = new GroceryItem({ name, amount, category, recipeSource });
    const saved = await item.save();
    res.status(201).json({ success: true, item: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to add grocery item', error: error.message });
  }
};

exports.addBulkIngredients = async (req, res) => {
  try {
    const { ingredients = [], recipeTitle = 'Recipe Import' } = req.body;
    if (!ingredients.length) {
      return res.status(400).json({ success: false, message: 'No ingredients provided' });
    }

    const itemsToInsert = ingredients.map(ing => ({
      name: ing.name || ing,
      amount: ing.amount || '',
      category: ing.category || 'Produce',
      recipeSource: recipeTitle,
      isCompleted: false,
    }));

    const inserted = await GroceryItem.insertMany(itemsToInsert);
    res.status(201).json({ success: true, count: inserted.length, items: inserted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to bulk import ingredients', error: error.message });
  }
};

exports.toggleGroceryItem = async (req, res) => {
  try {
    const item = await GroceryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    item.isCompleted = !item.isCompleted;
    await item.save();
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle item', error: error.message });
  }
};

exports.deleteGroceryItem = async (req, res) => {
  try {
    await GroceryItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete item', error: error.message });
  }
};

exports.clearCompleted = async (req, res) => {
  try {
    const result = await GroceryItem.deleteMany({ isCompleted: true });
    res.status(200).json({ success: true, message: `Removed ${result.deletedCount} completed items` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear completed items', error: error.message });
  }
};
