// Multilingual AI Voice Engine for Master Chef Recipe
// Full Speech Synthesis (TTS) & Speech Recognition (STT) for:
// 1. English (en) - en-IN / en-US
// 2. Hindi (hi) - hi-IN (हिन्दी)
// 3. Kannada (kn) - kn-IN (ಕನ್ನಡ)
// 4. Telugu (te) - te-IN (తెలుగు)

export const VOICE_LANGUAGES = [
  { code: 'en', bcp47: 'en-IN', name: 'English', native: 'English', flag: '🇬🇧', label: 'English (AI Chef)' },
  { code: 'hi', bcp47: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', label: 'हिन्दी (AI शेफ)' },
  { code: 'kn', bcp47: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', label: 'ಕನ್ನಡ (AI ಬಾಣಸಿಗ)' },
  { code: 'te', bcp47: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', label: 'తెలుగు (AI చెఫ్)' },
];

export const VOICE_COMMANDS = {
  en: {
    next: ['next', 'next step', 'forward', 'proceed', 'go next', 'continue'],
    prev: ['previous', 'prev', 'back', 'go back', 'last step'],
    repeat: ['repeat', 'say again', 'repeat step', 'read again', 'what was that', 'one more time'],
    pause: ['pause', 'stop', 'hold on', 'wait', 'quiet', 'silence', 'mute'],
    resume: ['resume', 'play', 'continue reading', 'start'],
    timer: ['timer', 'start timer', 'set timer', 'start the timer'],
    ingredients: ['ingredients', 'read ingredients', 'what ingredients', 'list ingredients'],
  },
  hi: {
    next: ['अगला', 'आगे', 'अगला कदम', 'अगला स्टेप', 'आगे बढ़ो', 'नेक्स्ट'],
    prev: ['पिछला', 'पीछे', 'पिछला कदम', 'वापस', 'बैक'],
    repeat: ['दोहराएं', 'दोहराओ', 'फिर से बोलो', 'फिर से पढ़ो', 'रिपीट'],
    pause: ['रुको', 'रुकिए', 'पॉज़', 'स्टॉप', 'चुप', 'बंद करो'],
    resume: ['शुरू करो', 'चालू करो', 'आगे बोलो', 'प्ले'],
    timer: ['टाइमर', 'टाइमर शुरू करो', 'टाइमर लगाओ', 'घड़ी शुरू करो'],
    ingredients: ['सामग्री', 'सामग्री पढ़ो', 'क्या सामग्री चाहिए', 'इंग्रीडिएंट्स'],
  },
  kn: {
    next: ['ಮುಂದೆ', 'ಮುಂದಿನ ಹಂತ', 'ಮುಂದಕ್ಕೆ ಹೋಗಿ', 'ನೆಕ್ಸ್ಟ್', 'ಮುಂದಿನ ಸ್ಟೆಪ್'],
    prev: ['ಹಿಂದೆ', 'ಹಿಂದಿನ ಹಂತ', 'ಹಿಂದಕ್ಕೆ', 'ಬ್ಯಾಕ್'],
    repeat: ['ಮತ್ತೆ ಹೇಳಿ', 'ಪುನರಾವರ್ತಿಸಿ', 'ಮತ್ತೊಮ್ಮೆ', 'ಮತ್ತೆ ಓದಿ', 'ರಿಪೀಟ್'],
    pause: ['ನಿಲ್ಲಿಸಿ', 'ತಾಳಿ', 'ಸ್ಟಾಪ್', 'ಪಾಸ್', 'ಸ್ವಲ್ಪ ನಿಲ್ಲಿಸಿ'],
    resume: ['ಮುಂದುವರಿಸಿ', 'ಪ್ರಾರಂಭಿಸಿ', 'ಪ್ಲೇ'],
    timer: ['ಟೈಮರ್', 'ಟೈಮರ್ ಪ್ರಾರಂಭಿಸಿ', 'ಟೈಮರ್ ಹಾಕಿ', 'ಸಮಯ ಪ್ರಾರಂಭಿಸಿ'],
    ingredients: ['ಪದಾರ್ಥಗಳು', 'ಪದಾರ್ಥಗಳನ್ನು ಓದಿ', 'ಯಾವ ಸಾಮಗ್ರಿಗಳು ಬೇಕು'],
  },
  te: {
    next: ['తర్వాత', 'తరవాత', 'తర్వాతి దశ', 'తర్వాతి స్టెప్', 'ముందుకు', 'నెక్స్ట్'],
    prev: ['మునుపటి', 'వెనుక', 'వెనక్కి', 'మునుపటి దశ', 'బ్యాక్'],
    repeat: ['మళ్ళీ చెప్పు', 'మళ్ళీ చదువు', 'రిపీట్', 'మరోసారి'],
    pause: ['ఆపు', 'ఆపండి', 'పాజ్', 'స్టాప్', 'కాసేపు ఆగు'],
    resume: ['మొదలు పెట్టు', 'కొనసాగించు', 'ప్లే'],
    timer: ['టైమర్', 'టైమర్ స్టార్ట్', 'సమయం మొదలుపెట్టు', 'టైమర్ పెట్టు'],
    ingredients: ['పదార్థాలు', 'పదార్థాలు చదువు', 'కావలసిన పదార్థాలు'],
  }
};

// Regional phrase templates for instant on-device narration without waiting for API
const CULINARY_SPOKEN_TEMPLATES = {
  en: {
    intro: (title, cuisine) => `Welcome Chef! Let's cook ${title}, a mouthwatering ${cuisine || 'gourmet'} specialty.`,
    ingredientsIntro: (count) => `Here are the ${count} ingredients you will need.`,
    stepIntro: (num, total) => `Step ${num} of ${total}:`,
    chefTipPrefix: "Chef Secret:",
    timerNotice: (mins) => `Set a timer for ${mins} minutes.`,
    outro: "Your dish is ready! Garnish warmly, plate beautifully, and enjoy your meal!",
  },
  hi: {
    intro: (title, cuisine) => `नमस्ते शेफ! आइए बनाते हैं बेहद स्वादिष्ट ${title}.`,
    ingredientsIntro: (count) => `इसके लिए आपको कुल ${count} सामग्रियों की आवश्यकता होगी.`,
    stepIntro: (num, total) => `चरण ${num} (कुल ${total}):`,
    chefTipPrefix: "शेफ का सीक्रेट सुझाव:",
    timerNotice: (mins) => `इसके लिए ${mins} मिनट का टाइमर सेट करें.`,
    outro: "शानदार! आपका पकवान परोसने के लिए बिल्कुल तैयार है. आनंद लीजिए!",
  },
  kn: {
    intro: (title, cuisine) => `ನಮಸ್ಕಾರ ಬಾಣಸಿಗರೇ! ಬನ್ನಿ ರುಚಿಕರವಾದ ${title} ಮಾಡೋಣ.`,
    ingredientsIntro: (count) => `ಇದಕ್ಕಾಗಿ ಬೇಕಾಗುವ ${count} ಮುಖ್ಯ ಪದಾರ್ಥಗಳು.`,
    stepIntro: (num, total) => `ಹಂತ ${num} (${total} ರಲ್ಲಿ):`,
    chefTipPrefix: "ಬಾಣಸಿಗರ ವಿಶೇಷ ಸಲಹೆ:",
    timerNotice: (mins) => `${mins} ನಿಮಿಷಗಳ ಟೈಮರ್ ಹೊಂದಿಸಿ.`,
    outro: "ಅದ್ಭುತ! ನಿಮ್ಮ ರುಚಿಕರ ಅಡುಗೆ ಸಿದ್ಧವಾಗಿದೆ. ಬಿಸಿಯಾಗಿ ಸವಿಯಿರಿ!",
  },
  te: {
    intro: (title, cuisine) => `నమస్కారం చెఫ్! రండి కమ్మనైన ${title} తయారుచేసుకుందాం.`,
    ingredientsIntro: (count) => `దీనికి అవసరమైన ${count} ముఖ్య పదార్థాలు ఇక్కడ ఉన్నాయి.`,
    stepIntro: (num, total) => `దశ ${num} (${total} లో):`,
    chefTipPrefix: "చెఫ్ ప్రత్యేక చిట్కా:",
    timerNotice: (mins) => `${mins} నిమిషాల సమయం సెట్ చేయండి.`,
    outro: "అద్భుతం! మీ రుచికరమైన వంటకం తయారైంది. వేడిగా ఆస్వాదించండి!",
  }
};

class AiVoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentLanguage = 'en';
    this.rate = 1.0; // 0.8 to 1.3
    this.pitch = 1.0;
    this.volume = 1.0;
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;

    // Recognition
    this.recognition = null;
    this.isListening = false;
    this.onCommandCallback = null;
    this.onTranscriptCallback = null;

    // State listener callbacks
    this.listeners = new Set();

    // Cache translated scripts to prevent re-fetching
    this.narrationCache = new Map();

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined' && 'onvoiceschanged' in this.synth) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }

    this.initRecognition();
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
  }

  getAvailableVoices() {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  // Find the most authentic voice for language
  findBestVoice(langCode) {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    const target = VOICE_LANGUAGES.find(l => l.code === langCode);
    const bcp = target ? target.bcp47.toLowerCase() : 'en-in';

    // 1. Direct BCP-47 / language prefix or native name match
    const exactMatches = voices.filter(v => {
      if (!v.lang) return false;
      const vl = v.lang.toLowerCase().replace('_', '-');
      const vn = (v.name || '').toLowerCase();
      if (vl === bcp || vl.startsWith(langCode + '-')) return true;
      if (langCode === 'kn' && (vl.includes('kn') || vn.includes('kannada') || vn.includes('sapna') || vn.includes('gagan'))) return true;
      if (langCode === 'te' && (vl.includes('te') || vn.includes('telugu') || vn.includes('mohan') || vn.includes('shruti'))) return true;
      if (langCode === 'hi' && (vl.includes('hi') || vn.includes('hindi') || vn.includes('swara') || vn.includes('madhur') || vn.includes('hemant') || vn.includes('kalpana'))) return true;
      if (langCode === 'en' && (vl === 'en-in' || vl.startsWith('en') || vn.includes('indian') || vn.includes('neerja') || vn.includes('prabhat'))) return true;
      return false;
    });

    if (exactMatches.length > 0) {
      // Prioritize natural / online / neural voices
      const naturalVoice = exactMatches.find(v => {
        const vn = (v.name || '').toLowerCase();
        return vn.includes('google') || 
               vn.includes('natural') || 
               vn.includes('online') ||
               vn.includes('neural') ||
               vn.includes('swara') ||
               vn.includes('hemant') ||
               vn.includes('madhur') ||
               vn.includes('kavya') ||
               vn.includes('shruti') ||
               vn.includes('mohan') ||
               vn.includes('sapna') ||
               vn.includes('gagan');
      });
      return naturalVoice || exactMatches[0];
    }

    // For English, fallback to Indian English or first available English voice
    if (langCode === 'en') {
      const indianEnglish = voices.find(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('en-in'));
      if (indianEnglish) return indianEnglish;
      return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) || voices[0] || null;
    }

    // For Indic languages (Kannada, Telugu, Hindi), if no explicit voice object is found,
    // do NOT set an English voice object, returning null allows the browser's native Indic synthesizer
    // to render the utterance with utterance.lang correctly.
    return null;
  }

  // Subscribe to voice state updates (speaking, paused, stopped, active step)
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyState(state) {
    this.listeners.forEach(cb => {
      try {
        cb(state);
      } catch (e) {
        console.error('Error in VoiceEngine state listener:', e);
      }
    });
  }

  setRate(newRate) {
    this.rate = Math.max(0.6, Math.min(1.6, Number(newRate) || 1.0));
  }

  setPitch(newPitch) {
    this.pitch = Math.max(0.5, Math.min(1.5, Number(newPitch) || 1.0));
  }

  setVolume(newVolume) {
    this.volume = Math.max(0, Math.min(1.0, Number(newVolume) || 1.0));
  }

  setLanguage(langCode) {
    if (VOICE_LANGUAGES.some(l => l.code === langCode)) {
      this.currentLanguage = langCode;
      if (this.recognition && this.isListening) {
        this.updateRecognitionLanguage(langCode);
      }
    }
  }

  // Cancel any active utterance
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.notifyState({ isPlaying: false, isPaused: false, currentText: '' });
  }

  pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notifyState({ isPlaying: true, isPaused: true });
    }
  }

  resume() {
    if (this.synth && this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyState({ isPlaying: true, isPaused: false });
    }
  }

  // Primary speech method with boundary callbacks and visualizer notifications
  speak(text, lang = this.currentLanguage, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synth || !text) {
        return resolve();
      }

      this.stop();

      const langCode = lang || this.currentLanguage;
      const targetLangObj = VOICE_LANGUAGES.find(l => l.code === langCode) || VOICE_LANGUAGES[0];
      const utterance = new SpeechSynthesisUtterance(text);

      const chosenVoice = this.findBestVoice(langCode);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
      utterance.lang = targetLangObj.bcp47;
      utterance.rate = options.rate !== undefined ? options.rate : this.rate;
      utterance.pitch = options.pitch !== undefined ? options.pitch : this.pitch;
      utterance.volume = options.volume !== undefined ? options.volume : this.volume;

      utterance.onstart = () => {
        this.isPlaying = true;
        this.isPaused = false;
        this.currentUtterance = utterance;
        this.notifyState({
          isPlaying: true,
          isPaused: false,
          currentText: text,
          lang: langCode,
          ...options.meta
        });
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.notifyState({ isPlaying: false, isPaused: false, currentText: '' });
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.notifyState({ isPlaying: false, isPaused: false, currentText: '', error: e });
        if (options.onError) options.onError(e);
        resolve();
      };

      if (options.onBoundary) {
        utterance.onboundary = options.onBoundary;
      }

      this.synth.speak(utterance);
    });
  }

  // Build spoken phrases for a recipe
  getSpokenPhrases(recipe, lang = this.currentLanguage) {
    const t = CULINARY_SPOKEN_TEMPLATES[lang] || CULINARY_SPOKEN_TEMPLATES.en;
    const title = recipe.title || 'Delicious Recipe';
    const cuisine = recipe.cuisine || '';
    const ingredients = recipe.ingredients || [];
    const instructions = recipe.instructions || [];

    const phrases = [];

    // Intro
    phrases.push({
      type: 'intro',
      label: 'Introduction',
      text: t.intro(title, cuisine)
    });

    // Ingredients
    if (ingredients.length > 0) {
      const ingListSpoken = ingredients
        .map(i => typeof i === 'string' ? i : `${i.amount || ''} ${i.name || ''}`.trim())
        .filter(Boolean)
        .join(', ');

      phrases.push({
        type: 'ingredients',
        label: 'Ingredients',
        text: `${t.ingredientsIntro(ingredients.length)}: ${ingListSpoken}.`
      });
    }

    // Step-by-step
    instructions.forEach((step, idx) => {
      const stepNum = idx + 1;
      const stepText = typeof step === 'string' ? step : (step.instruction || step.text || '');
      const chefTip = typeof step === 'object' && step.chefTip ? ` ${t.chefTipPrefix} ${step.chefTip}` : '';
      const timerMins = typeof step === 'object' && step.durationMinutes > 0 ? ` ${t.timerNotice(step.durationMinutes)}` : '';

      phrases.push({
        type: 'step',
        stepIndex: idx,
        stepNumber: stepNum,
        label: `Step ${stepNum}`,
        text: `${t.stepIntro(stepNum, instructions.length)} ${stepText}${timerMins}${chefTip}`
      });
    });

    // Outro
    phrases.push({
      type: 'outro',
      label: 'Finishing Touch',
      text: recipe.chefSecret ? `${t.chefTipPrefix} ${recipe.chefSecret}. ${t.outro}` : t.outro
    });

    return phrases;
  }

  // Fetch AI-enhanced narration script from server
  async fetchAiNarration(recipe, lang = this.currentLanguage) {
    const cacheKey = `${recipe._id || recipe.title}_${lang}`;
    if (this.narrationCache.has(cacheKey)) {
      return this.narrationCache.get(cacheKey);
    }

    try {
      const res = await fetch('/api/ai/voice-narrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe, language: lang })
      });
      const data = await res.json();
      if (data.success && data.narration) {
        this.narrationCache.set(cacheKey, data.narration);
        return data.narration;
      }
    } catch (e) {
      console.warn('AI narration API fetch error:', e);
    }

    return null;
  }

  // ----------------------------------------------------
  // SPEECH RECOGNITION (Voice Commands & Voice Search)
  // ----------------------------------------------------
  initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition API is not supported in this browser.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      const langObj = VOICE_LANGUAGES.find(l => l.code === this.currentLanguage) || VOICE_LANGUAGES[0];
      this.recognition.lang = langObj.bcp47;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.notifyState({ isListening: true, listeningLang: this.currentLanguage });
      };

      this.recognition.onend = () => {
        // If meant to be continuously listening for commands, auto-restart
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
            this.notifyState({ isListening: false });
          }
        } else {
          this.notifyState({ isListening: false });
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error);
        }
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const rawText = (finalTranscript || interimTranscript).trim().toLowerCase();

        if (this.onTranscriptCallback) {
          this.onTranscriptCallback({
            text: finalTranscript || interimTranscript,
            isFinal: !!finalTranscript
          });
        }

        if (finalTranscript) {
          this.evaluateVoiceCommand(finalTranscript.toLowerCase());
        }
      };
    } catch (err) {
      console.error('Failed to initialize Speech Recognition:', err);
    }
  }

  updateRecognitionLanguage(langCode) {
    if (!this.recognition) return;
    const langObj = VOICE_LANGUAGES.find(l => l.code === langCode) || VOICE_LANGUAGES[0];
    const wasListening = this.isListening;
    if (wasListening) {
      this.isListening = false;
      this.recognition.stop();
    }
    this.recognition.lang = langObj.bcp47;
    if (wasListening) {
      setTimeout(() => this.startListening(this.onCommandCallback), 200);
    }
  }

  startListening(onCommand, onTranscript = null) {
    if (!this.recognition) return false;
    this.onCommandCallback = onCommand;
    this.onTranscriptCallback = onTranscript;
    this.isListening = true;

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      // Already running
      return true;
    }
  }

  stopListening() {
    if (!this.recognition) return;
    this.isListening = false;
    try {
      this.recognition.stop();
    } catch (e) {
      // ignore
    }
    this.notifyState({ isListening: false });
  }

  evaluateVoiceCommand(spokenText) {
    if (!this.onCommandCallback || !spokenText) return;

    // Check commands across active language and English fallbacks
    const activeLangs = [this.currentLanguage, 'en'];

    for (const lang of activeLangs) {
      const commands = VOICE_COMMANDS[lang];
      if (!commands) continue;

      for (const [action, triggers] of Object.entries(commands)) {
        for (const trigger of triggers) {
          if (spokenText.includes(trigger)) {
            this.onCommandCallback(action, spokenText);
            return;
          }
        }
      }
    }
  }

  // One-shot voice dictation (useful for search bar or text inputs)
  dictate(lang = this.currentLanguage) {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        return reject(new Error('Speech recognition not available'));
      }

      const dictRec = new SpeechRecognition();
      const langObj = VOICE_LANGUAGES.find(l => l.code === lang) || VOICE_LANGUAGES[0];
      dictRec.lang = langObj.bcp47;
      dictRec.continuous = false;
      dictRec.interimResults = false;

      dictRec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        resolve(text);
      };

      dictRec.onerror = (e) => {
        reject(e);
      };

      dictRec.start();
    });
  }
}

export const aiVoiceEngine = new AiVoiceEngine();
export default aiVoiceEngine;
