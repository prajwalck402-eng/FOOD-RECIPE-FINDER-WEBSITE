import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  Flame, 
  Utensils, 
  Check, 
  ChevronRight,
  RefreshCw,
  ShoppingCart
} from 'lucide-react';
import { culinaryAudio } from '../utils/audio';
import { t } from '../utils/i18n';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function MealPlanner({
  mealPlans = [],
  recipes = [],
  onSetMealPlanSlot,
  onClearMealPlanSlot,
  onClearAllMealPlans,
  onSelectRecipe,
  onAddBulkGroceries,
  currentLanguage = 'en',
}) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [dietaryGoal, setDietaryGoal] = useState('Balanced');
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [editingSlot, setEditingSlot] = useState(null); // { day, mealType }
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customCalories, setCustomCalories] = useState(400);

  // Generate 7-Day AI Meal Plan with Groq
  const handleGenerateAiPlan = async () => {
    culinaryAudio.playStepChime();
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietary: dietaryGoal,
          caloriesPerDay: calorieGoal,
        }),
      });
      const data = await res.json();
      if (data.success && data.plan?.weekPlan) {
        // Save each generated meal slot
        for (const dayObj of data.plan.weekPlan) {
          for (const meal of dayObj.meals) {
            await onSetMealPlanSlot({
              dayOfWeek: dayObj.day,
              mealType: meal.type,
              customTitle: meal.title,
              calories: meal.calories,
              notes: meal.description,
            });
          }
        }
        culinaryAudio.playStepChime();
      }
    } catch (err) {
      console.error('Error generating AI meal plan:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();
    if (!editingSlot) return;
    culinaryAudio.playTick();

    const chosenRecipe = recipes.find(r => r._id === selectedRecipeId);

    onSetMealPlanSlot({
      dayOfWeek: editingSlot.day,
      mealType: editingSlot.mealType,
      recipeId: chosenRecipe ? chosenRecipe._id : null,
      customTitle: chosenRecipe ? chosenRecipe.title : customTitle,
      calories: chosenRecipe ? chosenRecipe.calories : Number(customCalories),
    });

    setEditingSlot(null);
    setSelectedRecipeId('');
    setCustomTitle('');
  };

  const getSlotData = (day, type) => {
    return mealPlans.find(p => p.dayOfWeek === day && p.mealType === type);
  };

  const calculateDayCalories = (day) => {
    return mealPlans
      .filter(p => p.dayOfWeek === day)
      .reduce((sum, p) => sum + (p.calories || (p.recipeId?.calories) || 0), 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header & AI Action Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-warm-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('plannerTitle', currentLanguage)}</span>
          </div>
          <h2 className="font-serif font-bold text-3xl text-warmgray-900">
            {t('navPlanner', currentLanguage)}
          </h2>
          <p className="text-xs sm:text-sm text-warmgray-600 font-medium max-w-xl">
            {t('plannerSubtitle', currentLanguage)}
          </p>
        </div>

        {/* AI Plan Generation Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-white/90 p-3.5 rounded-2xl border border-cream-200 shadow-xs">
          <div>
            <label className="block text-[10px] uppercase font-bold text-warmgray-500">Diet</label>
            <select
              value={dietaryGoal}
              onChange={(e) => setDietaryGoal(e.target.value)}
              className="text-xs font-bold text-warmgray-800 bg-transparent focus:outline-none"
            >
              <option value="Balanced">Balanced Gourmet</option>
              <option value="High-Protein">High-Protein Fitness</option>
              <option value="Keto">Keto Low-Carb</option>
              <option value="Vegetarian">Vegetarian Delight</option>
              <option value="Mediterranean">Mediterranean Heart</option>
            </select>
          </div>

          <div className="border-l border-cream-200 pl-3">
            <label className="block text-[10px] uppercase font-bold text-warmgray-500">Target Cal/Day</label>
            <input
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(Number(e.target.value))}
              step="100"
              min="1200"
              max="4000"
              className="w-20 text-xs font-bold text-warmgray-800 bg-transparent focus:outline-none"
            />
          </div>

          <button
            type="button"
            disabled={isAiLoading}
            onClick={handleGenerateAiPlan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-terracotta-600 to-amber-600 text-white text-xs font-bold shadow-warm-md hover:shadow-glow-terracotta transition-all btn-push"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
            <span>{isAiLoading ? t('plannerGenerating', currentLanguage) : t('plannerGenerateWeek', currentLanguage)}</span>
          </button>
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS.map((day) => {
          const dayCalories = calculateDayCalories(day);

          return (
            <div
              key={day}
              className="bg-white rounded-3xl border border-cream-200 shadow-warm-sm p-4 flex flex-col justify-between space-y-4"
            >
              {/* Day Header */}
              <div className="pb-2 border-b border-cream-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-warmgray-900">
                    {day}
                  </h4>
                  <div className="text-[11px] font-bold text-terracotta-700 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-terracotta-500" />
                    <span>{dayCalories} kcal</span>
                  </div>
                </div>
              </div>

              {/* Meal Slots */}
              <div className="space-y-2 flex-1">
                {MEAL_TYPES.map((type) => {
                  const slot = getSlotData(day, type);
                  const title = slot?.recipeId?.title || slot?.customTitle;
                  const cals = slot?.recipeId?.calories || slot?.calories;

                  return (
                    <div
                      key={type}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        title
                          ? 'bg-cream-50 border-cream-200 hover:border-terracotta-300'
                          : 'bg-cream-50/40 border-dashed border-cream-300 hover:bg-cream-50 hover:border-terracotta-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-warmgray-400 mb-1">
                        <span>{type}</span>
                        {slot && (
                          <button
                            type="button"
                            onClick={() => {
                              culinaryAudio.playTick();
                              onClearMealPlanSlot(day, type);
                            }}
                            className="text-warmgray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {title ? (
                        <div
                          onClick={() => {
                            if (slot?.recipeId) {
                              onSelectRecipe(slot.recipeId);
                            }
                          }}
                          className="space-y-0.5 cursor-pointer group"
                        >
                          <p className="text-xs font-bold text-warmgray-900 group-hover:text-terracotta-600 line-clamp-1">
                            {title}
                          </p>
                          {cals > 0 && (
                            <span className="text-[10px] text-terracotta-600 font-semibold">
                              {cals} kcal
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            culinaryAudio.playTick();
                            setEditingSlot({ day, mealType: type });
                          }}
                          className="w-full py-1 text-center text-xs font-semibold text-terracotta-600 hover:text-terracotta-800 flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Assign</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-blur animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-warm-xl border border-cream-300 p-6 max-w-md w-full space-y-5">
            
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-warmgray-900">
                  Assign {editingSlot.mealType}
                </h3>
                <p className="text-xs text-warmgray-500 font-semibold">{editingSlot.day}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSlot(null)}
                className="p-1 rounded-lg text-warmgray-400 hover:text-warmgray-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4">
              
              {/* Option 1: Pick from Saved Recipes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-warmgray-700">
                  Select from Recipe Vault
                </label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => {
                    setSelectedRecipeId(e.target.value);
                    if (e.target.value) setCustomTitle('');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold text-warmgray-900 focus:outline-none focus:border-terracotta-500"
                >
                  <option value="">-- Choose a Recipe --</option>
                  {recipes.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.title} ({r.calories} kcal)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center text-xs text-warmgray-400 font-bold uppercase">
                — OR CUSTOM ENTRY —
              </div>

              {/* Option 2: Custom Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-warmgray-700">Custom Meal Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => {
                    setCustomTitle(e.target.value);
                    if (e.target.value) setSelectedRecipeId('');
                  }}
                  placeholder="e.g. Avocado Sourdough Toast & Poached Egg"
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-warmgray-900 focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-warmgray-700">Est. Calories</label>
                <input
                  type="number"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(Number(e.target.value))}
                  step="50"
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-medium text-warmgray-900 focus:outline-none focus:border-terracotta-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="flex-1 py-2.5 rounded-xl bg-cream-100 text-warmgray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-terracotta-600 text-white text-xs font-bold shadow-warm-sm hover:bg-terracotta-700 transition-all"
                >
                  Save Slot
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
