import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ChefHat, 
  Sparkles, 
  Clock, 
  Flame, 
  Users, 
  Image as ImageIcon 
} from 'lucide-react';
import { culinaryAudio } from '../utils/audio';

const PRESET_IMAGES = [
  { label: 'Italian Pasta / Risotto', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pan-Seared Salmon', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Indian Butter Chicken', url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mediterranean Bowl', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Japanese Delicacy', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gourmet Dessert / Breakfast', url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80' },
];

export default function AddRecipeModal({ onClose, onRecipeCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('Italian');
  const [category, setCategory] = useState('Dinner');
  const [difficulty, setDifficulty] = useState('Medium');
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(25);
  const [servings, setServings] = useState(4);
  const [calories, setCalories] = useState(450);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [chefSecret, setChefSecret] = useState('');
  const [beveragePairing, setBeveragePairing] = useState('');
  
  const [ingredients, setIngredients] = useState([
    { name: 'Fresh Garlic', amount: '4 cloves', category: 'Produce' },
    { name: 'Extra Virgin Olive Oil', amount: '2 tbsp', category: 'Spices & Oils' },
  ]);

  const [instructions, setInstructions] = useState([
    { stepNumber: 1, instruction: 'Heat olive oil in a skillet and sauté garlic until fragrant.', durationMinutes: 3, chefTip: 'Keep heat low to avoid burning.' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddIngredientRow = () => {
    culinaryAudio.playTick();
    setIngredients([...ingredients, { name: '', amount: '', category: 'Produce' }]);
  };

  const handleRemoveIngredientRow = (idx) => {
    culinaryAudio.playTick();
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleIngredientChange = (idx, field, value) => {
    const next = [...ingredients];
    next[idx][field] = value;
    setIngredients(next);
  };

  const handleAddInstructionRow = () => {
    culinaryAudio.playTick();
    setInstructions([
      ...instructions,
      { stepNumber: instructions.length + 1, instruction: '', durationMinutes: 5, chefTip: '' }
    ]);
  };

  const handleRemoveInstructionRow = (idx) => {
    culinaryAudio.playTick();
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const handleInstructionChange = (idx, field, value) => {
    const next = [...instructions];
    next[idx][field] = value;
    setInstructions(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    culinaryAudio.playStepChime();
    setIsSubmitting(true);

    try {
      const cleanIngredients = ingredients.filter(i => i.name.trim());
      const cleanInstructions = instructions.filter(i => i.instruction.trim());

      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          cuisine,
          category,
          difficulty,
          prepTime: Number(prepTime),
          cookTime: Number(cookTime),
          servings: Number(servings),
          calories: Number(calories),
          image,
          chefSecret,
          beveragePairing,
          ingredients: cleanIngredients,
          instructions: cleanInstructions,
          isFavorite: true,
          isAiGenerated: false,
        }),
      });

      const data = await res.json();
      if (data.success && data.recipe) {
        if (onRecipeCreated) onRecipeCreated(data.recipe);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create recipe:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur overflow-y-auto animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-warm-xl border border-cream-300 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-terracotta-700 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl">Create Custom Recipe</h3>
              <p className="text-xs text-amber-100 font-medium">Add your own culinary creations to your MongoDB vault</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-warmgray-800">Recipe Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grandma's Secret Tuscan Ragù"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm font-medium text-warmgray-900 focus:outline-none focus:border-terracotta-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-warmgray-800">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Appetizing summary of flavors and texture..."
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-warmgray-900 focus:outline-none focus:border-terracotta-500"
              />
            </div>
          </div>

          {/* Quick Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-warmgray-700">Cuisine</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold"
              >
                {['Italian', 'Indian', 'Mexican', 'Japanese', 'Mediterranean', 'French', 'Thai', 'Spanish', 'American'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-warmgray-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold"
              >
                {['Dinner', 'Lunch', 'Breakfast', 'Dessert', 'Snack', 'Appetizer'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-warmgray-700">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold"
              >
                {['Easy', 'Medium', 'Master Chef'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-warmgray-700">Est. Calories</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Timings & Servings */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-warmgray-700">Prep (mins)</label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-warmgray-700">Cook (mins)</label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-warmgray-700">Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Preset Image Chooser */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-warmgray-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Cover Photo Preset</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setImage(img.url)}
                  className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    image === img.url ? 'border-terracotta-600 scale-105 shadow-warm-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Ingredients Section */}
          <div className="space-y-3 pt-2 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-warmgray-900">Ingredients</label>
              <button
                type="button"
                onClick={handleAddIngredientRow}
                className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ingredient (e.g. Ricotta Cheese)"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-warmgray-900"
                  />
                  <input
                    type="text"
                    placeholder="Amount (e.g. 1 cup)"
                    value={ing.amount}
                    onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-warmgray-900"
                  />
                  <select
                    value={ing.category}
                    onChange={(e) => handleIngredientChange(idx, 'category', e.target.value)}
                    className="w-32 px-2 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy & Eggs">Dairy</option>
                    <option value="Pantry & Grains">Pantry</option>
                    <option value="Meat & Seafood">Meat/Fish</option>
                    <option value="Spices & Oils">Spices</option>
                  </select>
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredientRow(idx)}
                      className="text-warmgray-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Instructions Section */}
          <div className="space-y-3 pt-2 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-warmgray-900">Cooking Steps</label>
              <button
                type="button"
                onClick={handleAddInstructionRow}
                className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-terracotta-700">Step {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-warmgray-500 font-semibold">Timer:</span>
                      <input
                        type="number"
                        placeholder="Mins"
                        value={step.durationMinutes}
                        onChange={(e) => handleInstructionChange(idx, 'durationMinutes', Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded-lg bg-white border border-cream-300 text-xs font-semibold"
                      />
                      {instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInstructionRow(idx)}
                          className="text-warmgray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Clear instruction for this step..."
                    value={step.instruction}
                    onChange={(e) => handleInstructionChange(idx, 'instruction', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-xs font-medium"
                  />

                  <input
                    type="text"
                    placeholder="Pro Chef Tip (Optional)"
                    value={step.chefTip || ''}
                    onChange={(e) => handleInstructionChange(idx, 'chefTip', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-cream-300 text-xs font-medium text-amber-900"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-cream-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-cream-100 text-warmgray-700 text-sm font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-600 to-amber-600 text-white text-sm font-bold shadow-warm-md hover:shadow-glow-terracotta transition-all btn-push"
            >
              {isSubmitting ? 'Saving Recipe to Database...' : 'Save Recipe to Vault'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
