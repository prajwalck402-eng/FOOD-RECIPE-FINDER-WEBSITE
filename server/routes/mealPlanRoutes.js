const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');

router.get('/', mealPlanController.getMealPlans);
router.post('/slot', mealPlanController.setMealPlanSlot);
router.post('/slot/clear', mealPlanController.clearMealPlanSlot);
router.delete('/all', mealPlanController.clearAllMealPlans);

module.exports = router;
