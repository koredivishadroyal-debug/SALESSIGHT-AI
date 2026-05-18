import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളం', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:border-brand-primary/30 transition-all active:scale-95 group"
      >
        <Globe size={16} className="text-brand-primary" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-main)] transition-colors">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown size={14} className={cn("text-gray-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 bg-sidebar-bg border border-[var(--color-border)] rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
            >
              <div className="p-2 grid grid-cols-2 gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                      i18n.language === lang.code 
                        ? "bg-brand-primary/10 text-brand-primary" 
                        : "text-[var(--color-text-dim)] hover:bg-white/5 hover:text-[var(--color-text-main)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-xs font-bold tracking-tight">{lang.name}</span>
                    </div>
                    {i18n.language === lang.code && (
                      <Check size={14} className="text-brand-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
