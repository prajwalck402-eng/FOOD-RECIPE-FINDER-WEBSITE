import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  Utensils, 
  Plus, 
  Flame, 
  Award, 
  ChefHat, 
  Mic, 
  MicOff, 
  Languages,
  Globe2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { culinaryAudio } from '../utils/audio';
import { aiVoiceEngine, VOICE_LANGUAGES } from '../utils/aiVoiceEngine';
import { recipeTranslator } from '../utils/recipeTranslator';
import { t } from '../utils/i18n';

export default function CookingModeModal({ recipe, onClose, currentLanguage = 'en' }) {
  if (!recipe) return null;

  const [activeLang, setActiveLang] = useState(currentLanguage || 'en');
  const [translatedRecipe, setTranslatedRecipe] = useState(recipe);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [lastHeardCommand, setLastHeardCommand] = useState(null);

  // Sync translated recipe whenever language or recipe changes
  useEffect(() => {
    let isMounted = true;
    const loadTranslation = async () => {
      if (activeLang === 'en') {
        setTranslatedRecipe(recipe);
        return;
      }
      setIsTranslating(true);
      try {
        const trans = await recipeTranslator.translateRecipe(recipe, activeLang);
        if (isMounted && trans) {
          setTranslatedRecipe(trans);
        }
      } catch (err) {
        console.warn('Cooking mode translation error:', err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    loadTranslation();
    aiVoiceEngine.setLanguage(activeLang);

    return () => {
      isMounted = false;
    };
  }, [recipe, activeLang]);

  // Normalize instructions into structured objects from translated recipe
  const rawInstructions = translatedRecipe?.instructions || recipe.instructions || [];
  const normalizedSteps = rawInstructions.length > 0
    ? rawInstructions.map((step, idx) => {
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
      })
    : [
        {
          stepNumber: 1,
          instruction: `Prep all ingredients for ${translatedRecipe.title || recipe.title}: wash produce, measure seasonings, and preheat cookware.`,
          durationMinutes: 5,
          chefTip: 'Having all ingredients pre-measured (mise en place) ensures a stress-free cooking process.'
        },
        {
          stepNumber: 2,
          instruction: `Cook ${translatedRecipe.title || recipe.title} following standard culinary heat control until fragrant and cooked through.`,
          durationMinutes: Number(recipe.cookTime || 15),
          chefTip: 'Taste and adjust seasoning with salt, pepper, or fresh herbs as needed.'
        },
        {
          stepNumber: 3,
          instruction: `Plate ${translatedRecipe.title || recipe.title} warmly, garnish with fresh herbs, and serve immediately.`,
          durationMinutes: 2,
          chefTip: recipe.chefSecret || 'Serve on warmed plates for the best dining experience.'
        }
      ];

  // Timer states
  const totalSteps = normalizedSteps.length;
  const currentStep = normalizedSteps[currentStepIndex] || normalizedSteps[0];
  const stepDurationMinutes = currentStep?.durationMinutes || 0;
  
  const [timerSeconds, setTimerSeconds] = useState(stepDurationMinutes > 0 ? stepDurationMinutes * 60 : 300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  const isLastStep = currentStepIndex === totalSteps - 1;

  // Subscribe to voice state updates
  useEffect(() => {
    const unsubscribe = aiVoiceEngine.subscribe((state) => {
      if (state.isPlaying !== undefined) setIsSpeaking(state.isPlaying);
    });

    return () => {
      unsubscribe();
      aiVoiceEngine.stop();
      aiVoiceEngine.stopListening();
    };
  }, []);

  // Voice Command Handler
  const handleVoiceCommand = (command, rawText) => {
    culinaryAudio.playTick();
    setLastHeardCommand({ command, text: rawText });
    setTimeout(() => setLastHeardCommand(null), 3000);

    if (command === 'next') {
      handleNextStep();
    } else if (command === 'prev') {
      handlePrevStep();
    } else if (command === 'repeat') {
      speakStep(currentStep);
    } else if (command === 'pause') {
      aiVoiceEngine.pause();
    } else if (command === 'resume') {
      aiVoiceEngine.resume();
    } else if (command === 'timer') {
      setIsTimerRunning(true);
    }
  };

  // Toggle Hands-Free Microphone Listener
  const handleToggleHandsFree = () => {
    culinaryAudio.playTick();
    if (isHandsFree) {
      aiVoiceEngine.stopListening();
      setIsHandsFree(false);
    } else {
      const started = aiVoiceEngine.startListening(handleVoiceCommand);
      if (started) {
        setIsHandsFree(true);
      }
    }
  };

  // Speak Step in current native language
  const speakStep = (stepObj) => {
    if (!voiceEnabled || !stepObj) return;

    const stepNum = currentStepIndex + 1;
    const stepText = stepObj.instruction || '';
    const tipText = stepObj.chefTip ? stepObj.chefTip : '';
    const timerNotice = stepObj.durationMinutes > 0 ? ` Timer: ${stepObj.durationMinutes} minutes.` : '';

    let formattedText = `Step ${stepNum} of ${totalSteps}. ${stepText}${stepObj.chefTip ? ` Chef Tip: ${tipText}` : ''}`;

    if (activeLang === 'hi') {
      formattedText = `चरण ${stepNum} (कुल ${totalSteps}): ${stepText}. ${tipText ? `शेफ का सुझाव: ${tipText}` : ''}`;
    } else if (activeLang === 'kn') {
      formattedText = `ಹಂತ ${stepNum} (${totalSteps} ರಲ್ಲಿ): ${stepText}. ${tipText ? `ಬಾಣಸಿಗರ ಸಲಹೆ: ${tipText}` : ''}`;
    } else if (activeLang === 'te') {
      formattedText = `దశ ${stepNum} (${totalSteps} లో): ${stepText}. ${tipText ? `చెఫ్ చిట్కా: ${tipText}` : ''}`;
    }

    aiVoiceEngine.speak(formattedText, activeLang, { rate: speed });
  };

  // Sync timer & voice when step changes or language switches
  useEffect(() => {
    if (currentStepIndex < totalSteps) {
      const mins = currentStep?.durationMinutes || 0;
      setTimerSeconds(mins > 0 ? mins * 60 : 300);
      setIsTimerRunning(false);
      setTimerFinished(false);

      if (voiceEnabled && currentStep) {
        speakStep(currentStep);
      }
    }

    return () => {
      aiVoiceEngine.stop();
    };
  }, [currentStepIndex, translatedRecipe, activeLang, voiceEnabled]);

  // Timer countdown loop
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerFinished(true);
      culinaryAudio.playTimerAlarm();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleToggleVoice = () => {
    culinaryAudio.playTick();
    if (isSpeaking) {
      aiVoiceEngine.stop();
      setVoiceEnabled(false);
    } else if (voiceEnabled) {
      setVoiceEnabled(false);
      aiVoiceEngine.stop();
    } else {
      setVoiceEnabled(true);
      if (currentStep) {
        speakStep(currentStep);
      }
    }
  };

  const handleNextStep = () => {
    culinaryAudio.playStepChime();
    if (isLastStep) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#E25C34', '#F5B718', '#5F805B', '#FFFFFF'],
      });
      setCurrentStepIndex(totalSteps); // Finish screen
      if (voiceEnabled) {
        const outro = activeLang === 'hi' ? 'शानदार! आपका व्यंजन पूरी तरह तैयार है! आनंद लीजिए!' :
                      activeLang === 'kn' ? 'ಅದ್ಭುತ! ನಿಮ್ಮ ರುಚಿಕರ ಅಡುಗೆ ಸಿದ್ಧವಾಗಿದೆ! ಬಿಸಿಯಾಗಿ ಸವಿಯಿರಿ!' :
                      activeLang === 'te' ? 'అద్భుతం! మీ రుచికరమైన వంటకం సిద్ధమైంది! వేడిగా ఆస్వాదించండి!' :
                      'Magnifique! Your dish is complete and ready to savor!';
        aiVoiceEngine.speak(outro, activeLang);
      }
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    culinaryAudio.playTick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleChangeLanguage = (newLang) => {
    culinaryAudio.playTick();
    setActiveLang(newLang);
    aiVoiceEngine.setLanguage(newLang);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addExtraMinute = () => {
    culinaryAudio.playTick();
    setTimerSeconds(prev => prev + 60);
    setTimerFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream-50 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      
      {/* Top Controls Bar */}
      <div className="glass-panel px-4 sm:px-6 py-3.5 border-b border-cream-200 flex flex-wrap items-center justify-between gap-3 shadow-warm-sm">
        
        {/* Recipe Title & Step Count */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-terracotta-600 to-amber-500 text-white flex items-center justify-center shadow-warm-sm flex-shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-warmgray-950 line-clamp-1">
              {translatedRecipe.title || recipe.title}
            </h2>
            <p className="text-xs text-warmgray-500 font-semibold">
              {activeLang === 'hi' ? `चरण ${Math.min(currentStepIndex + 1, totalSteps)} (कुल ${totalSteps})` :
               activeLang === 'kn' ? `ಹಂತ ${Math.min(currentStepIndex + 1, totalSteps)} (${totalSteps} ರಲ್ಲಿ)` :
               activeLang === 'te' ? `దశ ${Math.min(currentStepIndex + 1, totalSteps)} (${totalSteps} లో)` :
               `Step ${Math.min(currentStepIndex + 1, totalSteps)} of ${totalSteps}`}
            </p>
          </div>
        </div>

        {/* Action Controls: Prominent Multilingual Language Switcher, Hands-Free Mic, Voice Toggle, Close */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          {/* Prominent Language Bar: 🇬🇧 EN | 🇮🇳 हिन्दी | 🇮🇳 ಕನ್ನಡ | 🇮🇳 తెలుగు */}
          <div className="flex items-center p-1 bg-white/90 border border-cream-300 rounded-2xl shadow-xs gap-1">
            {VOICE_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleChangeLanguage(lang.code)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeLang === lang.code
                    ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white shadow-warm-xs scale-102'
                    : 'text-warmgray-700 hover:bg-cream-100 hover:text-warmgray-900'
                }`}
                title={`Switch recipe & voice to ${lang.name}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.native}</span>
              </button>
            ))}
          </div>

          {/* Hands-Free Voice Mic Toggle */}
          <button
            type="button"
            onClick={handleToggleHandsFree}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs btn-push ${
              isHandsFree
                ? 'bg-red-500 text-white animate-pulse shadow-glow-terracotta'
                : 'bg-white text-warmgray-700 border border-cream-300 hover:bg-cream-100'
            }`}
            title={isHandsFree ? 'Voice commands active (listening)' : 'Enable hands-free voice commands'}
          >
            {isHandsFree ? <Mic className="w-3.5 h-3.5 text-white" /> : <MicOff className="w-3.5 h-3.5 text-warmgray-400" />}
            <span className="hidden sm:inline">{isHandsFree ? 'Hands-Free ON' : 'Hands-Free'}</span>
          </button>

          {/* Voice Narration Toggle Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs btn-push ${
              isSpeaking
                ? 'bg-amber-400 text-amber-950 animate-pulse'
                : voiceEnabled
                ? 'bg-cream-100 text-warmgray-800 border border-cream-300 hover:bg-cream-200'
                : 'bg-warmgray-100 text-warmgray-400 border border-cream-200'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-terracotta-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Speaking...' : voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>

          {/* Close Cooking Mode */}
          <button
            type="button"
            onClick={() => {
              aiVoiceEngine.stop();
              aiVoiceEngine.stopListening();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-warmgray-100 hover:bg-warmgray-200 text-warmgray-700 transition-all btn-push"
            title="Exit Cooking Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Progress Line */}
      <div className="w-full bg-cream-200 h-1.5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-terracotta-600 via-amber-500 to-sage-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Hands-Free Voice Command Alert Banner */}
      {isHandsFree && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 py-1.5 px-4 flex items-center justify-center gap-2 text-xs font-bold text-amber-900">
          <Mic className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>
            {lastHeardCommand 
              ? `Command recognized: "${lastHeardCommand.text}"`
              : t('voiceCommandsTip', activeLang)}
          </span>
        </div>
      )}

      {/* Main Focus Center */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center overflow-y-auto">
        
        {currentStepIndex >= totalSteps ? (
          /* Finished Screen */
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 mx-auto rounded-full bg-sage-100 text-sage-700 flex items-center justify-center shadow-warm-lg">
              <Award className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-warmgray-900">
                {activeLang === 'hi' ? 'शानदार! व्यंजन बनकर तैयार है!' :
                 activeLang === 'kn' ? 'ಅದ್ಭುತ! ಅಡುಗೆ ಸಂಪೂರ್ಣ ಸಿದ್ಧವಾಗಿದೆ!' :
                 activeLang === 'te' ? 'అద్భుతం! వంటకం పూర్తయింది!' :
                 'Magnifique! Dish Completed!'}
              </h2>
              <p className="text-sm sm:text-base text-warmgray-600 font-medium max-w-md mx-auto">
                <span className="font-bold text-terracotta-700">{translatedRecipe.title || recipe.title}</span> is ready to plate, garnish, and savor. Bon appétit!
              </p>
            </div>

            {recipe.chefSecret && (
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium text-left">
                <strong>Plating Note: </strong> {recipe.chefSecret}
              </div>
            )}

            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-600 to-amber-600 text-white font-bold text-sm shadow-warm-md hover:shadow-glow-terracotta transition-all btn-push"
              >
                Back to Kitchen
              </button>
            </div>
          </div>
        ) : (
          /* Active Step View */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Step Number Badge & Live Audio Waves */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-terracotta-100 border border-terracotta-200 text-terracotta-800 font-extrabold text-sm uppercase tracking-wider">
                  {activeLang === 'hi' ? `चरण ${currentStep.stepNumber || currentStepIndex + 1}` :
                   activeLang === 'kn' ? `ಹಂತ ${currentStep.stepNumber || currentStepIndex + 1}` :
                   activeLang === 'te' ? `దశ ${currentStep.stepNumber || currentStepIndex + 1}` :
                   `Step ${currentStep.stepNumber || currentStepIndex + 1}`}
                </span>
                <span className="text-xs text-warmgray-500 font-bold uppercase tracking-wider">
                  {totalSteps - currentStepIndex - 1} {activeLang === 'hi' ? 'चरण शेष' : activeLang === 'kn' ? 'ಹಂತಗಳು ಬಾಕಿ' : activeLang === 'te' ? 'దశలు మిగిలి ఉన్నాయి' : 'steps remaining'}
                </span>
              </div>

              {/* Visualizer Wave when speaking */}
              {isSpeaking && (
                <div className="flex items-center gap-1.5 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                  <span className="text-xs font-extrabold text-amber-950">
                    {VOICE_LANGUAGES.find(l => l.code === activeLang)?.native} AI Voice
                  </span>
                  <div className="flex items-center gap-1 h-3.5">
                    {[40, 80, 100, 60, 90, 45, 80].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-terracotta-600 rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(4, h / 6)}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Translation loading banner */}
            {isTranslating && (
              <div className="flex items-center gap-2 text-xs font-bold text-terracotta-700 bg-terracotta-50 border border-terracotta-200 px-3.5 py-1.5 rounded-full animate-pulse w-fit shadow-xs">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-terracotta-600" />
                <span>
                  {activeLang === 'kn' ? 'ಕನ್ನಡಕ್ಕೆ AI ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...' :
                   activeLang === 'te' ? 'తెలుగులోకి AI అనువదిస్తోంది...' :
                   activeLang === 'hi' ? 'हिन्दी में AI अनुवाद हो रहा है...' :
                   'Translating recipe with AI...'}
                </span>
              </div>
            )}

            {/* Huge Step Instruction in native language (Kannada, Telugu, Hindi, or English) */}
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-warmgray-950 leading-snug">
              {currentStep.instruction}
            </h3>

            {/* Chef Tip for this step */}
            {currentStep.chefTip && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-xs">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                  <span className="font-bold">
                    {activeLang === 'hi' ? 'मास्टर शेफ सुझाव: ' :
                     activeLang === 'kn' ? 'ಮಾಸ್ಟರ್ ಬಾಣಸಿಗರ ಸಲಹೆ: ' :
                     activeLang === 'te' ? 'మాస్టర్ చెఫ్ చిట్కా: ' :
                     'Master Chef Tip: '}
                  </span>
                  {currentStep.chefTip}
                </div>
              </div>
            )}

            {/* Step Timer */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-cream-300 shadow-warm-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  timerFinished
                    ? 'bg-red-100 text-red-700 animate-bounce'
                    : isTimerRunning
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-cream-100 text-warmgray-700'
                }`}>
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-warmgray-500">
                    {activeLang === 'hi' ? 'स्टेप टाइमर' : activeLang === 'kn' ? 'ಹಂತದ ಟೈಮರ್' : activeLang === 'te' ? 'స్టెప్ టైమర్' : 'Step Timer'} {stepDurationMinutes > 0 ? `(${stepDurationMinutes}m recommended)` : ''}
                  </div>
                  <div className={`font-mono text-3xl sm:text-4xl font-extrabold ${
                    timerFinished ? 'text-red-600 animate-pulse' : 'text-warmgray-900'
                  }`}>
                    {formatTime(timerSeconds)}
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    culinaryAudio.playTick();
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-warm-sm transition-all btn-push ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-terracotta-600 hover:bg-terracotta-700 text-white'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>{activeLang === 'hi' ? 'रोकें' : activeLang === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : activeLang === 'te' ? 'పాజ్' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{activeLang === 'hi' ? 'टाइमर शुरू करें' : activeLang === 'kn' ? 'ಟೈಮರ್ ಪ್ರಾರಂಭಿಸಿ' : activeLang === 'te' ? 'టైమర్ ప్రారంభించండి' : 'Start Timer'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    culinaryAudio.playTick();
                    setTimerSeconds(stepDurationMinutes > 0 ? stepDurationMinutes * 60 : 300);
                    setIsTimerRunning(false);
                    setTimerFinished(false);
                  }}
                  className="p-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-warmgray-700 transition-all btn-push"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={addExtraMinute}
                  className="px-3 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-warmgray-700 font-bold text-xs transition-all btn-push"
                  title="Add 1 Minute"
                >
                  +1m
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Step Navigation Bar */}
      {currentStepIndex < totalSteps && (
        <div className="glass-panel px-6 py-5 border-t border-cream-200 flex items-center justify-between shadow-warm-lg">
          
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={handlePrevStep}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all btn-push ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-warmgray-400 bg-cream-100'
                : 'bg-white hover:bg-cream-100 text-warmgray-800 border border-cream-300 shadow-xs'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{activeLang === 'hi' ? 'पिछला' : activeLang === 'kn' ? 'ಹಿಂದಿನ ಹಂತ' : activeLang === 'te' ? 'మునుపటి దశ' : 'Previous'}</span>
          </button>

          {/* Repeat Current Step Audio Button */}
          <button
            type="button"
            onClick={() => speakStep(currentStep)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-cream-100 hover:bg-cream-200 text-warmgray-800 font-extrabold text-xs transition-all btn-push border border-cream-300"
          >
            <Volume2 className="w-4 h-4 text-terracotta-600" />
            <span>{activeLang === 'hi' ? 'दोहराएं (आवाज़)' : activeLang === 'kn' ? 'ಮತ್ತೆ ಕೇಳಿ (ವಾಯ್ಸ್)' : activeLang === 'te' ? 'మళ్ళీ వినండి (వాయిస్)' : 'Repeat Audio'}</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-warm-lg hover:shadow-glow-terracotta transition-all btn-push"
          >
            <span>
              {isLastStep 
                ? (activeLang === 'hi' ? 'पूरा करें और परोसें' : activeLang === 'kn' ? 'ಅಡುಗೆ ಮುಕ್ತಾಯಗೊಳಿಸಿ' : activeLang === 'te' ? 'పూర్తి చేయండి' : 'Complete & Plate Dish')
                : (activeLang === 'hi' ? 'अगला कदम' : activeLang === 'kn' ? 'ಮುಂದಿನ ಹಂತ' : activeLang === 'te' ? 'తర్వాతి దశ' : 'Next Step')}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>
      )}

    </div>
  );
}
