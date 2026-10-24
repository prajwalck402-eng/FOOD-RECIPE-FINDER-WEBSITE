import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Mic, 
  MicOff, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  ChefHat, 
  Languages, 
  Gauge, 
  Flame,
  ListOrdered,
  ShoppingBag,
  Maximize2
} from 'lucide-react';
import { aiVoiceEngine, VOICE_LANGUAGES } from '../utils/aiVoiceEngine';
import { recipeTranslator } from '../utils/recipeTranslator';
import { culinaryAudio } from '../utils/audio';
import { t } from '../utils/i18n';

export default function AiVoicePlayer({
  recipe,
  onClose,
  onOpenCookingMode,
  currentSiteLanguage = 'en'
}) {
  if (!recipe) return null;

  const [voiceLang, setVoiceLang] = useState(currentSiteLanguage || 'en');
  const [activeRecipe, setActiveRecipe] = useState(recipe);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [phrases, setPhrases] = useState([]);
  const [speed, setSpeed] = useState(1.0);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeMode, setActiveMode] = useState('full'); // 'full' | 'ingredients' | 'steps'
  const [lastHeardCommand, setLastHeardCommand] = useState(null);
  const [isLoadingAiNarration, setIsLoadingAiNarration] = useState(false);

  const teleprompterRef = useRef(null);

  // Sync voice engine language with site language initially
  useEffect(() => {
    if (currentSiteLanguage && VOICE_LANGUAGES.some(l => l.code === currentSiteLanguage)) {
      setVoiceLang(currentSiteLanguage);
      aiVoiceEngine.setLanguage(currentSiteLanguage);
    }
  }, [currentSiteLanguage]);

  // Re-generate spoken phrases when recipe, language, or activeMode changes
  useEffect(() => {
    let isMounted = true;
    const generatePhrases = async () => {
      let targetRecipe = recipe;
      if (voiceLang !== 'en') {
        try {
          const trans = await recipeTranslator.translateRecipe(recipe, voiceLang);
          if (trans && isMounted) {
            targetRecipe = trans;
            setActiveRecipe(trans);
          }
        } catch (e) {
          console.warn('Voice player translation error:', e);
        }
      } else {
        setActiveRecipe(recipe);
      }

      if (!isMounted) return;

      let rawPhrases = aiVoiceEngine.getSpokenPhrases(targetRecipe, voiceLang);
      if (activeMode === 'ingredients') {
        rawPhrases = rawPhrases.filter(p => p.type === 'ingredients' || p.type === 'intro');
      } else if (activeMode === 'steps') {
        rawPhrases = rawPhrases.filter(p => p.type === 'step');
      }
      setPhrases(rawPhrases);
      setCurrentPhraseIndex(0);
      aiVoiceEngine.stop();
      setIsPlaying(false);
      setIsPaused(false);
    };

    generatePhrases();

    return () => {
      isMounted = false;
    };
  }, [recipe, voiceLang, activeMode]);


  // Subscribe to voice engine state
  useEffect(() => {
    const unsubscribe = aiVoiceEngine.subscribe((state) => {
      if (state.isPlaying !== undefined) setIsPlaying(state.isPlaying);
      if (state.isPaused !== undefined) setIsPaused(state.isPaused);
    });

    return () => {
      unsubscribe();
      aiVoiceEngine.stop();
      aiVoiceEngine.stopListening();
    };
  }, []);

  // Voice Command Handler for Hands-Free Mode
  const handleVoiceCommand = (command, rawText) => {
    culinaryAudio.playTick();
    setLastHeardCommand({ command, text: rawText });
    setTimeout(() => setLastHeardCommand(null), 3000);

    if (command === 'next') {
      handleNextPhrase();
    } else if (command === 'prev') {
      handlePrevPhrase();
    } else if (command === 'repeat') {
      handleRepeatPhrase();
    } else if (command === 'pause') {
      handlePause();
    } else if (command === 'resume') {
      handlePlay();
    } else if (command === 'ingredients') {
      setActiveMode('ingredients');
    }
  };

  // Toggle Hands-Free Microphone
  const handleToggleHandsFree = () => {
    culinaryAudio.playTick();
    if (isHandsFree) {
      aiVoiceEngine.stopListening();
      setIsHandsFree(false);
    } else {
      const started = aiVoiceEngine.startListening(handleVoiceCommand);
      if (started) {
        setIsHandsFree(true);
      } else {
        alert('Microphone speech recognition is not supported in this browser.');
      }
    }
  };

  // Play current phrase
  const speakCurrentPhrase = async (indexToSpeak) => {
    const idx = indexToSpeak !== undefined ? indexToSpeak : currentPhraseIndex;
    const targetPhrase = phrases[idx];
    if (!targetPhrase) return;

    culinaryAudio.playTick();
    setIsPlaying(true);
    setIsPaused(false);

    await aiVoiceEngine.speak(targetPhrase.text, voiceLang, {
      rate: speed,
      onEnd: () => {
        // Auto-advance to next phrase
        if (idx < phrases.length - 1) {
          setCurrentPhraseIndex(idx + 1);
          setTimeout(() => {
            speakCurrentPhrase(idx + 1);
          }, 600);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
        }
      }
    });
  };

  const handlePlay = () => {
    if (isPaused) {
      aiVoiceEngine.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      speakCurrentPhrase(currentPhraseIndex);
    }
  };

  const handlePause = () => {
    culinaryAudio.playTick();
    aiVoiceEngine.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    culinaryAudio.playTick();
    aiVoiceEngine.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleNextPhrase = () => {
    culinaryAudio.playTick();
    if (currentPhraseIndex < phrases.length - 1) {
      const nextIdx = currentPhraseIndex + 1;
      setCurrentPhraseIndex(nextIdx);
      speakCurrentPhrase(nextIdx);
    }
  };

  const handlePrevPhrase = () => {
    culinaryAudio.playTick();
    if (currentPhraseIndex > 0) {
      const prevIdx = currentPhraseIndex - 1;
      setCurrentPhraseIndex(prevIdx);
      speakCurrentPhrase(prevIdx);
    }
  };

  const handleRepeatPhrase = () => {
    culinaryAudio.playTick();
    speakCurrentPhrase(currentPhraseIndex);
  };

  const handleSelectPhrase = (index) => {
    culinaryAudio.playTick();
    setCurrentPhraseIndex(index);
    speakCurrentPhrase(index);
  };

  const handleChangeLanguage = (newLang) => {
    culinaryAudio.playTick();
    setVoiceLang(newLang);
    aiVoiceEngine.setLanguage(newLang);
  };

  const handleSpeedChange = (newSpeed) => {
    culinaryAudio.playTick();
    setSpeed(newSpeed);
    aiVoiceEngine.setRate(newSpeed);
    if (isPlaying && !isPaused) {
      speakCurrentPhrase(currentPhraseIndex);
    }
  };

  const currentPhrase = phrases[currentPhraseIndex];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="relative bg-gradient-to-b from-warmgray-900 via-warmgray-900 to-warmgray-950 text-white rounded-3xl shadow-warm-2xl border border-amber-500/30 overflow-hidden backdrop-blur-xl">
        
        {/* Glowing Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-terracotta-500 via-amber-400 to-sage-400"></div>

        {/* Header Bar */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-warmgray-800/80 bg-warmgray-950/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-terracotta-600 to-amber-500 flex items-center justify-center shadow-glow-terracotta">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-sm text-cream-100 line-clamp-1">
                  {activeRecipe?.title || recipe.title}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-terracotta-900/60 text-terracotta-300 border border-terracotta-500/40">
                  AI Voice
                </span>
              </div>
              <p className="text-[11px] text-warmgray-400 font-medium">
                {isPlaying 
                  ? t('voiceSpeaking', voiceLang) 
                  : isPaused 
                    ? t('voicePaused', voiceLang) 
                    : t('voiceChefStudio', voiceLang)}
              </p>
            </div>
          </div>

          {/* Right Header Controls: Language, Hands-Free Mic, Minimize, Close */}
          <div className="flex items-center gap-2">
            
            {/* Language Selector Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-warmgray-800/80 border border-warmgray-700 text-xs font-bold text-amber-300 hover:border-amber-500/50 cursor-pointer transition-all">
                <Languages className="w-3.5 h-3.5" />
                <span>{VOICE_LANGUAGES.find(l => l.code === voiceLang)?.flag}</span>
                <span className="hidden sm:inline">{VOICE_LANGUAGES.find(l => l.code === voiceLang)?.native}</span>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-warmgray-900 border border-warmgray-700 rounded-2xl shadow-warm-xl p-1.5 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] uppercase font-bold text-warmgray-400 px-2 py-1">
                  {t('voiceLangSelect', voiceLang)}
                </div>
                {VOICE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleChangeLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      voiceLang === lang.code
                        ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white font-bold'
                        : 'text-warmgray-300 hover:bg-warmgray-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.native}</span>
                    </span>
                    <span className="text-[10px] opacity-70">({lang.name})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hands-Free Voice Mic Toggle */}
            <button
              type="button"
              onClick={handleToggleHandsFree}
              className={`p-2 rounded-xl border transition-all btn-push flex items-center gap-1 text-xs font-bold ${
                isHandsFree
                  ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                  : 'bg-warmgray-800/80 border-warmgray-700 text-warmgray-300 hover:text-white'
              }`}
              title={isHandsFree ? 'Voice commands active (listening)' : 'Enable hands-free voice commands'}
            >
              {isHandsFree ? <Mic className="w-3.5 h-3.5 text-red-400" /> : <MicOff className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isHandsFree ? 'Hands-Free ON' : 'Hands-Free'}</span>
            </button>

            {/* Expand / Collapse Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-warmgray-800/80 hover:bg-warmgray-700 text-warmgray-300 transition-colors"
              title={isExpanded ? 'Minimize Player' : 'Expand Player'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                handleStop();
                if (onClose) onClose();
              }}
              className="p-2 rounded-xl bg-warmgray-800/80 hover:bg-red-500/20 hover:text-red-400 text-warmgray-400 transition-colors"
              title="Close Voice Studio"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Expanded Content View */}
        {isExpanded && (
          <div className="p-4 sm:p-5 space-y-4">
            
            {/* Mode Selector Tabs */}
            <div className="flex items-center justify-between gap-2 border-b border-warmgray-800/60 pb-3">
              <div className="flex items-center gap-1.5 p-1 bg-warmgray-950/60 rounded-2xl border border-warmgray-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMode('full')}
                  className={`px-3 py-1 rounded-xl transition-all font-semibold ${
                    activeMode === 'full'
                      ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white shadow-sm'
                      : 'text-warmgray-400 hover:text-warmgray-200'
                  }`}
                >
                  {t('voiceListenRecipe', voiceLang)}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('ingredients')}
                  className={`px-3 py-1 rounded-xl transition-all font-semibold ${
                    activeMode === 'ingredients'
                      ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white shadow-sm'
                      : 'text-warmgray-400 hover:text-warmgray-200'
                  }`}
                >
                  {t('voiceListenIngredients', voiceLang)}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('steps')}
                  className={`px-3 py-1 rounded-xl transition-all font-semibold ${
                    activeMode === 'steps'
                      ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white shadow-sm'
                      : 'text-warmgray-400 hover:text-warmgray-200'
                  }`}
                >
                  {t('voiceListenInstructions', voiceLang)}
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[11px] text-warmgray-400 mr-1 hidden sm:inline">
                  {t('voiceSpeed', voiceLang)}:
                </span>
                {[0.8, 1.0, 1.25].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSpeedChange(s)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                      speed === s
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                        : 'bg-warmgray-800 text-warmgray-400 hover:text-warmgray-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Teleprompter Display Box with Audio Waves */}
            <div className="relative bg-warmgray-950/80 rounded-2xl p-4 border border-warmgray-800 min-h-[90px] flex flex-col justify-between overflow-hidden">
              
              {/* Spoken Label & Step Counter */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-amber-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentPhrase?.label || 'AI Narration'}
                </span>
                <span className="text-warmgray-400">
                  {currentPhraseIndex + 1} / {phrases.length}
                </span>
              </div>

              {/* Spoken Text Sentence */}
              <p 
                ref={teleprompterRef}
                className="text-sm sm:text-base font-medium text-cream-100 leading-relaxed transition-all"
              >
                {currentPhrase?.text || 'Click play to start AI culinary voice walkthrough...'}
              </p>

              {/* Live Audio Visualizer Wave Animation */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-warmgray-800/60">
                <div className="flex items-center gap-1 h-4">
                  {[40, 75, 100, 60, 90, 45, 80, 100, 65, 30].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPlaying && !isPaused
                          ? 'bg-gradient-to-t from-terracotta-500 to-amber-400 animate-pulse'
                          : 'bg-warmgray-700 h-1.5'
                      }`}
                      style={{
                        height: isPlaying && !isPaused ? `${Math.max(4, (h * (i % 2 === 0 ? 1 : 0.75)) / 4)}px` : '4px',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>

                {isHandsFree && (
                  <div className="text-[10px] text-amber-300/80 flex items-center gap-1">
                    <Mic className="w-3 h-3 text-red-400 animate-pulse" />
                    <span>{lastHeardCommand ? `Heard: "${lastHeardCommand.text}"` : t('voiceListening', voiceLang)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Playback Bar Controls */}
            <div className="flex items-center justify-between pt-1">
              
              {/* Prev / Restart */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRepeatPhrase}
                  className="p-2.5 rounded-2xl bg-warmgray-800 hover:bg-warmgray-700 text-warmgray-300 transition-colors btn-push"
                  title="Repeat current step"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrevPhrase}
                  disabled={currentPhraseIndex === 0}
                  className="p-2.5 rounded-2xl bg-warmgray-800 hover:bg-warmgray-700 text-warmgray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors btn-push"
                  title="Previous phrase"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Big Play / Pause Button */}
              <button
                type="button"
                onClick={isPlaying && !isPaused ? handlePause : handlePlay}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-amber-500 text-white font-bold shadow-glow-terracotta flex items-center gap-2.5 hover:scale-105 transition-all btn-push"
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-5 h-5 fill-white" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>{isPaused ? 'Resume' : 'Start AI Voice'}</span>
                  </>
                )}
              </button>

              {/* Next / Cooking Mode Jump */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNextPhrase}
                  disabled={currentPhraseIndex >= phrases.length - 1}
                  className="p-2.5 rounded-2xl bg-warmgray-800 hover:bg-warmgray-700 text-warmgray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors btn-push"
                  title="Next phrase"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {onOpenCookingMode && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStop();
                      onOpenCookingMode(recipe);
                    }}
                    className="p-2.5 rounded-2xl bg-sage-800/80 hover:bg-sage-700 border border-sage-500/40 text-sage-200 transition-colors btn-push flex items-center gap-1 text-xs font-bold"
                    title="Launch Interactive Hands-Free Cooking Mode"
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Cook Mode</span>
                  </button>
                )}
              </div>

            </div>

            {/* Hands Free Voice Command Tip Bar */}
            {isHandsFree && (
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-[11px] text-amber-200/90 font-medium">
                💡 {t('voiceCommandsTip', voiceLang)}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
