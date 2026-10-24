import React, { useState, useRef, useEffect } from 'react';
import { 
  ChefHat, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Lightbulb, 
  HelpCircle,
  RefreshCw,
  Flame,
  Bot,
  Globe,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { culinaryAudio } from '../utils/audio';
import { aiVoiceEngine } from '../utils/aiVoiceEngine';
import { t, LANGUAGES } from '../utils/i18n';

const REGIONAL_CHEF_PROMPTS = {
  en: [
    "How to make authentic Karnataka Ennegayi?",
    "Tips for perfect Hyderabadi Dum Biryani?",
    "How to make Mysore Masala Dosa extra crispy?",
    "What is the secret to rich Dhaba Dal Makhani?",
    "Best substitutes for Byadagi chili & Tamarind?"
  ],
  hi: [
    "दाल मखनी को ढाबा स्टाइल स्मोकी कैसे बनाएं?",
    "शाही पनीर की ग्रेवी को मखमली कैसे करें?",
    "हैदराबादी बिरयानी में दम लगाने का सही तरीका?",
    "समोसा चाट की खट्टी-मीठी चटनी का राज?",
    "बटर चिकन को रेस्टोरेंट जैसा कैसे बनाएं?"
  ],
  kn: [
    "ಎಣ್ಣೆಗಾಯಿ ಮಸಾಲೆ ಘಮಘಮಿಸುವಂತೆ ಮಾಡುವುದು ಹೇಗೆ?",
    "ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ ಗರಿಗರಿಯಾಗಿ ಬರಲು ಟಿಪ್ಸ್?",
    "ಬಿಸಿಬೇಳೆ ಬಾತ್ ಮರಾಠಿ ಮೊಗ್ಗು ಸೀಕ್ರೆಟ್ ಏನು?",
    "ರಾಗಿ ಮುದ್ದೆ ಉಂಡೆ ಸಾಫ್ಟ್ ಆಗಿ ಮಾಡಲು ವಿಧಾನ?",
    "ತುಳುನಾಡು ಘೀ ರೋಸ್ಟ್ ಮಸಾಲೆ ಹೇಗೆ ಮಾಡುವುದು?"
  ],
  te: [
    "గుత్తి వంకాయ కూర మసాలా ఎలా తయారు చేయాలి?",
    "హైదరాబాదీ దమ్ బిర్యానీ సీక్రెట్ టిప్స్?",
    "పెసరట్టు క్రిస్పీగా రావాలంటే ఏం కలపాలి?",
    "అల్లం పచ్చడి సరైన రుచి కోసం టిప్స్?",
    "ఆంధ్ర చికెన్ కర్రీ ఘాటుగా చేయడానికి విధానం?"
  ]
};

export default function AiSousChefChat({ currentRecipe = null, currentLanguage = 'en' }) {
  const [chatLanguage, setChatLanguage] = useState(currentLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chatGreeting', currentLanguage)
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setChatLanguage(currentLanguage);
    setMessages([
      {
        role: 'assistant',
        content: t('chatGreeting', currentLanguage)
      }
    ]);
  }, [currentLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    culinaryAudio.playTick();
    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          currentRecipe,
          language: chatLanguage,
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
        culinaryAudio.playStepChime();
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: 'Apologies, my friend! Let me take a quick breath. Please try again.' }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Connection issue: ' + err.message }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Dictation to ask chef questions
  const handleDictate = async () => {
    culinaryAudio.playTick();
    setIsDictating(true);
    try {
      const text = await aiVoiceEngine.dictate(chatLanguage);
      if (text && text.trim()) {
        setInput(text.trim());
        // auto send
        handleSend(text.trim());
      }
    } catch (e) {
      console.warn('Chat voice dictation error:', e);
    } finally {
      setIsDictating(false);
    }
  };

  // Speak AI Chef reply
  const handleSpeakReply = (text, idx) => {
    culinaryAudio.playTick();
    if (speakingMessageIndex === idx) {
      aiVoiceEngine.stop();
      setSpeakingMessageIndex(null);
    } else {
      setSpeakingMessageIndex(idx);
      aiVoiceEngine.speak(text, chatLanguage, {
        onEnd: () => setSpeakingMessageIndex(null),
        onError: () => setSpeakingMessageIndex(null)
      });
    }
  };

  const currentPrompts = REGIONAL_CHEF_PROMPTS[chatLanguage] || REGIONAL_CHEF_PROMPTS.en;

  return (
    <>
      {/* Floating Action Launcher Button */}
      <button
        type="button"
        onClick={() => {
          culinaryAudio.playTick();
          setIsOpen(!isOpen);
        }}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-3xl shadow-warm-xl flex items-center gap-3 transition-all duration-300 btn-push select-none ${
          isOpen
            ? 'bg-warmgray-900 text-white shadow-warm-lg scale-95'
            : 'bg-gradient-to-tr from-terracotta-600 via-terracotta-500 to-amber-500 text-white hover:shadow-glow-terracotta hover:scale-105'
        }`}
        title="Chat with AI Sous-Chef"
      >
        <div className="relative">
          <ChefHat className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
        </div>
        <span className="font-bold text-sm hidden sm:inline">
          {isOpen ? 'Close Chef Chat' : 'Ask AI Sous-Chef (EN/हि/ಕ/తె)'}
        </span>
      </button>

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[94vw] sm:w-[420px] max-h-[600px] h-[75vh] bg-white rounded-3xl shadow-warm-2xl border border-cream-300 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-amber-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base leading-tight">Chef Savor Copilot</h3>
                <p className="text-[11px] text-amber-100 font-medium">Indian Regional & Global AI Specialist</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                aiVoiceEngine.stop();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-all btn-push"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Context and Language Sub-Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-terracotta-700 to-amber-700 text-white text-[11px] flex flex-col gap-1 border-t border-white/10">
            {currentRecipe && (
              <div className="flex items-center gap-1.5 opacity-90 truncate">
                <Flame className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span className="truncate">Context: <strong>{currentRecipe.title}</strong></span>
              </div>
            )}

            {/* Language Quick Selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] uppercase font-bold text-amber-200 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Language:
              </span>
              <div className="flex items-center gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      culinaryAudio.playTick();
                      setChatLanguage(l.code);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      chatLanguage === l.code
                        ? 'bg-white text-terracotta-800 shadow-xs'
                        : 'bg-black/20 text-amber-100 hover:bg-black/30'
                    }`}
                  >
                    {l.flag} {l.nativeName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-cream-50/70">
            {messages.map((m, idx) => {
              const isSpeakingThis = speakingMessageIndex === idx;
              return (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-terracotta-200 shadow-xs">
                      <ChefHat className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed max-w-[84%] shadow-xs group/msg relative ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-terracotta-600 to-amber-600 text-white rounded-br-none'
                        : 'bg-white text-warmgray-900 border border-cream-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>

                    {/* Speaker button on assistant message */}
                    {m.role === 'assistant' && (
                      <div className="pt-1.5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSpeakReply(m.content, idx)}
                          className={`p-1 rounded-md transition-all flex items-center gap-1 text-[10px] font-bold ${
                            isSpeakingThis
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'text-warmgray-400 hover:text-terracotta-600 hover:bg-cream-100'
                          }`}
                          title="Read chef response aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeakingThis ? 'Speaking...' : 'Listen'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-warmgray-500 italic p-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center animate-spin">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Chef Savor is formulating in {LANGUAGES.find(l => l.code === chatLanguage)?.nativeName || 'your language'}...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Cloud */}
          <div className="px-3 py-2 bg-cream-100/90 border-t border-cream-200 overflow-x-auto flex gap-1.5 select-none">
            {currentPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-semibold text-warmgray-700 hover:text-terracotta-700 bg-white hover:bg-cream-50 border border-cream-300 rounded-lg px-2.5 py-1 whitespace-nowrap shadow-xs btn-push"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box with Voice Dictation */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-cream-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for recipes, spices, or tempering..."
              className="flex-1 px-3.5 py-2.5 bg-cream-50 rounded-xl border border-cream-200 text-xs font-medium text-warmgray-900 placeholder:text-warmgray-400 focus:outline-none focus:border-terracotta-500 shadow-inner"
            />
            
            {/* Mic Dictate Button */}
            <button
              type="button"
              onClick={handleDictate}
              className={`p-2.5 rounded-xl border transition-all btn-push flex items-center justify-center ${
                isDictating
                  ? 'bg-red-500 text-white animate-pulse border-red-600'
                  : 'bg-cream-100 hover:bg-cream-200 text-warmgray-700 border-cream-300'
              }`}
              title="Speak your question (EN / हिन्दी / ಕನ್ನಡ / తెలుగు)"
            >
              <Mic className={`w-4 h-4 ${isDictating ? 'text-white' : 'text-terracotta-600'}`} />
            </button>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-2.5 rounded-xl font-bold transition-all btn-push ${
                input.trim()
                  ? 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-warm-sm'
                  : 'bg-cream-100 text-warmgray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
