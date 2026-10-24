const Recipe = require('../models/Recipe');
const starterRecipes = require('../data/starterRecipes');

// Initialize database with starter recipes if empty or reseed
exports.seedRecipesIfEmpty = async () => {
  try {
    const count = await Recipe.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding authentic local Indian & gourmet recipes into MongoDB...');
      await Recipe.insertMany(starterRecipes);
      console.log('✅ Successfully seeded starter recipes!');
    }
  } catch (error) {
    console.error('Error seeding recipes:', error.message);
  }
};

exports.reseedAllRecipes = async (req, res) => {
  try {
    await Recipe.deleteMany({ isAiGenerated: false });
    await Recipe.insertMany(starterRecipes);
    const count = await Recipe.countDocuments();
    res.status(200).json({
      success: true,
      message: `Successfully seeded ${starterRecipes.length} local Indian and gourmet recipes into MongoDB!`,
      totalCount: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const {
      search,
      cuisine,
      category,
      difficulty,
      dietary,
      maxTime,
      favoritesOnly,
      sort = 'newest'
    } = req.query;

    const query = {};

    if (search && search.trim()) {
      const cleanSearch = search.trim();
      
      // If query is short (1-2 chars), match title or ingredient start
      if (cleanSearch.length <= 2) {
        query.$or = [
          { title: { $regex: cleanSearch, $options: 'i' } },
          { cuisine: { $regex: cleanSearch, $options: 'i' } },
        ];
      } else {
        // Multi-letter query: Match title, cuisine, or specific ingredient name
        query.$or = [
          { title: { $regex: cleanSearch, $options: 'i' } },
          { cuisine: { $regex: cleanSearch, $options: 'i' } },
          { 'ingredients.name': { $regex: cleanSearch, $options: 'i' } },
          { dietaryTags: { $regex: cleanSearch, $options: 'i' } },
        ];
      }
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisine = cuisine;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (dietary && dietary !== 'All') {
      query.dietaryTags = { $in: [dietary] };
    }

    if (maxTime) {
      query.$expr = {
        $lte: [{ $add: ['$prepTime', '$cookTime'] }, Number(maxTime)]
      };
    }

    if (favoritesOnly === 'true') {
      query.isFavorite = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'quickest') sortOption = { cookTime: 1 };
    if (sort === 'calories') sortOption = { calories: 1 };

    const recipes = await Recipe.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes: ' + error.message,
    });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.status(200).json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const saved = await newRecipe.save();
    res.status(201).json({ success: true, recipe: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.status(200).json({ success: true, recipe: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();
    res.status(200).json({ success: true, isFavorite: recipe.isFavorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.status(200).json({ success: true, message: 'Recipe removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
