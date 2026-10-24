import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../utils/i18n';
import { culinaryAudio } from '../utils/audio';

export default function LanguageSelector({ currentLanguage = 'en', onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode) => {
    culinaryAudio.playTick();
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          culinaryAudio.playTick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-cream-300 hover:border-terracotta-300 text-warmgray-800 text-xs font-bold shadow-xs hover:shadow-warm-sm transition-all duration-200 btn-push"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Language / भाषा बदलें / ಭಾಷೆ ಬದಲಾಯಿಸಿ / భాష మార్చండి"
      >
        <span className="text-sm">{activeLangObj.flag}</span>
        <span className="hidden sm:inline font-semibold">{activeLangObj.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-warmgray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-terracotta-600' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-cream-200 shadow-warm-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-warmgray-600 border-b border-cream-100 flex items-center gap-1">
            <Globe className="w-3 h-3 text-terracotta-600" />
            <span>Select Language</span>
          </div>

          <div className="p-1 space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-terracotta-50 text-terracotta-800 font-bold'
                      : 'text-warmgray-700 hover:bg-cream-100/70 hover:text-warmgray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <div className="text-left">
                      <div className="leading-tight">{lang.nativeName}</div>
                      <div className="text-[10px] text-warmgray-600 font-normal">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-terracotta-600 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
