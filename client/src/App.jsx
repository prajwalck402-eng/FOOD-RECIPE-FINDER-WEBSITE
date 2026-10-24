import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Heart, 
  ChefHat, 
  BookOpen, 
  UtensilsCrossed, 
  Clock, 
  Flame, 
  Plus, 
  ArrowUpDown, 
  RefreshCw, 
  Zap, 
  Check, 
  X, 
  Play, 
  BookmarkCheck, 
  ShoppingCart, 
  Lightbulb, 
  Wine,
  ArrowRight,
  Mic
} from 'lucide-react';


import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import RecipeCard from './components/RecipeCard';
import RecipeDetailModal from './components/RecipeDetailModal';
import CookingModeModal from './components/CookingModeModal';
import AiRecipeGenerator from './components/AiRecipeGenerator';
import GroceryList from './components/GroceryList';
import MealPlanner from './components/MealPlanner';
import AddRecipeModal from './components/AddRecipeModal';
import AiSousChefChat from './components/AiSousChefChat';
import AiVoicePlayer from './components/AiVoicePlayer';
import AuthModal from './components/AuthModal';
import { culinaryAudio } from './utils/audio';
import { aiVoiceEngine } from './utils/aiVoiceEngine';
import { t, LANGUAGES } from './utils/i18n';


