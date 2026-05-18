import React, { useState } from 'react';
import { Languages, ArrowRight, Loader2, Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translateText } from '../../services/geminiService';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
];

export default function SmartTranslator() {
  const { i18n, t } = useTranslation();
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const result = await translateText(text, targetLang);
      setTranslatedText(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-8 space-y-6">
      <div className="flex items-center gap-4 border-b border-[var(--color-border)] pb-6">
        <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
          <Languages size={24} />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-[var(--color-text-main)] italic">{t('ai.smart_translator_title')}</h2>
          <p className="text-xs text-[var(--color-text-dim)] font-medium uppercase tracking-widest leading-loose">{t('ai.neural_processing')}</p>
        </div>
        <div className="ml-auto">
           <Sparkles className="text-brand-primary animate-pulse" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest pl-1">{t('ai.source_text')}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('ai.prompt_placeholder')}
            className="w-full h-40 bg-white/5 border border-[var(--color-border)] rounded-2xl p-4 text-sm focus:ring-1 focus:ring-brand-primary outline-none resize-none transition-all placeholder:italic placeholder:opacity-30"
          />
        </div>

        <div className="flex md:flex-col items-center justify-center gap-4">
          <div className="h-px w-full md:w-px md:h-12 bg-[var(--color-border)]" />
          <button
            onClick={handleTranslate}
            disabled={isLoading || !text.trim()}
            className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
          </button>
          <div className="h-px w-full md:w-px md:h-12 bg-[var(--color-border)]" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between pl-1">
             <label className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest">{t('ai.target_language')}</label>
             <select 
               value={targetLang}
               onChange={(e) => setTargetLang(e.target.value)}
               className="bg-transparent text-[10px] font-black text-brand-primary uppercase tracking-widest border-none outline-none cursor-pointer"
             >
               {languages.map(lang => (
                 <option key={lang.code} value={lang.code} className="bg-sidebar-bg text-[var(--color-text-main)]">
                   {lang.name}
                 </option>
               ))}
             </select>
          </div>
          <div className="relative group">
            <div className={cn(
              "w-full h-40 bg-brand-primary/5 border border-[var(--color-border)] rounded-2xl p-4 text-sm overflow-y-auto whitespace-pre-wrap transition-all",
              !translatedText && "text-[var(--color-text-dim)] italic opacity-50"
            )}>
              {translatedText || t('ai.neural_output')}
            </div>
            {translatedText && (
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex items-center gap-3 text-[10px] text-[var(--color-text-dim)] uppercase tracking-[0.2em] font-medium opacity-50">
        <Sparkles size={12} />
        {t('ai.powered_by')}
      </div>
    </div>
  );
}
