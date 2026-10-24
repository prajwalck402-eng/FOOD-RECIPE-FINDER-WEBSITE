import React, { useState } from 'react';
import { 
  X, 
  ChefHat, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Globe, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { t, LANGUAGES } from '../utils/i18n';
import { culinaryAudio } from '../utils/audio';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLanguage = 'en',
  onLanguageChange
}) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sign In Form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpLanguage, setSignUpLanguage] = useState(currentLanguage);
  const [signUpDietary, setSignUpDietary] = useState([]);

  if (!isOpen) return null;

  const DIETARY_OPTIONS = [
    'Vegetarian',
    'High-Protein',
    'Gluten-Free',
    'Keto',
    'Vegan',
    'Dairy-Free'
  ];

  const handleToggleDietary = (item) => {
    culinaryAudio.playTick();
    if (signUpDietary.includes(item)) {
      setSignUpDietary(signUpDietary.filter(d => d !== item));
    } else {
      setSignUpDietary([...signUpDietary, item]);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      culinaryAudio.playStepChime();
      if (onLoginSuccess) {
        onLoginSuccess(data.user, data.token);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signUpName || !signUpEmail || !signUpPassword) {
      setErrorMessage('Please complete all required fields');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage(t('authPasswordMinLength', currentLanguage));
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage(t('authPasswordMismatch', currentLanguage));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
          preferredLanguage: signUpLanguage,
          dietaryPreferences: signUpDietary,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      culinaryAudio.playStepChime();
      if (onLanguageChange && signUpLanguage !== currentLanguage) {
        onLanguageChange(signUpLanguage);
      }
      if (onLoginSuccess) {
        onLoginSuccess(data.user, data.token);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Sign In
  const handleQuickDemoSignIn = async () => {
    culinaryAudio.playTick();
    setSignInEmail('chef.demo@savoryai.com');
    setSignInPassword('password123');
    setIsLoading(true);
    setErrorMessage('');

    try {
      // First try login
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'chef.demo@savoryai.com',
          password: 'password123',
        }),
      });

      let data = await res.json();

      // If demo user does not exist yet, create it on the fly
      if (!res.ok || !data.success) {
        res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Executive Chef Demo',
            email: 'chef.demo@savoryai.com',
            password: 'password123',
            preferredLanguage: currentLanguage,
            dietaryPreferences: ['High-Protein', 'Vegetarian'],
            avatar: '👨‍🍳',
          }),
        });
        data = await res.json();
      }

      if (data.success) {
        culinaryAudio.playStepChime();
        if (onLoginSuccess) {
          onLoginSuccess(data.user, data.token);
        }
        onClose();
      } else {
        throw new Error(data.message || 'Demo login failed');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warmgray-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl border border-cream-200 shadow-warm-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Decorative Top Glow Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-terracotta-500 via-amber-500 to-terracotta-600" />

        {/* Close Button */}
        <button
          onClick={() => {
            culinaryAudio.playTick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-cream-100 hover:bg-cream-200 text-warmgray-600 hover:text-warmgray-900 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-amber-500 text-white shadow-warm-md mb-3">
            <ChefHat className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-warmgray-900">
            {activeTab === 'signin' ? t('authTitleSignIn', currentLanguage) : t('authTitleSignUp', currentLanguage)}
          </h3>
          <p className="text-xs text-warmgray-600 mt-1 max-w-xs mx-auto">
            {activeTab === 'signin' ? t('authSubtitleSignIn', currentLanguage) : t('authSubtitleSignUp', currentLanguage)}
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-cream-100/90 rounded-2xl mt-5 border border-cream-300/60">
            <button
              type="button"
              onClick={() => {
                culinaryAudio.playTick();
                setActiveTab('signin');
                setErrorMessage('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-terracotta-700 shadow-warm-sm'
                  : 'text-warmgray-600 hover:text-warmgray-900'
              }`}
            >
              {t('authTabSignIn', currentLanguage)}
            </button>
            <button
              type="button"
              onClick={() => {
                culinaryAudio.playTick();
                setActiveTab('signup');
                setErrorMessage('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-terracotta-700 shadow-warm-sm'
                  : 'text-warmgray-600 hover:text-warmgray-900'
              }`}
            >
              {t('authTabSignUp', currentLanguage)}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="px-6 pb-6 max-h-[68vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-warmgray-700 mb-1">
                  {t('authEmail', currentLanguage)}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-warmgray-600" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="chef@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 border border-cream-300 focus:border-terracotta-500 focus:bg-white text-sm text-warmgray-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warmgray-700 mb-1">
                  {t('authPassword', currentLanguage)}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-warmgray-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-cream-50/70 border border-cream-300 focus:border-terracotta-500 focus:bg-white text-sm text-warmgray-900 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-warmgray-600 hover:text-warmgray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white font-bold text-sm shadow-warm-md hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 btn-push disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('authSignInBtn', currentLanguage)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Sign In Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-cream-200"></div>
                <span className="flex-shrink mx-3 text-[11px] text-warmgray-600 font-semibold uppercase tracking-wider">
                  {t('authOrDemo', currentLanguage)}
                </span>
                <div className="flex-grow border-t border-cream-200"></div>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoSignIn}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 btn-push"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t('authDemoBtn', currentLanguage)}</span>
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-warmgray-700 mb-1">
                  {t('authFullName', currentLanguage)}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-warmgray-600" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Chef Marco Pierre"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 border border-cream-300 focus:border-terracotta-500 focus:bg-white text-sm text-warmgray-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warmgray-700 mb-1">
                  {t('authEmail', currentLanguage)}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-warmgray-600" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="chef@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50/70 border border-cream-300 focus:border-terracotta-500 focus:bg-white text-sm text-warmgray-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 mb-1">
                    {t('authPassword', currentLanguage)}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-3 py-2.5 rounded-xl bg-cream-50/70 border border-cream-300 focus:border-terracotta-500 focus:bg-white text-sm text-warmgray-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warmgray-700 mb-1">
                    {t('authConfirmPassword', currentLanguage)}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-3 py-2.5 rounded-xl bg-cream-50/70 border border-cream-300 focus:border-terracotta-500 focus:bg-white text-sm text-warmgray-900 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold text-warmgray-700 mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>{t('authPreferredLanguage', currentLanguage)}</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        culinaryAudio.playTick();
                        setSignUpLanguage(lang.code);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all ${
                        signUpLanguage === lang.code
                          ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-900 font-bold'
                          : 'border-cream-200 bg-white hover:bg-cream-50 text-warmgray-700'
                      }`}
                    >
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-xs font-bold text-warmgray-700 mb-1.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('authDietaryPreferences', currentLanguage)}</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DIETARY_OPTIONS.map((item) => {
                    const isSelected = signUpDietary.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleToggleDietary(item)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                          isSelected
                            ? 'bg-sage-600 border-sage-600 text-white'
                            : 'bg-cream-50 border-cream-200 text-warmgray-700 hover:bg-cream-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-terracotta-600 to-amber-600 hover:from-terracotta-700 hover:to-amber-700 text-white font-bold text-sm shadow-warm-md hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 btn-push disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('authSignUpBtn', currentLanguage)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
