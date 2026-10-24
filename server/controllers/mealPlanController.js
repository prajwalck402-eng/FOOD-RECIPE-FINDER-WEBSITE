const MealPlan = require('../models/MealPlan');

exports.getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find().populate('recipeId');
    res.status(200).json({ success: true, mealPlans: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch meal plan', error: error.message });
  }
};

exports.setMealPlanSlot = async (req, res) => {
  try {
    const { dayOfWeek, mealType, recipeId, customTitle, calories, notes } = req.body;

    if (!dayOfWeek || !mealType) {
      return res.status(400).json({ success: false, message: 'dayOfWeek and mealType are required' });
    }

    const updated = await MealPlan.findOneAndUpdate(
      { dayOfWeek, mealType },
      { recipeId: recipeId || null, customTitle, calories: calories || 0, notes: notes || '' },
      { upsert: true, new: true }
    ).populate('recipeId');

    res.status(200).json({ success: true, mealPlan: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update meal plan slot', error: error.message });
  }
};

exports.clearMealPlanSlot = async (req, res) => {
  try {
    const { dayOfWeek, mealType } = req.body;
    await MealPlan.findOneAndDelete({ dayOfWeek, mealType });
    res.status(200).json({ success: true, message: 'Meal slot cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear meal slot', error: error.message });
  }
};

exports.clearAllMealPlans = async (req, res) => {
  try {
    await MealPlan.deleteMany({});
    res.status(200).json({ success: true, message: 'All meal plans cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear meal plans', error: error.message });
  }
};
