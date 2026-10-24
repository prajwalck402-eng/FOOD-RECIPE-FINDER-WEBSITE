const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate', aiController.generateRecipe);
router.post('/chat', aiController.chatWithChef);
router.post('/substitute', aiController.getIngredientSubstitution);
router.post('/meal-plan', aiController.generateMealPlan);
router.post('/voice-narrate', aiController.voiceNarrate);
router.post('/translate-recipe', aiController.translateRecipe);

module.exports = router;