const CUISINES = ['All', 'South Indian', 'North Indian', 'Indian', 'Italian', 'Mexican', 'Japanese', 'Mediterranean', 'French', 'Thai', 'Spanish', 'American'];
const CATEGORIES = ['All', 'Dinner', 'Lunch', 'Breakfast', 'Dessert', 'Snack', 'Appetizer'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Master Chef'];
const DIETARY_TAGS = ['All', 'High-Protein', 'Keto', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Carb', 'Dairy-Free'];

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'generator' | 'planner' | 'groceries' | 'favorites'

  // Multilingual state (persisted in localStorage)
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('savory_language') || 'en';
  });

  // Auth state (MongoDB user + JWT token)
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('savory_token') || null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data states
  const [recipes, setRecipes] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');

  // AI Search Fallback state
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState(null);
  const [aiRecipeSaved, setAiRecipeSaved] = useState(false);

  // Modals & AI Voice
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState(null);
  const [activeCookingRecipe, setActiveCookingRecipe] = useState(null);
  const [activeVoiceRecipe, setActiveVoiceRecipe] = useState(null);
  const [isDictatingFilter, setIsDictatingFilter] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const recipesSectionRef = useRef(null);

  const handleOpenVoicePlayer = (recipe, lang) => {
    setActiveVoiceRecipe(recipe);
  };

  const handleVoiceFilterSearch = async () => {
    culinaryAudio.playTick();
    setIsDictatingFilter(true);
    try {
      const text = await aiVoiceEngine.dictate(currentLanguage);
      if (text && text.trim()) {
        setSearchQuery(text.trim());
      }
    } catch (e) {
      console.warn('Filter voice search error:', e);
    } finally {
      setIsDictatingFilter(false);
    }
  };


  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Rehydrate authenticated user on reload
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('savory_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
            if (data.user.preferredLanguage) {
              setCurrentLanguage(data.user.preferredLanguage);
              localStorage.setItem('savory_language', data.user.preferredLanguage);
            }
          } else {
            localStorage.removeItem('savory_token');
            setAuthToken(null);
          }
        } catch (e) {
          console.error('Failed to verify token:', e);
        }
      }
    };
    checkAuth();
  }, []);

  // Language switch handler
  const handleLanguageChange = async (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('savory_language', lang);
    const langObj = LANGUAGES.find(l => l.code === lang);
    showToast(`${t('toastLanguageChanged', lang)} ${langObj?.nativeName || lang}`);

    if (currentUser && authToken) {
      try {
        await fetch('/api/auth/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ preferredLanguage: lang })
        });
      } catch (e) {
        console.error('Failed to sync language preference:', e);
      }
    }
  };

  // Login success handler
  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('savory_token', token);
    if (user.preferredLanguage) {
      setCurrentLanguage(user.preferredLanguage);
      localStorage.setItem('savory_language', user.preferredLanguage);
    }
    showToast(`${t('toastLoginSuccess', user.preferredLanguage || currentLanguage)} ${user.name}!`);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('savory_token');
    showToast(t('toastLogoutSuccess', currentLanguage));
  };

  const scrollToRecipes = () => {
    if (recipesSectionRef.current) {
      recipesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch all recipes from API
  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCuisine !== 'All') params.append('cuisine', selectedCuisine);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (selectedDietary !== 'All') params.append('dietary', selectedDietary);
      if (selectedSort) params.append('sort', selectedSort);
      if (activeTab === 'favorites') params.append('favoritesOnly', 'true');

      const res = await fetch(`/api/recipes?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecipes(data.recipes);
      }
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch groceries from API
  const fetchGroceries = async () => {
    try {
      const res = await fetch('/api/groceries');
      const data = await res.json();
      if (data.success) {
        setGroceries(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch groceries:', err);
    }
  };

  // Fetch meal plans from API
  const fetchMealPlans = async () => {
    try {
      const res = await fetch('/api/meal-plans');
      const data = await res.json();
      if (data.success) {
        setMealPlans(data.mealPlans);
      }
    } catch (err) {
      console.error('Failed to fetch meal plans:', err);
    }
  };

  useEffect(() => {
    fetchRecipes();
    setAiSearchResult(null);
    setAiRecipeSaved(false);
  }, [searchQuery, selectedCuisine, selectedCategory, selectedDifficulty, selectedDietary, selectedSort, activeTab]);

  useEffect(() => {
    fetchGroceries();
    fetchMealPlans();
  }, []);

  // AI Recipe Search Engine (Searches Groq when not found locally or on demand)
  const handleSearchWithAi = async (dishQuery) => {
    const queryToSearch = dishQuery || searchQuery;
    if (!queryToSearch.trim()) return;

    culinaryAudio.playStepChime();
    setIsAiSearching(true);
    setAiSearchResult(null);
    setAiRecipeSaved(false);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSearch,
          dishName: queryToSearch,
          cuisine: selectedCuisine !== 'All' ? selectedCuisine : 'Any',
          category: selectedCategory !== 'All' ? selectedCategory : 'Dinner',
          dietary: selectedDietary !== 'All' ? [selectedDietary] : [],
          difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : 'Medium',
        }),
      });

      const data = await res.json();
      if (data.success && data.recipe) {
        setAiSearchResult(data.recipe);
        culinaryAudio.playStepChime();
        showToast(`Chef Groq formulated a master recipe for "${queryToSearch}"!`);
      } else {
        showToast(data.message || 'Failed to craft recipe with AI');
      }
    } catch (err) {
      showToast('Error communicating with AI: ' + err.message);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Save AI search result directly to MongoDB
  const handleSaveAiRecipeToVault = async () => {
    if (!aiSearchResult || aiRecipeSaved) return;
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...aiSearchResult,
          isFavorite: true,
          isAiGenerated: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiRecipeSaved(true);
        setRecipes([data.recipe, ...recipes]);
        culinaryAudio.playStepChime();
        showToast(`Saved "${aiSearchResult.title}" to your MongoDB database!`);
      }
    } catch (err) {
      console.error('Error saving AI recipe to vault:', err);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = async (recipe) => {
    try {
      const res = await fetch(`/api/recipes/${recipe._id}/favorite`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setRecipes(recipes.map(r => r._id === recipe._id ? { ...r, isFavorite: data.isFavorite } : r));
        if (selectedRecipeDetail?._id === recipe._id) {
          setSelectedRecipeDetail({ ...selectedRecipeDetail, isFavorite: data.isFavorite });
        }
        showToast(data.isFavorite ? 'Added to your favorites!' : 'Removed from favorites');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Grocery Actions
  const handleToggleGroceryItem = async (id) => {
    try {
      const res = await fetch(`/api/groceries/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        setGroceries(groceries.map(g => g._id === id ? data.item : g));
      }
    } catch (err) {
      console.error('Error toggling grocery item:', err);
    }
  };

  const handleAddGroceryItem = async (itemData) => {
    try {
      const res = await fetch('/api/groceries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();
      if (data.success) {
        setGroceries([data.item, ...groceries]);
        showToast(`Added ${itemData.name} to grocery list`);
      }
    } catch (err) {
      console.error('Error adding grocery item:', err);
    }
  };

  const handleAddBulkGroceries = async (ingredients, recipeTitle) => {
    try {
      const res = await fetch('/api/groceries/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, recipeTitle }),
      });
      const data = await res.json();
      if (data.success) {
        fetchGroceries();
        showToast(`Added ${data.count} ingredients from ${recipeTitle} to grocery list!`);
      }
    } catch (err) {
      console.error('Error bulk adding groceries:', err);
    }
  };

  const handleDeleteGroceryItem = async (id) => {
    try {
      await fetch(`/api/groceries/${id}`, { method: 'DELETE' });
      setGroceries(groceries.filter(g => g._id !== id));
    } catch (err) {
      console.error('Error deleting grocery item:', err);
    }
  };

  const handleClearCompletedGroceries = async () => {
    try {
      await fetch('/api/groceries/completed', { method: 'DELETE' });
      setGroceries(groceries.filter(g => !g.isCompleted));
      showToast('Cleared completed items');
    } catch (err) {
      console.error('Error clearing groceries:', err);
    }
  };

  // Meal Plan Actions
  const handleSetMealPlanSlot = async (slotData) => {
    try {
      const res = await fetch('/api/meal-plans/slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData),
      });
      const data = await res.json();
      if (data.success) {
        fetchMealPlans();
        showToast(`Assigned ${slotData.dayOfWeek} ${slotData.mealType}`);
      }
    } catch (err) {
      console.error('Error updating meal plan:', err);
    }
  };

  const handleClearMealPlanSlot = async (dayOfWeek, mealType) => {
    try {
      await fetch('/api/meal-plans/slot/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayOfWeek, mealType }),
      });
      setMealPlans(mealPlans.filter(p => !(p.dayOfWeek === dayOfWeek && p.mealType === mealType)));
    } catch (err) {
      console.error('Error clearing slot:', err);
    }
  };

  // Recipe Notes Update
  const handleUpdateRecipeNotes = async (recipeId, notes) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (data.success) {
        setRecipes(recipes.map(r => r._id === recipeId ? data.recipe : r));
        if (selectedRecipeDetail?._id === recipeId) {
          setSelectedRecipeDetail(data.recipe);
        }
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    }
  };

  const favoritesCount = recipes.filter(r => r.isFavorite).length;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream-50 text-warmgray-900">
      
      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-warmgray-900/95 text-white text-xs font-bold shadow-warm-xl border border-cream-300 flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        groceryCount={groceries.filter(g => !g.isCompleted).length}
        favoritesCount={favoritesCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAiGenerator={() => setActiveTab('generator')}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body Switcher */}
      <main className="flex-1">
        
        {activeTab === 'generator' && (
          <AiRecipeGenerator
            onRecipeSaved={(newRecipe) => {
              setRecipes([newRecipe, ...recipes]);
              showToast(t('toastSavedToVault', currentLanguage));
            }}
            onStartCooking={(recipe) => {
              setSelectedRecipeDetail(null);
              setActiveCookingRecipe(recipe);
            }}
            onAddBulkGroceries={handleAddBulkGroceries}
            onOpenVoicePlayer={handleOpenVoicePlayer}
            currentLanguage={currentLanguage}
          />
        )}


        {activeTab === 'planner' && (
          <MealPlanner
            mealPlans={mealPlans}
            recipes={recipes}
            onSetMealPlanSlot={handleSetMealPlanSlot}
            onClearMealPlanSlot={handleClearMealPlanSlot}
            onSelectRecipe={(recipe) => setSelectedRecipeDetail(recipe)}
            onAddBulkGroceries={handleAddBulkGroceries}
            currentLanguage={currentLanguage}
          />
        )}

        {activeTab === 'groceries' && (
          <GroceryList
            groceryItems={groceries}
            onToggleItem={handleToggleGroceryItem}
            onAddItem={handleAddGroceryItem}
            onDeleteItem={handleDeleteGroceryItem}
            onClearCompleted={handleClearCompletedGroceries}
            currentLanguage={currentLanguage}
          />
        )}

        {(activeTab === 'explore' || activeTab === 'favorites') && (
          <>
            {/* 3D Hero Section (Always visible on Explore tab) */}
            {activeTab === 'explore' && (
              <Hero3D
                onOpenAiGenerator={() => setActiveTab('generator')}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCuisine={selectedCuisine}
                setSelectedCuisine={setSelectedCuisine}
                cuisines={CUISINES}
                onSearchSubmit={scrollToRecipes}
                onSearchWithAi={handleSearchWithAi}
                currentLanguage={currentLanguage}
              />
            )}

            {/* Recipes Grid & Filter Bar */}
            <div ref={recipesSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              
              {/* Header Title for Favorites View */}
              {activeTab === 'favorites' && (
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>My Personal Recipe Vault</span>
                  </div>
                  <h2 className="font-serif font-bold text-3xl text-warmgray-900">
                    Favorite Recipes & Saved Creations
                  </h2>
                  <p className="text-xs sm:text-sm text-warmgray-600 font-medium">
                    {recipes.length} saved recipes stored in your MongoDB database
                  </p>
                </div>
              )}

              {/* Filter Chips Bar */}
              <div className="glass-panel p-5 rounded-3xl border border-cream-300 shadow-warm-sm space-y-4">
                
                {/* Search Bar inside Filter Panel */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-cream-200">
                  <div className="relative w-full sm:max-w-md flex items-center">
                    <Search className="absolute left-3.5 w-4 h-4 text-terracotta-600" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && recipes.length === 0 && searchQuery.trim()) {
                          handleSearchWithAi(searchQuery);
                        }
                      }}
                      placeholder={isDictatingFilter ? t('voiceMicActive', currentLanguage) : t('filterSearchPlaceholder', currentLanguage)}
                      className={`w-full pl-10 pr-16 py-2.5 bg-cream-50/80 rounded-xl text-xs sm:text-sm font-semibold text-warmgray-900 placeholder:text-warmgray-400 focus:outline-none focus:bg-white border transition-all shadow-inner ${
                        isDictatingFilter ? 'border-amber-400 bg-amber-50/50' : 'border-cream-300 focus:border-terracotta-400'
                      }`}
                    />
                    
                    <div className="absolute right-2.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleVoiceFilterSearch}
                        className={`p-1 rounded-md transition-all ${
                          isDictatingFilter
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'text-warmgray-400 hover:text-terracotta-600 hover:bg-cream-200'
                        }`}
                        title="Voice search"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>

                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="p-1 rounded-full text-warmgray-400 hover:text-warmgray-700"
                          title="Clear Search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>


                  {/* Ask AI Trigger Button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => handleSearchWithAi(searchQuery)}
                        disabled={isAiSearching}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white text-xs font-bold shadow-warm-sm transition-all btn-push whitespace-nowrap"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin-slow" />
                        <span>{isAiSearching ? 'Chef AI Cooking...' : t('heroAiGenerateBtn', currentLanguage)}</span>
                      </button>
                    )}

                    <div className="text-xs font-bold text-warmgray-600 flex items-center gap-2">
                      <span>Showing <strong className="text-terracotta-700">{recipes.length}</strong> {t('recipesFound', currentLanguage)}</span>
                      {searchQuery && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-terracotta-100 text-terracotta-800">
                          "{searchQuery}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cuisines Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
                  <span className="text-xs font-bold text-warmgray-500 uppercase tracking-wider pl-1 whitespace-nowrap">
                    {t('filterCuisines', currentLanguage)}:
                  </span>
                  {CUISINES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        culinaryAudio.playTick();
                        setSelectedCuisine(c);
                      }}
                      className={`text-xs px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all btn-push ${
                        selectedCuisine === c
                          ? 'bg-terracotta-600 text-white shadow-warm-sm'
                          : 'bg-white border border-cream-200 text-warmgray-700 hover:bg-cream-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Second Row: Category, Difficulty, Dietary, Sort */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-cream-200">
                  
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-xs font-bold text-warmgray-500 uppercase">Meal:</span>
                    {CATEGORIES.slice(0, 5).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          culinaryAudio.playTick();
                          setSelectedCategory(cat);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                          selectedCategory === cat
                            ? 'bg-amber-500 text-white'
                            : 'bg-white text-warmgray-700 hover:bg-cream-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Dietary & Sorting Dropdowns */}
                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* Dietary Dropdown */}
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold text-warmgray-500 uppercase">Diet:</span>
                      <select
                        value={selectedDietary}
                        onChange={(e) => setSelectedDietary(e.target.value)}
                        className="text-xs font-bold text-warmgray-800 bg-white border border-cream-300 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        {DIETARY_TAGS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    {/* Difficulty Dropdown */}
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold text-warmgray-500 uppercase">Skill:</span>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="text-xs font-bold text-warmgray-800 bg-white border border-cream-300 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-1">
                      <ArrowUpDown className="w-3.5 h-3.5 text-warmgray-400" />
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="text-xs font-bold text-warmgray-800 bg-white border border-cream-300 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="newest">Newest First</option>
                        <option value="rating">Top Rated ⭐</option>
                        <option value="quickest">Quickest Cook Time ⏱️</option>
                        <option value="calories">Lowest Calories 🔥</option>
                      </select>
                    </div>

                  </div>

                </div>

              </div>

              {/* AI SEARCH FALLBACK SECTION (When Recipe Not In Local Vault or Result is Ready) */}
              {isAiSearching && (
                <div className="glass-panel p-8 rounded-3xl border border-amber-300 shadow-warm-xl text-center space-y-5 ai-pulse-glow animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-terracotta-500 flex items-center justify-center text-white shadow-glow-amber animate-float-gentle">
                    <ChefHat className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-2xl text-warmgray-900">
                      Chef Groq is Formulating Recipe for "{searchQuery}"...
                    </h3>
                    <p className="text-xs sm:text-sm text-warmgray-600 max-w-lg mx-auto font-medium">
                      Not found in your local database, so our Michelin-level AI model is generating step-by-step instructions, ingredients, exact timings, and nutrition macros right now.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-bounce"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-sage-500 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}

              {/* Display AI Formulated Recipe Result Banner */}
              {aiSearchResult && (
                <div className="glass-panel rounded-3xl border-2 border-amber-300 shadow-warm-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Top Notification Bar */}
                  <div className="bg-gradient-to-r from-amber-500 via-terracotta-600 to-amber-600 p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
                      <span className="font-bold text-sm">
                        AI Recipe Formulated for "{searchQuery || aiSearchResult.title}"!
                      </span>
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-bold">
                      Powered by Groq LLaMA / Qwen 3.6
                    </span>
                  </div>

                  {/* AI Recipe Content */}
                  <div className="p-6 sm:p-8 space-y-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Image & Quick Info */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="relative h-60 rounded-2xl overflow-hidden bg-cream-100 shadow-warm-sm">
                          <img
                            src={aiSearchResult.image}
                            alt={aiSearchResult.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-terracotta-800 text-xs font-extrabold shadow-sm">
                              {aiSearchResult.cuisine}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-sage-600/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                              {aiSearchResult.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Macros */}
                        <div className="grid grid-cols-4 gap-2 bg-cream-100/90 p-3 rounded-2xl border border-cream-200 text-center">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-warmgray-500">Calories</div>
                            <div className="text-xs font-extrabold text-terracotta-700">{aiSearchResult.calories} kcal</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-warmgray-500">Protein</div>
                            <div className="text-xs font-extrabold text-warmgray-800">{aiSearchResult.macros?.protein || 24}g</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-warmgray-500">Carbs</div>
                            <div className="text-xs font-extrabold text-warmgray-800">{aiSearchResult.macros?.carbs || 35}g</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-warmgray-500">Fat</div>
                            <div className="text-xs font-extrabold text-warmgray-800">{aiSearchResult.macros?.fat || 14}g</div>
                          </div>
                        </div>

                        {/* Timings */}
                        <div className="flex items-center justify-between text-xs font-bold text-warmgray-600 px-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                            Prep: {aiSearchResult.prepTime}m | Cook: {aiSearchResult.cookTime}m
                          </span>
                          <span>Serves {aiSearchResult.servings || 4} People</span>
                        </div>

                        {/* Chef Secret */}
                        {aiSearchResult.chefSecret && (
                          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Chef's Secret: </strong>
                              <span>{aiSearchResult.chefSecret}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Title, Ingredients & Steps */}
                      <div className="lg:col-span-7 space-y-5">
                        
                        <div>
                          <span className="text-xs uppercase font-bold tracking-wider text-terracotta-600">
                            {aiSearchResult.category} • {aiSearchResult.dietaryTags?.join(', ')}
                          </span>
                          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-warmgray-900 leading-tight">
                            {aiSearchResult.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-warmgray-700 font-medium leading-relaxed italic mt-1">
                            "{aiSearchResult.description}"
                          </p>
                        </div>

                        {/* Ingredients */}
                        <div className="space-y-2">
                          <h4 className="font-serif font-bold text-base text-warmgray-900 flex items-center justify-between">
                            <span>Ingredients ({aiSearchResult.ingredients?.length})</span>
                            <button
                              type="button"
                              onClick={() => handleAddBulkGroceries(aiSearchResult.ingredients, aiSearchResult.title)}
                              className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Grocery List</span>
                            </button>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                            {aiSearchResult.ingredients?.map((ing, idx) => (
                              <div key={idx} className="p-2 rounded-xl bg-white border border-cream-200 text-xs font-medium flex justify-between">
                                <span className="text-warmgray-800">{ing.name}</span>
                                <span className="font-bold text-terracotta-700">{ing.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* How To Cook / Steps */}
                        <div className="space-y-2">
                          <h4 className="font-serif font-bold text-base text-warmgray-900">
                            How to Make It (Step-by-Step)
                          </h4>
                          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                            {aiSearchResult.instructions?.map((step, idx) => (
                              <div key={idx} className="p-3 rounded-2xl bg-white border border-cream-200 text-xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-terracotta-700">Step {step.stepNumber || idx + 1}</span>
                                  {step.durationMinutes > 0 && (
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                      {step.durationMinutes} min
                                    </span>
                                  )}
                                </div>
                                <p className="text-warmgray-800 font-medium">{step.instruction}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons for AI Recipe */}
                        <div className="pt-3 border-t border-cream-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              culinaryAudio.playStepChime();
                              setActiveCookingRecipe(aiSearchResult);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white font-bold text-xs shadow-warm-md btn-push"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Start Hands-Free Cooking Mode</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleSaveAiRecipeToVault}
                            disabled={aiRecipeSaved}
                            className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all btn-push ${
                              aiRecipeSaved
                                ? 'bg-sage-100 border-sage-300 text-sage-800 cursor-default'
                                : 'bg-white border-cream-300 hover:border-terracotta-300 text-warmgray-800 hover:bg-terracotta-50'
                            }`}
                          >
                            {aiRecipeSaved ? (
                              <>
                                <BookmarkCheck className="w-4 h-4 text-sage-600" />
                                <span>Saved in Database!</span>
                              </>
                            ) : (
                              <>
                                <Heart className="w-4 h-4 text-terracotta-600" />
                                <span>Save Recipe to Database Vault</span>
                              </>
                            )}
                          </button>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* Recipe Cards Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="h-80 rounded-3xl bg-cream-200/50 animate-pulse border border-cream-300"></div>
                  ))}
                </div>
              ) : recipes.length === 0 && !isAiSearching && !aiSearchResult ? (
                /* No Local Results -> Prompt to search in AI Chef */
                <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-cream-300 text-center space-y-6 shadow-warm-md animate-in fade-in duration-300">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-100 to-terracotta-100 border border-terracotta-200 flex items-center justify-center text-terracotta-600 shadow-warm-sm">
                    <ChefHat className="w-10 h-10" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="font-serif font-bold text-2xl text-warmgray-900">
                      {searchQuery ? `No local recipe found for "${searchQuery}"` : 'No matching recipes found'}
                    </h3>
                    <p className="text-xs sm:text-sm text-warmgray-600 font-medium leading-relaxed">
                      {searchQuery 
                        ? `Don't worry! Chef Groq can immediately formulate an authentic, step-by-step recipe for "${searchQuery}" with exact ingredients, instructions, and timers.`
                        : 'Try adjusting your filters or use our AI Chef Genie to craft an original recipe!'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => handleSearchWithAi(searchQuery)}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white text-sm font-bold shadow-warm-lg hover:shadow-glow-terracotta transition-all btn-push"
                      >
                        <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
                        <span>Formulate "{searchQuery}" with AI Chef</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTab('generator')}
                        className="px-8 py-3.5 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-bold shadow-warm-sm transition-all btn-push"
                      >
                        Launch AI Chef Genie
                      </button>
                    )}

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="px-5 py-3 rounded-2xl bg-white border border-cream-300 text-warmgray-700 text-xs font-bold hover:bg-cream-50 transition-all btn-push"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      onSelectRecipe={(r) => setSelectedRecipeDetail(r)}
                      onToggleFavorite={handleToggleFavorite}
                      onStartCooking={(r) => {
                        setSelectedRecipeDetail(null);
                        setActiveCookingRecipe(r);
                      }}
                      onOpenVoicePlayer={handleOpenVoicePlayer}
                      currentLanguage={currentLanguage}
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        )}

      </main>

      {/* 24/7 AI Sous-Chef Chat Drawer */}
      <AiSousChefChat
        currentRecipe={selectedRecipeDetail || activeCookingRecipe || aiSearchResult}
        currentLanguage={currentLanguage}
      />

      {/* Global Interactive Multilingual AI Voice Player */}
      {activeVoiceRecipe && (
        <AiVoicePlayer
          recipe={activeVoiceRecipe}
          onClose={() => setActiveVoiceRecipe(null)}
          onOpenCookingMode={(r) => {
            setActiveVoiceRecipe(null);
            setSelectedRecipeDetail(null);
            setActiveCookingRecipe(r);
          }}
          currentSiteLanguage={currentLanguage}
        />
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipeDetail && (
        <RecipeDetailModal
          recipe={selectedRecipeDetail}
          onClose={() => setSelectedRecipeDetail(null)}
          onToggleFavorite={handleToggleFavorite}
          onStartCooking={(r) => {
            setSelectedRecipeDetail(null);
            setActiveCookingRecipe(r);
          }}
          onAddBulkGroceries={handleAddBulkGroceries}
          onUpdateRecipeNotes={handleUpdateRecipeNotes}
          onOpenVoicePlayer={handleOpenVoicePlayer}
          currentLanguage={currentLanguage}
        />
      )}

      {/* Hands-Free Cooking Mode Modal */}
      {activeCookingRecipe && (
        <CookingModeModal
          recipe={activeCookingRecipe}
          onClose={() => setActiveCookingRecipe(null)}
          currentLanguage={currentLanguage}
        />
      )}


      {/* Add Custom Recipe Modal */}
      {isAddModalOpen && (
        <AddRecipeModal
          onClose={() => setIsAddModalOpen(false)}
          onRecipeCreated={(newRecipe) => {
            setRecipes([newRecipe, ...recipes]);
            showToast('Custom recipe added to database!');
          }}
        />
      )}

      {/* Auth Modal (Login / Signup with MongoDB) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Warm Light Gourmet Footer */}
      <footer className="w-full bg-cream-100 border-t border-cream-200/90 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-terracotta-600 to-amber-500 flex items-center justify-center shadow-warm-sm">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-warmgray-900">
                  Master Chef<span className="text-terracotta-600"> Recipe</span>
                </span>
                <p className="text-[11px] text-warmgray-500 font-medium">
                  Michelin-Grade Intelligence • Groq LLaMA & Qwen 3.6 • MongoDB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-warmgray-600">
              <button onClick={() => setActiveTab('explore')} className="hover:text-terracotta-700 transition-colors">
                Explore
              </button>
              <button onClick={() => setActiveTab('generator')} className="hover:text-terracotta-700 transition-colors">
                AI Chef Genie
              </button>
              <button onClick={() => setActiveTab('planner')} className="hover:text-terracotta-700 transition-colors">
                Meal Planner
              </button>
              <button onClick={() => setActiveTab('groceries')} className="hover:text-terracotta-700 transition-colors">
                Groceries
              </button>
            </div>

          </div>

          <div className="pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between text-xs text-warmgray-400 font-medium gap-2">
            <p>© 2026 Master Chef Recipe. Gourmet light theme & culinary physics.</p>
            <p className="flex items-center gap-1 text-sage-700 font-bold">
              <Zap className="w-3.5 h-3.5" /> Fast AI Inferences Powered by Groq
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
