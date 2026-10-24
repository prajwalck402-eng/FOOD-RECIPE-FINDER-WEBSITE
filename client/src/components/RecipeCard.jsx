import React, { useRef, useState } from 'react';
import { Clock, Flame, Heart, Star, Sparkles, ChefHat, Play, ArrowRight, BookOpen, Volume2 } from 'lucide-react';
import { culinaryAudio } from '../utils/audio';
import { aiVoiceEngine } from '../utils/aiVoiceEngine';
import { t } from '../utils/i18n';

export default function RecipeCard({
  recipe,
  onSelectRecipe,
  onToggleFavorite,
  onStartCooking,
  onOpenVoicePlayer,
  currentLanguage = 'en',
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickSpeaking, setIsQuickSpeaking] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -6; // max 6 deg tilt
    const rotY = ((x - centerX) / centerX) * 6;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const totalTime = (Number(recipe.prepTime) || 15) + (Number(recipe.cookTime) || 20);

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'bg-sage-100 text-sage-800 border-sage-200';
    if (diff === 'Master Chef') return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-terracotta-100 text-terracotta-800 border-terracotta-200';
  };

  const handleVoicePreview = (e) => {
    e.stopPropagation();
    culinaryAudio.playTick();
    if (onOpenVoicePlayer) {
      onOpenVoicePlayer(recipe, currentLanguage);
    } else {
      setIsQuickSpeaking(true);
      const text = `${recipe.title}. A ${recipe.cuisine || ''} ${recipe.category || 'dish'}. ${recipe.description || ''}`;
      aiVoiceEngine.speak(text, currentLanguage, {
        onEnd: () => setIsQuickSpeaking(false),
        onError: () => setIsQuickSpeaking(false)
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      }}
      className="recipe-card-3d relative rounded-3xl bg-white border border-cream-200 shadow-warm-sm hover:shadow-warm-xl overflow-hidden flex flex-col justify-between transition-all duration-300 group cursor-pointer"
      onClick={() => {
        culinaryAudio.playTick();
        onSelectRecipe(recipe);
      }}
    >
      {/* Card Image Banner */}
      <div className="relative h-52 w-full overflow-hidden bg-cream-100">
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80'}
          alt={recipe.title}
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-warmgray-950/70 via-transparent to-black/20"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-terracotta-800 text-[11px] font-extrabold shadow-sm border border-white/40">
              {recipe.cuisine || 'Global'}
            </span>

            {recipe.isAiGenerated && (
              <span className="px-2 py-0.5 rounded-xl bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" /> AI
              </span>
            )}
          </div>

          {/* Quick Action Group (AI Voice + Favorite) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            
            {/* Quick AI Voice Preview Button */}
            <button
              type="button"
              onClick={handleVoicePreview}
              className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 btn-push ${
                isQuickSpeaking
                  ? 'bg-amber-400 text-amber-950 shadow-glow-terracotta animate-pulse'
                  : 'bg-white/80 hover:bg-white text-warmgray-700 hover:text-terracotta-600'
              }`}
              title="Listen with AI Voice (English, Hindi, Kannada, Telugu)"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Favorite Bookmark Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                culinaryAudio.playTick();
                onToggleFavorite(recipe);
              }}
              className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 btn-push ${
                recipe.isFavorite
                  ? 'bg-rose-500 text-white shadow-glow-terracotta'
                  : 'bg-white/80 hover:bg-white text-warmgray-600 hover:text-rose-500'
              }`}
              title="Bookmark Favorite"
            >
              <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>

        </div>

        {/* Bottom Time & Difficulty Bar */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-bold pointer-events-none">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{totalTime} mins</span>
          </div>

          <div className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty || 'Medium'}
          </div>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Rating and category */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-terracotta-700 font-bold uppercase tracking-wider text-[11px]">
              {recipe.category || 'Dinner'}
            </span>

            <div className="flex items-center gap-1 text-amber-600 font-extrabold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{recipe.rating ? Number(recipe.rating).toFixed(1) : '4.8'}</span>
              <span className="text-[10px] text-warmgray-400 font-normal">
                ({recipe.reviewsCount || 12})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-lg text-warmgray-900 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
            {recipe.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-warmgray-600 line-clamp-2 font-medium leading-relaxed">
            {recipe.description || 'A delicately balanced gourmet preparation crafted with aromatic herbs and fresh ingredients.'}
          </p>
        </div>

        {/* Dietary Tag Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {recipe.dietaryTags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-cream-100 border border-cream-300/80 text-warmgray-700 font-semibold"
            >
              {tag}
            </span>
          ))}
          {recipe.calories && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-terracotta-50 border border-terracotta-200 text-terracotta-800 font-extrabold flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5 text-terracotta-600" />
              {recipe.calories} kcal
            </span>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-cream-200 flex items-center justify-between gap-2">
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              culinaryAudio.playTick();
              onSelectRecipe(recipe);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-warmgray-700 hover:text-terracotta-600 transition-colors py-1.5 px-2 rounded-lg hover:bg-cream-100"
          >
            <BookOpen className="w-3.5 h-3.5 text-terracotta-600" />
            <span>{t('cardViewDetails', currentLanguage)}</span>
          </button>

          {/* Direct Cook / Make Recipe Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              culinaryAudio.playStepChime();
              onStartCooking(recipe);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white text-xs font-bold shadow-warm-sm hover:shadow-glow-terracotta transition-all btn-push"
            title="Start Step-by-Step Cooking"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{t('cardCookNow', currentLanguage)}</span>
          </button>

        </div>

      </div>

    </div>
  );
}
