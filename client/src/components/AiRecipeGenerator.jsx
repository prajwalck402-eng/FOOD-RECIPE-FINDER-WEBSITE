import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 

  Plus, 
  X, 
  Clock, 
  Flame, 
  ChefHat, 
  Utensils, 
  Heart, 
  ShoppingCart, 
  Play, 
  BookmarkCheck, 
  RotateCcw,
  CheckCircle2,
  Wine,
  Lightbulb,
  Award,
  Zap,
  Globe,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { culinaryAudio } from '../utils/audio';
import { aiVoiceEngine, VOICE_LANGUAGES } from '../utils/aiVoiceEngine';
import { t, LANGUAGES } from '../utils/i18n';


const QUICK_PANTRY_PRESETS = [
  'Brinjal (Eggplant)', 'Paneer', 'Chicken', 'Basmati Rice', 'Toor Dal',
  'Garlic', 'Tomatoes', 'Curry Leaves', 'Ghee', 'Peanuts',
  'Sesame Seeds', 'Tamarind', 'Jaggery', 'Kasuri Methi', 'Ginger',
  'Spinach', 'Mushrooms', 'Salmon', 'Yogurt / Dahi', 'Onions'
];

const INDIAN_REGIONAL_CRAVINGS = [
  { label: "ಬದನೆಕಾಯಿ ಎಣ್ಣೆಗಾಯಿ (Ennegayi)", query: "North Karnataka Ennegayi Stuffed Brinjal Curry", cuisine: "South Indian" },
  { label: "ಗುత్తి వంకాయ (Gutti Vankaya)", query: "Andhra Gutti Vankaya Koora", cuisine: "South Indian" },
  { label: "Hyderabadi Biryani (దమ్ బిర్యానీ)", query: "Hyderabadi Dum Biryani", cuisine: "South Indian" },
  { label: "Bisi Bele Bath (ಬಿಸಿಬೇಳೆ ಬಾತ್)", query: "Karnataka Bisi Bele Bath with Ghee Cashews", cuisine: "South Indian" },
  { label: "Mysore Masala Dosa (ದೋಸೆ)", query: "Crispy Mysore Masala Dosa with Red Chutney", cuisine: "South Indian" },
  { label: "मुर्ग मखनी (Butter Chicken)", query: "Authentic Murgh Makhani Butter Chicken", cuisine: "North Indian" },
  { label: "दाल मखनी (Dal Makhani)", query: "Slow Simmered Dhaba Dal Makhani", cuisine: "North Indian" },
  { label: "Pesarattu (పెసరట్టు & అల్లం)", query: "Andhra Pesarattu with Allam Pachadi", cuisine: "South Indian" },
  { label: "समोसा चाट (Samosa Chaat)", query: "Dilli Samosa Chaat with Chole & Chutneys", cuisine: "North Indian" },
  { label: "Mangalore Ghee Roast", query: "Mangalorean Ghee Roast Paneer / Chicken", cuisine: "South Indian" }
];

