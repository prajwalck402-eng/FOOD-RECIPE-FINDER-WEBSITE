import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Flame, 
  Users, 
  Heart, 
  ShoppingCart, 
  Play, 
  Sparkles, 
  Lightbulb, 
  Wine, 
  Check, 
  Share2, 
  Printer, 
  ChefHat,
  Save,
  Utensils,
  Volume2,
  Languages,
  Mic
} from 'lucide-react';
import { culinaryAudio } from '../utils/audio';
import { aiVoiceEngine, VOICE_LANGUAGES } from '../utils/aiVoiceEngine';
import { recipeTranslator } from '../utils/recipeTranslator';
import { t } from '../utils/i18n';

export default function RecipeDetailModal({
  recipe,
  onClose,
  onToggleFavorite,
  onStartCooking,
  onAddBulkGroceries,
  onUpdateRecipeNotes,
  onOpenVoicePlayer,
  currentLanguage = 'en',
}) {
  if (!recipe) return null;

  const [selectedVoiceLang, setSelectedVoiceLang] = useState(currentLanguage || 'en');
  const [activeRecipe, setActiveRecipe] = useState(recipe);
  const [isTranslating, setIsTranslating] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [userNotes, setUserNotes] = useState(recipe.notes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  // Sync translation when language changes
  React.useEffect(() => {
    let isMounted = true;
    const loadTranslation = async () => {
      if (selectedVoiceLang === 'en') {
        setActiveRecipe(recipe);
        return;
      }
      setIsTranslating(true);
      try {
        const trans = await recipeTranslator.translateRecipe(recipe, selectedVoiceLang);
        if (isMounted && trans) {
          setActiveRecipe(trans);
        }
      } catch (err) {
        console.warn('Recipe detail translation error:', err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    loadTranslation();

    return () => {
      isMounted = false;
    };
  }, [recipe, selectedVoiceLang]);

  // Normalize ingredients
  const normalizedIngredients = (activeRecipe.ingredients || recipe.ingredients || []).map((ing, idx) => {
    if (typeof ing === 'string') {
      return { name: ing, amount: '', category: 'Produce' };
    }
    return {
      name: ing.name || ing.title || String(ing),
      amount: ing.amount || ing.quantity || '',
      category: ing.category || 'Produce'
    };
  });

  // Normalize instructions
  const normalizedInstructions = (activeRecipe.instructions || recipe.instructions || []).map((step, idx) => {
    if (typeof step === 'string') {
      return {
        stepNumber: idx + 1,
        instruction: step,
        durationMinutes: 5,
        chefTip: ''
      };
    }
    return {
      stepNumber: step.stepNumber || step.step || idx + 1,
      instruction: step.instruction || step.text || step.desc || String(step),
      durationMinutes: Number(step.durationMinutes || step.time || 0),
      chefTip: step.chefTip || step.tip || ''
    };
  });


  const toggleIngredient = (idx) => {
    culinaryAudio.playTick();
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleAddGroceries = () => {
    culinaryAudio.playStepChime();
    if (onAddBulkGroceries) {
      onAddBulkGroceries(normalizedIngredients, recipe.title);
    }
  };

  const handleSaveNotes = async () => {
    if (onUpdateRecipeNotes) {
      culinaryAudio.playTick();
      await onUpdateRecipeNotes(recipe._id, userNotes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2500);
    }
  };

  const handleShare = () => {
    culinaryAudio.playTick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    culinaryAudio.playTick();
    window.print();
  };

  // Speak single ingredient
  const handleSpeakIngredient = (e, ing, idx) => {
    e.stopPropagation();
    culinaryAudio.playTick();
    setSpeakingIndex(`ing_${idx}`);
    const text = `${ing.amount || ''} ${ing.name}`.trim();
    aiVoiceEngine.speak(text, selectedVoiceLang, {
      onEnd: () => setSpeakingIndex(null),
      onError: () => setSpeakingIndex(null)
    });
  };

  // Speak single step
  const handleSpeakStep = (e, step, idx) => {
    e.stopPropagation();
    culinaryAudio.playTick();
    setSpeakingIndex(`step_${idx}`);
    
    let text = `Step ${idx + 1}. ${step.instruction}`;
    if (selectedVoiceLang === 'hi') text = `चरण ${idx + 1}. ${step.instruction}`;
    if (selectedVoiceLang === 'kn') text = `ಹಂತ ${idx + 1}. ${step.instruction}`;
    if (selectedVoiceLang === 'te') text = `దశ ${idx + 1}. ${step.instruction}`;

    aiVoiceEngine.speak(text, selectedVoiceLang, {
      onEnd: () => setSpeakingIndex(null),
      onError: () => setSpeakingIndex(null)
    });
  };

  const handleStartVoiceNarration = () => {
    culinaryAudio.playStepChime();
    if (onOpenVoicePlayer) {
      onOpenVoicePlayer(recipe, selectedVoiceLang);
    } else {
      aiVoiceEngine.speak(recipe.title, selectedVoiceLang);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto modal-backdrop-blur animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-warm-xl border border-cream-300 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-72 w-full flex-shrink-0 bg-warmgray-100">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-warmgray-950/85 via-warmgray-950/30 to-black/30"></div>

          {/* Top Bar Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md text-terracotta-800 text-xs font-extrabold shadow-sm">
                {recipe.cuisine || 'Global'}
              </span>
              <span className="px-3 py-1 rounded-xl bg-sage-700/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                {recipe.difficulty || 'Medium'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/80 hover:bg-white text-warmgray-700 backdrop-blur-md shadow-sm transition-all btn-push"
                title="Share Recipe"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="p-2.5 rounded-full bg-white/80 hover:bg-white text-warmgray-700 backdrop-blur-md shadow-sm transition-all btn-push"
                title="Print Recipe"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  culinaryAudio.playTick();
                  onToggleFavorite(recipe);
                }}
                className={`p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all btn-push ${
                  recipe.isFavorite
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/80 hover:bg-white text-warmgray-700'
                }`}
                title="Toggle Favorite"
              >
                <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-white' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => {
                  aiVoiceEngine.stop();
                  onClose();
                }}
                className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md shadow-sm transition-all btn-push"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title & Stats */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-300">
              {recipe.category || 'Dinner'} • {recipe.dietaryTags?.join(', ') || 'Gourmet'}
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-tight">
              {activeRecipe.title || recipe.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-7 flex-1">
          
          {/* AI Chef Voice Narration & Language Action Bar (EN / HI / KN / TE) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-warmgray-900 via-warmgray-900 to-warmgray-950 border border-amber-500/30 text-white shadow-warm-md flex flex-col lg:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-terracotta-600 to-amber-500 flex items-center justify-center shadow-glow-terracotta flex-shrink-0">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-cream-100">
                    {t('voiceChefStudio', selectedVoiceLang)}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    Multilingual Voice
                  </span>
                </div>
                <p className="text-[11px] text-warmgray-400 font-medium">
                  {selectedVoiceLang === 'hi' ? 'हिन्दी में सामग्री और पकाने की विधि सुनें' :
                   selectedVoiceLang === 'kn' ? 'ಕನ್ನಡದಲ್ಲಿ ಪದಾರ್ಥಗಳು ಮತ್ತು ಅಡುಗೆ ವಿಧಾನ ಆಲಿಸಿ' :
                   selectedVoiceLang === 'te' ? 'తెలుగులో పదార్థాలు మరియు తయారీ విధానం వినండి' :
                   'Listen to ingredients & step-by-step instructions in your chosen language.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
              {/* Language Pills Bar */}
              <div className="flex items-center p-1 bg-warmgray-800 rounded-xl border border-warmgray-700 gap-1">
                {VOICE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedVoiceLang(lang.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedVoiceLang === lang.code
                        ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white shadow-xs'
                        : 'text-warmgray-300 hover:bg-warmgray-700'
                    }`}
                  >
                    <span>{lang.flag} {lang.native}</span>
                  </button>
                ))}
              </div>

              {/* Start Listening Button */}
              <button
                type="button"
                onClick={handleStartVoiceNarration}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta-500 to-amber-500 hover:from-terracotta-600 hover:to-amber-600 text-white font-bold text-xs shadow-warm-sm hover:scale-105 transition-all btn-push whitespace-nowrap"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t('voiceListenRecipe', selectedVoiceLang)}</span>
              </button>
            </div>

          </div>


          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cream-100/90 p-4 rounded-2xl border border-cream-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-warmgray-500 uppercase">Prep / Cook</div>
                <div className="text-xs font-extrabold text-warmgray-900">{recipe.prepTime || 15}m / {recipe.cookTime || 20}m</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-warmgray-500 uppercase">Calories</div>
                <div className="text-xs font-extrabold text-terracotta-700">{recipe.calories || 450} kcal</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-warmgray-500 uppercase">Servings</div>
                <div className="text-xs font-extrabold text-warmgray-900">{recipe.servings || 4} People</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warmgray-200 text-warmgray-700 flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-warmgray-500 uppercase">Skill</div>
                <div className="text-xs font-extrabold text-warmgray-900">{recipe.difficulty || 'Medium'}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          {(activeRecipe.description || recipe.description) && (
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-sm text-warmgray-700 font-medium leading-relaxed italic">
              "{activeRecipe.description || recipe.description}"
            </div>
          )}


          {/* Macro Breakdown */}
          {recipe.macros && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-warmgray-500 uppercase tracking-wider">
                Nutritional Breakdown (Per Serving)
              </h4>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white border border-cream-200 shadow-xs">
                  <div className="text-xs text-warmgray-500 font-semibold">Protein</div>
                  <div className="text-base font-extrabold text-warmgray-900">{recipe.macros.protein || 25}g</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-cream-200 shadow-xs">
                  <div className="text-xs text-warmgray-500 font-semibold">Carbs</div>
                  <div className="text-base font-extrabold text-warmgray-900">{recipe.macros.carbs || 35}g</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-cream-200 shadow-xs">
                  <div className="text-xs text-warmgray-500 font-semibold">Healthy Fats</div>
                  <div className="text-base font-extrabold text-warmgray-900">{recipe.macros.fat || 15}g</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-cream-200 shadow-xs">
                  <div className="text-xs text-warmgray-500 font-semibold">Dietary Fiber</div>
                  <div className="text-base font-extrabold text-warmgray-900">{recipe.macros.fiber || 4}g</div>
                </div>
              </div>
            </div>
          )}

          {/* Main 2-Column Section: Ingredients & Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Ingredients (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-warmgray-900 flex items-center gap-2">
                  <span>Ingredients</span>
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-cream-200 text-warmgray-700">
                    {normalizedIngredients.length}
                  </span>
                </h3>

                <button
                  type="button"
                  onClick={handleAddGroceries}
                  className="inline-flex items-center gap-1 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 btn-push"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Groceries</span>
                </button>
              </div>

              <div className="space-y-2">
                {normalizedIngredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  const isThisSpeaking = speakingIndex === `ing_${idx}`;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none group/ing ${
                        isChecked
                          ? 'bg-cream-100/60 border-cream-200 text-warmgray-400 line-through'
                          : isThisSpeaking
                          ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                          : 'bg-white border-cream-200/90 hover:border-terracotta-300 text-warmgray-800 shadow-xs'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-terracotta-600 border-terracotta-600 text-white'
                          : 'border-warmgray-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1 text-xs font-semibold flex justify-between items-center gap-2">
                        <span>{ing.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold ${isChecked ? 'text-warmgray-400' : 'text-terracotta-700'}`}>
                            {ing.amount}
                          </span>
                          {/* Mini speaker button */}
                          <button
                            type="button"
                            onClick={(e) => handleSpeakIngredient(e, ing, idx)}
                            className="opacity-0 group-hover/ing:opacity-100 p-1 rounded-md hover:bg-cream-200 text-warmgray-500 hover:text-terracotta-600 transition-all"
                            title="Speak ingredient"
                          >
                            <Volume2 className={`w-3 h-3 ${isThisSpeaking ? 'text-amber-600 animate-pulse' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Instructions (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-warmgray-900">
                  Culinary Instructions
                </h3>
                <span className="text-xs text-warmgray-500 font-semibold">
                  {normalizedInstructions.length} Steps
                </span>
              </div>

              <div className="space-y-4">
                {normalizedInstructions.map((step, idx) => {
                  const isThisSpeaking = speakingIndex === `step_${idx}`;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl bg-white border transition-all shadow-xs space-y-2 group/step ${
                        isThisSpeaking ? 'border-amber-400 bg-amber-50/60 shadow-sm' : 'border-cream-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-terracotta-100 text-terracotta-800">
                          Step {step.stepNumber || idx + 1}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {step.durationMinutes > 0 && (
                            <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <Clock className="w-3 h-3" />
                              {step.durationMinutes} min
                            </span>
                          )}

                          {/* Mini Step Speaker Icon */}
                          <button
                            type="button"
                            onClick={(e) => handleSpeakStep(e, step, idx)}
                            className="p-1.5 rounded-lg bg-cream-100 hover:bg-terracotta-50 text-warmgray-600 hover:text-terracotta-600 transition-all btn-push"
                            title="Speak this step"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${isThisSpeaking ? 'text-amber-600 animate-pulse' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-warmgray-800 font-medium leading-relaxed">
                        {step.instruction}
                      </p>

                      {step.chefTip && (
                        <div className="pt-2 border-t border-cream-100 flex items-start gap-1.5 text-[11px] text-amber-900 font-semibold">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span><strong>Chef Tip:</strong> {step.chefTip}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Master Chef Secret Card */}
          {recipe.chefSecret && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-sm">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm text-amber-950">
                  Master Chef's Secret Technique
                </h4>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  {recipe.chefSecret}
                </p>
              </div>
            </div>
          )}

          {/* Beverage Pairing */}
          {recipe.beveragePairing && (
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <Wine className="w-5 h-5" />
              </div>
              <div className="text-xs text-rose-900">
                <span className="font-bold">Sommelier Pairing: </span>
                <span>{recipe.beveragePairing}</span>
              </div>
            </div>
          )}

          {/* User Notes Box */}
          <div className="space-y-2 pt-2 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-warmgray-700">
                My Kitchen Notes & Adjustments
              </label>
              {notesSaved && (
                <span className="text-xs font-bold text-sage-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Notes Saved to Database
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Added an extra pinch of smoked paprika; cooked 2 mins longer."
                rows={2}
                className="flex-1 p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-warmgray-800 placeholder:text-warmgray-400 focus:outline-none focus:border-terracotta-500"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 rounded-xl bg-warmgray-800 hover:bg-warmgray-900 text-white text-xs font-bold shadow-xs transition-all btn-push flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Sticky Bottom CTA */}
        <div className="p-4 sm:p-5 bg-cream-50 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-warmgray-600 font-semibold">
            Ready to cook? Open hands-free mode for audio guidance and step countdown timers.
          </div>

          <button
            type="button"
            onClick={() => {
              aiVoiceEngine.stop();
              culinaryAudio.playStepChime();
              onStartCooking(recipe);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white font-bold text-sm shadow-warm-lg hover:shadow-glow-terracotta transition-all btn-push whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t('detailStartCooking', currentLanguage)}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
