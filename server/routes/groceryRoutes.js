const express = require('express');
const router = express.Router();
const groceryController = require('../controllers/groceryController');

router.get('/', groceryController.getGroceryItems);
router.post('/', groceryController.addGroceryItem);
router.post('/bulk', groceryController.addBulkIngredients);
router.patch('/:id/toggle', groceryController.toggleGroceryItem);
router.delete('/completed', groceryController.clearCompleted);
router.delete('/:id', groceryController.deleteGroceryItem);

module.exports = router;
