import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Calendar, 
  ShoppingCart, 
  Heart, 
  Plus, 
  ChefHat, 
  Zap,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Globe,
  Flame
} from 'lucide-react';
import { culinaryAudio } from '../utils/audio';
import { t } from '../utils/i18n';
import LanguageSelector from './LanguageSelector';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  groceryCount = 0,
  favoritesCount = 0,
  onOpenAiGenerator,
  currentLanguage = 'en',
  onLanguageChange,
  currentUser = null,
  onOpenAuthModal,
  onLogout,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'explore', label: t('navExplore', currentLanguage), icon: BookOpen },
    { id: 'generator', label: t('navGenerator', currentLanguage), icon: Sparkles, highlight: true },
    { id: 'planner', label: t('navPlanner', currentLanguage), icon: Calendar },
    { 
      id: 'groceries', 
      label: t('navGroceries', currentLanguage), 
      icon: ShoppingCart, 
      badge: groceryCount > 0 ? groceryCount : null 
    },
    { 
      id: 'favorites', 
      label: t('navFavorites', currentLanguage), 
      icon: Heart, 
      badge: favoritesCount > 0 ? favoritesCount : null 
    },
  ];

  const handleTabClick = (tabId) => {
    culinaryAudio.playTick();
    setActiveTab(tabId);
    if (tabId === 'generator' && onOpenAiGenerator) {
      onOpenAiGenerator();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cream-200/90 shadow-warm-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo with 3D Culinary Badge */}
          <div 
            onClick={() => handleTabClick('explore')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-terracotta-500 to-amber-500 flex items-center justify-center shadow-warm-md group-hover:scale-105 group-hover:shadow-glow-terracotta transition-all duration-300">
              <ChefHat className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-2xl tracking-tight text-warmgray-900">
                  Master Chef<span className="text-terracotta-600 font-extrabold"> Recipe</span>
                </span>
              </div>
              <p className="text-[11px] text-warmgray-500 font-medium tracking-wide">
                {t('brandTagline', currentLanguage)}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-cream-100/80 p-1.5 rounded-2xl border border-cream-300/60 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 btn-push ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white shadow-warm-md'
                        : 'bg-white text-terracotta-800 shadow-warm-sm border border-cream-200'
                      : item.highlight
                      ? 'text-terracotta-700 hover:bg-terracotta-50/80'
                      : 'text-warmgray-600 hover:text-warmgray-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive && !item.highlight ? 'text-terracotta-600' : ''}`} />
                  <span>{item.label}</span>

                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                      isActive && item.highlight
                        ? 'bg-white text-terracotta-700'
                        : 'bg-terracotta-100 text-terracotta-800 border border-terracotta-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && !isActive && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector Dropdown */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />

            {/* Live AI Status Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-50 border border-sage-200 text-sage-800 text-xs font-semibold shadow-xs">
              <Zap className="w-3.5 h-3.5 text-sage-600 animate-pulse" />
              <span>{t('liveAiActive', currentLanguage)}</span>
            </div>

            {/* Add Custom Recipe Button */}
            <button
              onClick={() => {
                culinaryAudio.playTick();
                onOpenAddModal();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-terracotta-200 hover:border-terracotta-400 text-terracotta-700 hover:bg-terracotta-50 text-xs font-bold shadow-warm-sm transition-all duration-200 btn-push"
            >
              <Plus className="w-4 h-4 text-terracotta-600" />
              <span>{t('navAddRecipe', currentLanguage)}</span>
            </button>

            {/* User Auth / Profile Dropdown */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    culinaryAudio.playTick();
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white border border-cream-300 hover:border-terracotta-300 shadow-warm-sm transition-all duration-200 btn-push"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-terracotta-500 to-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    {currentUser.avatar || '👨‍🍳'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-warmgray-900 leading-tight max-w-[100px] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-warmgray-500 font-medium">Chef Member</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-warmgray-500 transition-transform ${isProfileOpen ? 'rotate-180 text-terracotta-600' : ''}`} />
                </button>

                {/* Profile Popup Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white/95 backdrop-blur-2xl border border-cream-200 shadow-warm-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                    
                    {/* User Card */}
                    <div className="flex items-center gap-3 pb-3 border-b border-cream-200">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-amber-500 text-white flex items-center justify-center text-xl shadow-warm-sm">
                        {currentUser.avatar || '👨‍🍳'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-warmgray-900 truncate">
                          {currentUser.name}
                        </h4>
                        <p className="text-xs text-warmgray-500 truncate">
                          {currentUser.email}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>MongoDB Verified</span>
                        </span>
                      </div>
                    </div>

                    {/* Preferences info */}
                    <div className="space-y-1.5 text-xs text-warmgray-600 bg-cream-50/70 p-3 rounded-2xl border border-cream-200/80">
                      <div className="flex items-center justify-between">
                        <span className="text-warmgray-500 flex items-center gap-1 font-medium">
                          <Globe className="w-3.5 h-3.5 text-terracotta-600" /> Language:
                        </span>
                        <span className="font-bold text-warmgray-800 uppercase">{currentLanguage}</span>
                      </div>
                      {currentUser.dietaryPreferences && currentUser.dietaryPreferences.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1">
                          {currentUser.dietaryPreferences.map((tag) => (
                            <span key={tag} className="text-[10px] bg-white border border-cream-300 text-terracotta-800 px-1.5 py-0.5 rounded-md font-bold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <button
                      onClick={() => {
                        culinaryAudio.playTick();
                        setIsProfileOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all btn-push"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('navSignOut', currentLanguage)}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  culinaryAudio.playTick();
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white text-xs font-bold shadow-warm-md hover:shadow-warm-lg transition-all duration-200 btn-push"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('navSignIn', currentLanguage)}</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-cream-200 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-terracotta-700 bg-terracotta-50'
                    : 'text-warmgray-600 hover:text-warmgray-900'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 text-[9px] px-1 rounded-full bg-terracotta-600 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
