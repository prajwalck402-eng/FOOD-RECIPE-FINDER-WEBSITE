import React, { useRef, useState } from 'react';
import { Sparkles, ArrowRight, Flame, Clock, ChefHat, Search, X, Bot, Mic } from 'lucide-react';
import ThreeDScene from './ThreeDScene';
import { culinaryAudio } from '../utils/audio';
import { aiVoiceEngine } from '../utils/aiVoiceEngine';
import { t } from '../utils/i18n';

export default function Hero3D({
  onOpenAiGenerator,
  searchQuery,
  setSearchQuery,
  selectedCuisine,
  setSelectedCuisine,
  cuisines = [],
  onSearchSubmit,
  onSearchWithAi,
  currentLanguage = 'en',
}) {
  const inputRef = useRef(null);
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const quickPantryTags = [
    { name: 'Ennegayi', icon: '🍆' },
    { name: 'Biryani', icon: '🍚' },
    { name: 'Masala Dosa', icon: '🥞' },
    { name: 'Gutti Vankaya', icon: '🌶️' },
    { name: 'Butter Chicken', icon: '🍗' },
    { name: 'Dal Makhani', icon: '🍲' },
    { name: 'Paneer', icon: '🧀' },
    { name: 'Samosa Chaat', icon: '🥟' },
    { name: 'Pesarattu', icon: '🥞' },
  ];

  const handleClear = () => {
    culinaryAudio.playTick();
    setSearchQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleTagClick = (tagName) => {
    culinaryAudio.playTick();
    setSearchQuery(tagName);
    if (onSearchSubmit) onSearchSubmit();
  };

  const handleSearchSubmitKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  const handleVoiceSearch = async () => {
    culinaryAudio.playTick();
    setIsListeningVoice(true);
    try {
      const query = await aiVoiceEngine.dictate(currentLanguage);
      if (query && query.trim()) {
        setSearchQuery(query.trim());
        if (onSearchSubmit) {
          setTimeout(() => onSearchSubmit(), 200);
        }
      }
    } catch (e) {
      console.warn('Hero voice search error:', e);
    } finally {
      setIsListeningVoice(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-50 pt-8 pb-16 border-b border-cream-200/80">
      {/* 3D Three.js Interactive Culinary Canvas */}
      <ThreeDScene />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Subtle Sparkle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta-50/90 border border-terracotta-200/90 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta-600"></span>
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-terracotta-800">
              {t('heroBadge', currentLanguage)} • Groq AI & Voice
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-warmgray-950 leading-[1.15]">
            {t('heroTitlePrefix', currentLanguage)} <br className="hidden sm:inline" />
            <span className="gradient-text-warm font-serif italic">{t('heroTitleHighlight', currentLanguage)}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-warmgray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle', currentLanguage)}
          </p>

          {/* Main Interactive Search & Action Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="glass-panel p-2 rounded-2xl shadow-warm-lg flex flex-col sm:flex-row items-center gap-2 border border-cream-300">
              
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-terracotta-600" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmitKey}
                  placeholder={isListeningVoice ? t('voiceMicActive', currentLanguage) : t('heroSearchPlaceholder', currentLanguage)}
                  className={`w-full pl-11 pr-16 py-3.5 bg-white/70 rounded-xl text-sm font-semibold text-warmgray-900 placeholder:text-warmgray-400 focus:outline-none focus:bg-white border transition-all shadow-inner ${
                    isListeningVoice ? 'border-amber-400 bg-amber-50/50' : 'border-transparent focus:border-terracotta-400'
                  }`}
                />
                
                <div className="absolute right-3 flex items-center gap-1">
                  {/* Voice Search Mic */}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-1.5 rounded-lg transition-all btn-push ${
                      isListeningVoice
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-cream-200 hover:bg-cream-300 text-warmgray-700 hover:text-terracotta-600'
                    }`}
                    title="Search recipes with AI Voice (English, Hindi, Kannada, Telugu)"
                  >
                    <Mic className={`w-4 h-4 ${isListeningVoice ? 'text-white' : 'text-terracotta-600'}`} />
                  </button>

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1.5 rounded-lg bg-cream-200 hover:bg-cream-300 text-warmgray-600 transition-colors"
                      title="Clear Search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      culinaryAudio.playStepChime();
                      if (onSearchWithAi) onSearchWithAi(searchQuery);
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-warm-sm transition-all btn-push whitespace-nowrap"
                    title="Generate with AI Chef"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>{t('heroAiGenerateBtn', currentLanguage)}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    culinaryAudio.playTick();
                    onOpenAiGenerator();
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-amber-600 text-white font-bold text-sm shadow-warm-md hover:shadow-glow-terracotta transition-all duration-300 btn-push whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
                  <span>{t('navGenerator', currentLanguage)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick Regional Dish & Pantry Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold text-warmgray-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-terracotta-600" />
                {t('heroQuickPantryTitle', currentLanguage)}:
              </span>
              {quickPantryTags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => handleTagClick(tag.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 hover:bg-white border border-cream-300 text-xs font-semibold text-warmgray-800 shadow-xs hover:border-terracotta-400 hover:text-terracotta-700 transition-all btn-push"
                >
                  <span>{tag.icon}</span>
                  <span>{tag.name}</span>
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