const CUISINES = ['Any', 'South Indian', 'North Indian', 'Indian', 'Italian', 'Mexican', 'Japanese', 'Mediterranean', 'French', 'Thai', 'Spanish', 'American'];
const CATEGORIES = ['Dinner', 'Lunch', 'Breakfast', 'Dessert', 'Snack', 'Appetizer'];
const DIETARY_OPTIONS = ['High-Protein', 'Keto', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Carb', 'Dairy-Free'];
const SKILL_LEVELS = ['Easy', 'Medium', 'Master Chef'];

export default function AiRecipeGenerator({
  onRecipeSaved,
  onStartCooking,
  onAddBulkGroceries,
  onOpenVoicePlayer,
  currentLanguage = 'en',
}) {
  const [selectedAiLanguage, setSelectedAiLanguage] = useState(currentLanguage);
  const [ingredients, setIngredients] = useState(['Brinjal (Eggplant)', 'Peanuts', 'Garlic', 'Tamarind']);
  const [customInput, setCustomInput] = useState('');
  const [cuisine, setCuisine] = useState('South Indian');
  const [category, setCategory] = useState('Dinner');
  const [dietary, setDietary] = useState(['Vegetarian']);
  const [maxTime, setMaxTime] = useState(30);
  const [difficulty, setDifficulty] = useState('Medium');
  const [craving, setCraving] = useState('');
  const [servings, setServings] = useState(4);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDictatingIngredient, setIsDictatingIngredient] = useState(false);
  const [isDictatingCraving, setIsDictatingCraving] = useState(false);

  useEffect(() => {
    setSelectedAiLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleDictateIngredient = async () => {
    culinaryAudio.playTick();
    setIsDictatingIngredient(true);
    try {
      const text = await aiVoiceEngine.dictate(selectedAiLanguage);
      if (text && text.trim()) {
        const parts = text.split(/,| and | ಮತ್ತು | మరియు | और /i);
        parts.forEach(p => {
          if (p.trim()) handleAddIngredient(p.trim());
        });
      }
    } catch (e) {
      console.warn('Voice dictation failed:', e);
    } finally {
      setIsDictatingIngredient(false);
    }
  };

  const handleDictateCraving = async () => {
    culinaryAudio.playTick();
    setIsDictatingCraving(true);
    try {
      const text = await aiVoiceEngine.dictate(selectedAiLanguage);
      if (text && text.trim()) {
        setCraving(text.trim());
      }
    } catch (e) {
      console.warn('Voice dictation failed:', e);
    } finally {
      setIsDictatingCraving(false);
    }
  };

  // Add ingredient
  const handleAddIngredient = (item) => {
    culinaryAudio.playTick();
    const clean = item.trim();
    if (clean && !ingredients.some(i => i.toLowerCase() === clean.toLowerCase())) {
      setIngredients([...ingredients, clean]);
    }
  };


  const handleRemoveIngredient = (index) => {
    culinaryAudio.playTick();
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (customInput.trim()) {
        handleAddIngredient(customInput.trim());
        setCustomInput('');
      }
    }
  };

  const toggleDietary = (item) => {
    culinaryAudio.playTick();
    if (dietary.includes(item)) {
      setDietary(dietary.filter(d => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const handleApplyCraving = (item) => {
    culinaryAudio.playTick();
    setCraving(item.query);
    if (item.cuisine) setCuisine(item.cuisine);
  };

  // Generate recipe via Groq backend API
  const handleGenerate = async () => {
    if (ingredients.length === 0 && !craving.trim()) {
      setError('Please add ingredients or enter a dish/craving name.');
      return;
    }

    culinaryAudio.playStepChime();
    setIsLoading(true);
    setError(null);
    setGeneratedRecipe(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          cuisine,
          category,
          dietary,
          maxTime,
          difficulty,
          craving,
          dishName: craving,
          servings,
          language: selectedAiLanguage,
        }),
      });

      const data = await response.json();
      if (data.success && data.recipe) {
        setGeneratedRecipe(data.recipe);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#E25C34', '#F5B718', '#5F805B', '#FFFFFF'],
        });
      } else {
        setError(data.message || 'Failed to craft recipe with AI');
      }
    } catch (err) {
      setError('Error communicating with AI server: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save AI recipe to MongoDB database
  const handleSaveToVault = async () => {
    if (!generatedRecipe || isSaved) return;
    setSaveLoading(true);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedRecipe,
          isFavorite: true,
          isAiGenerated: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        culinaryAudio.playStepChime();
        if (onRecipeSaved) onRecipeSaved(data.recipe);
      }
    } catch (err) {
      console.error('Failed to save recipe:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Bulk add to groceries
  const handleAddToGrocery = () => {
    if (!generatedRecipe?.ingredients) return;
    culinaryAudio.playStepChime();
    if (onAddBulkGroceries) {
      onAddBulkGroceries(generatedRecipe.ingredients, generatedRecipe.title);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Groq LLaMA • {t('liveAiActive', currentLanguage)}
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-warmgray-900">
          {t('genTitle', currentLanguage)}
        </h2>
        <p className="text-sm sm:text-base text-warmgray-600 max-w-xl mx-auto font-medium">
          {t('genSubtitle', currentLanguage)}
        </p>

        {/* Dedicated AI Generation Language Selector Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-cream-300 shadow-warm-sm mt-3">
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-warmgray-600">
            <Globe className="w-4 h-4 text-terracotta-600" />
            <span>AI Recipe Language / भाषा / ಭಾಷೆ / భాష:</span>
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                culinaryAudio.playTick();
                setSelectedAiLanguage(lang.code);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all btn-push ${
                selectedAiLanguage === lang.code
                  ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white shadow-warm-sm scale-105'
                  : 'bg-cream-100/80 text-warmgray-700 hover:bg-cream-200/80 border border-cream-200'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
              <span className="text-[10px] opacity-75">({lang.name})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Indian Local Regional Cravings Carousel / Quick Tap Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-amber-200/80 shadow-warm-sm space-y-2.5 bg-gradient-to-r from-amber-50/70 via-cream-50 to-orange-50/70">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-terracotta-600" />
            <span>Famous Indian Local Dishes (1-Click Instant AI Formulation):</span>
          </span>
          <span className="text-[11px] font-semibold text-terracotta-700">
            Karnataka • Andhra & Telangana • North Indian • Street Chaat
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
          {INDIAN_REGIONAL_CRAVINGS.map((dish, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyCraving(dish)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border btn-push ${
                craving === dish.query
                  ? 'bg-terracotta-600 text-white border-terracotta-700 shadow-warm-sm'
                  : 'bg-white text-warmgray-800 border-amber-200 hover:border-terracotta-400 hover:bg-amber-50'
              }`}
            >
              {dish.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Config Panel (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl shadow-warm-lg border border-cream-300 space-y-6">
          
          {/* 1. Fridge & Pantry Ingredients Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-warmgray-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-terracotta-600" />
                <span>{t('genIngredientsLabel', currentLanguage)}</span>
              </label>
              <span className="text-xs text-warmgray-500 font-semibold">
                {ingredients.length} items added
              </span>
            </div>

            {/* Custom Input with Voice Dictation */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('genIngredientsPlaceholder', currentLanguage)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-cream-300 text-sm font-medium text-warmgray-900 placeholder:text-warmgray-400 focus:outline-none focus:border-terracotta-500 shadow-xs"
              />
              
              <button
                type="button"
                onClick={handleDictateIngredient}
                className={`p-2.5 rounded-xl border transition-all btn-push flex items-center justify-center ${
                  isDictatingIngredient
                    ? 'bg-red-500 text-white animate-pulse border-red-600'
                    : 'bg-cream-100 hover:bg-cream-200 text-warmgray-700 border-cream-300'
                }`}
                title="Speak ingredients (EN / हिन्दी / ಕನ್ನಡ / తెలుగు)"
              >
                <Mic className={`w-4 h-4 ${isDictatingIngredient ? 'text-white' : 'text-terracotta-600'}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (customInput.trim()) {
                    handleAddIngredient(customInput.trim());
                    setCustomInput('');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-warm-sm transition-all btn-push"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>


            {/* Active Selected Ingredients */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-cream-100/70 border border-cream-200 min-h-[50px]">
                {ingredients.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-terracotta-200 text-terracotta-900 text-xs font-bold shadow-xs animate-in zoom-in-75 duration-150"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-warmgray-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Presets Cloud */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-warmgray-500">
                Quick Pantry Add:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PANTRY_PRESETS.map((item) => {
                  const isAdded = ingredients.some(i => i.toLowerCase() === item.toLowerCase());
                  return (
                    <button
                      key={item}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddIngredient(item)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        isAdded
                          ? 'bg-cream-200 border-cream-300 text-warmgray-400 cursor-not-allowed'
                          : 'bg-white hover:bg-cream-50 border-cream-300 text-warmgray-700 hover:text-terracotta-700 hover:border-terracotta-300 btn-push'
                      }`}
                    >
                      + {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Cuisine & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-200">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-warmgray-800">{t('genCuisineLabel', currentLanguage)}</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-sm font-semibold text-warmgray-900 focus:outline-none focus:border-terracotta-500 shadow-xs"
              >
                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-warmgray-800">{t('genMealTypeLabel', currentLanguage)}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-sm font-semibold text-warmgray-900 focus:outline-none focus:border-terracotta-500 shadow-xs"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* 3. Dietary Restrictions */}
          <div className="space-y-2 pt-2 border-t border-cream-200">
            <label className="text-xs font-bold text-warmgray-800">{t('genDietaryLabel', currentLanguage)}</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((diet) => {
                const isSelected = dietary.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDietary(diet)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all btn-push ${
                      isSelected
                        ? 'bg-sage-600 text-white shadow-warm-sm border border-sage-700'
                        : 'bg-white border border-cream-300 text-warmgray-700 hover:bg-cream-50'
                    }`}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Time, Difficulty, Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-cream-200">
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-warmgray-800">
                <span>{t('genMaxTimeLabel', currentLanguage)}</span>
                <span className="text-terracotta-600 font-bold">{maxTime} min</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={maxTime}
                onChange={(e) => setMaxTime(Number(e.target.value))}
                className="w-full accent-terracotta-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-warmgray-800">{t('genSkillLabel', currentLanguage)}</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs font-semibold text-warmgray-900 focus:outline-none shadow-xs"
              >
                {SKILL_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-warmgray-800">{t('genServingsLabel', currentLanguage)}</label>
              <select
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs font-semibold text-warmgray-900 focus:outline-none shadow-xs"
              >
                {[1, 2, 4, 6, 8].map(n => <option key={n} value={n}>{n} People</option>)}
              </select>
            </div>

          </div>

          {/* 5. Specific Craving or Mood with Voice Dictation */}
          <div className="space-y-1.5 pt-2 border-t border-cream-200">
            <label className="text-xs font-bold text-warmgray-800 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-terracotta-600" />
              <span>{t('genDishNameLabel', currentLanguage)} (Optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={craving}
                onChange={(e) => setCraving(e.target.value)}
                placeholder={t('genDishNamePlaceholder', currentLanguage)}
                className="flex-1 px-4 py-2 rounded-xl bg-white border border-cream-300 text-sm font-medium text-warmgray-900 placeholder:text-warmgray-400 focus:outline-none focus:border-terracotta-500 shadow-xs"
              />
              <button
                type="button"
                onClick={handleDictateCraving}
                className={`p-2.5 rounded-xl border transition-all btn-push flex items-center justify-center ${
                  isDictatingCraving
                    ? 'bg-red-500 text-white animate-pulse border-red-600'
                    : 'bg-cream-100 hover:bg-cream-200 text-warmgray-700 border-cream-300'
                }`}
                title="Speak dish name (EN / हिन्दी / ಕನ್ನಡ / తెలుగు)"
              >
                <Mic className={`w-4 h-4 ${isDictatingCraving ? 'text-white' : 'text-terracotta-600'}`} />
              </button>
            </div>
          </div>


          {/* Error display */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base shadow-warm-lg transition-all duration-300 btn-push ${
              isLoading
                ? 'bg-amber-100 text-amber-800 cursor-wait ai-pulse-glow'
                : 'bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-amber-600 text-white hover:shadow-glow-terracotta'
            }`}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-700 animate-spin" />
                <span>{t('genLoadingTitle', currentLanguage)}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>{t('genButton', currentLanguage)}</span>
              </>
            )}
          </button>

        </div>

        {/* Right Output Showcase (5 cols) */}
        <div className="lg:col-span-5">
          {isLoading ? (
            /* Loading State Animation */
            <div className="glass-panel p-8 rounded-3xl border border-amber-300/80 shadow-warm-xl text-center space-y-6 ai-pulse-glow">
              <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-terracotta-500 flex items-center justify-center shadow-glow-amber animate-float-gentle">
                <ChefHat className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl text-warmgray-900">
                  Formulating Culinary Chemistry...
                </h3>
                <p className="text-xs text-warmgray-600 font-medium">
                  Groq neural network is analyzing flavor affinities, thermal cooking times, and nutrition balance.
                </p>
              </div>
              <div className="flex justify-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-bounce"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          ) : generatedRecipe ? (
            /* Generated Recipe Card */
            <div className="glass-panel rounded-3xl border border-cream-300 shadow-warm-xl overflow-hidden space-y-5 animate-in fade-in zoom-in-95 duration-300">
              
              {/* Recipe Image Banner */}
              <div className="relative h-56 w-full overflow-hidden bg-warmgray-100">
                <img
                  src={generatedRecipe.image}
                  alt={generatedRecipe.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warmgray-950/80 via-warmgray-950/20 to-transparent"></div>
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-terracotta-800 text-xs font-extrabold shadow-sm">
                    {generatedRecipe.cuisine}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-sage-600/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                    {generatedRecipe.difficulty}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Generated Recipe
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
                    {generatedRecipe.title}
                  </h3>
                </div>
              </div>

              {/* Body details */}
              <div className="p-6 space-y-5 pt-0">
                
                <p className="text-xs sm:text-sm text-warmgray-700 font-medium leading-relaxed italic">
                  "{generatedRecipe.description}"
                </p>

                {/* Macros Pills */}
                <div className="grid grid-cols-4 gap-2 bg-cream-100/90 p-3 rounded-2xl border border-cream-200 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-warmgray-500">Calories</div>
                    <div className="text-xs font-extrabold text-terracotta-700">{generatedRecipe.calories} kcal</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-warmgray-500">Protein</div>
                    <div className="text-xs font-extrabold text-warmgray-800">{generatedRecipe.macros?.protein || 24}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-warmgray-500">Carbs</div>
                    <div className="text-xs font-extrabold text-warmgray-800">{generatedRecipe.macros?.carbs || 35}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-warmgray-500">Fat</div>
                    <div className="text-xs font-extrabold text-warmgray-800">{generatedRecipe.macros?.fat || 14}g</div>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-center justify-between text-xs font-semibold text-warmgray-600 px-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                    Prep: {generatedRecipe.prepTime}m | Cook: {generatedRecipe.cookTime}m
                  </span>
                  <span>Serves {generatedRecipe.servings || 4}</span>
                </div>

                {/* Chef Secret Box */}
                {generatedRecipe.chefSecret && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Chef's Secret: </span>
                      <span>{generatedRecipe.chefSecret}</span>
                    </div>
                  </div>
                )}

                {/* Beverage Pairing */}
                {generatedRecipe.beveragePairing && (
                  <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/70 flex items-center gap-2 text-xs text-rose-900 font-medium">
                    <Wine className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    <span><strong>Pairing:</strong> {generatedRecipe.beveragePairing}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  
                  {/* AI Voice Narration Button */}
                  <button
                    type="button"
                    onClick={() => {
                      culinaryAudio.playStepChime();
                      if (onOpenVoicePlayer) {
                        onOpenVoicePlayer(generatedRecipe, selectedAiLanguage);
                      } else {
                        aiVoiceEngine.speak(generatedRecipe.title, selectedAiLanguage);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-warmgray-900 to-warmgray-800 hover:from-warmgray-800 hover:to-warmgray-700 text-amber-300 border border-amber-500/40 font-bold text-xs shadow-warm-sm hover:shadow-glow-amber transition-all btn-push"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>{t('voiceListenRecipe', selectedAiLanguage)} (🎙️ AI Chef)</span>
                  </button>

                  <button
                    onClick={() => {
                      culinaryAudio.playStepChime();
                      onStartCooking(generatedRecipe);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white font-bold text-sm shadow-warm-md btn-push"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Hands-Free Cooking Mode</span>
                  </button>


                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleSaveToVault}
                      disabled={isSaved || saveLoading}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all btn-push ${
                        isSaved
                          ? 'bg-sage-100 border-sage-300 text-sage-800 cursor-default'
                          : 'bg-white border-cream-300 hover:border-terracotta-300 text-warmgray-800 hover:bg-terracotta-50'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-sage-600" />
                          <span>Saved in Vault</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-3.5 h-3.5 text-terracotta-600" />
                          <span>{saveLoading ? 'Saving...' : 'Save to Vault'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleAddToGrocery}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white border border-cream-300 hover:border-amber-400 text-warmgray-800 hover:bg-amber-50 text-xs font-bold transition-all btn-push"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                      <span>Add Groceries</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Idle Placeholder */
            <div className="glass-panel p-8 rounded-3xl border border-cream-300 shadow-warm-md text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cream-100 border border-cream-300 flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-terracotta-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-warmgray-900">
                  Ready to Cook Something Incredible?
                </h4>
                <p className="text-xs text-warmgray-500 max-w-xs mx-auto">
                  Add ingredients on the left and tap Formulate AI Gourmet Recipe to generate a step-by-step master guide.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
