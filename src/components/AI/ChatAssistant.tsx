import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, X, Languages } from 'lucide-react';
import { getAIInsight, translateText } from '../../services/geminiService';
import { CRMData } from '../../types/crm';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

interface ChatAssistantProps {
  data: CRMData[];
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  isTranslating?: boolean;
}

export default function ChatAssistant({ data }: ChatAssistantProps) {
  const { t, i18n } = useTranslation();
  const isDataMissing = data.length === 0;

  const [messages, setMessages] = useState<Message[]>([]);

  const handleTranslateMessage = async (msgId: string, content: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isTranslating: true } : m));
    try {
      const translated = await translateText(content, i18n.language);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: translated, isTranslating: false } : m));
    } catch (error) {
       console.error(error);
       setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isTranslating: false } : m));
    }
  };

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Handshake established. Strategic analysis for **${data.length} records** complete. I have identified several growth patterns in your current trajectory. \n\nHow should we refine your executive strategy?`,
        timestamp: new Date()
      }
    ]);
  }, [i18n.language]); // Reset or re-message on language change? Maybe just i18n aware greeting would be better.

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const thinkingSteps = [
    "Initializing Strategic Handshake...",
    "Crawling CRM Transaction Ledger...",
    "Scanning Historical Revenue Vectors...",
    "Running Neural Growth Calibration...",
    "Synthesizing Executive Recommendations...",
    "Finalizing Strategic Response..."
  ];

  useEffect(() => {
    if (isLoading) {
      let stepIndex = 0;
      setThinkingStep(thinkingSteps[0]);
      const interval = setInterval(() => {
        stepIndex = (stepIndex + 1) % thinkingSteps.length;
        setThinkingStep(thinkingSteps[stepIndex]);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setThinkingStep(null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestedPrompts = [
    "Predict Revenue Growth",
    "Analyze Top Regions",
    "Product Performance Audit",
    "Identify Churn Signals",
    "Strategic BRIEFING (PDF)"
  ];

  const handleSend = async (customInput?: string) => {
    const messageContent = customInput || input;
    if (!messageContent.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getAIInsight(data, messageContent, i18n.language);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-main-bg border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden glass-card transition-colors duration-500">
      <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-brand-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[var(--color-text-main)] font-display font-black text-sm tracking-tight uppercase transition-colors">{t('ai.engine_title')}</h3>
            <div className="flex items-center gap-3">
              <p className="text-[10px] text-emerald-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {t('ai.dataset_synced')}
              </p>
              <p className="text-[9px] text-[var(--color-text-dim)] font-mono border-l border-[var(--color-border)] pl-3">
                {data.length} {t('ai.records')}
              </p>
            </div>
          </div>
        </div>
        <button className="p-2 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors">
          <X size={18} />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'assistant' ? "bg-brand-primary text-white" : "bg-brand-primary/10 text-brand-primary"
              )}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === 'assistant' 
                  ? "bg-brand-primary/5 text-[var(--color-text-main)] border border-[var(--color-border)] rounded-tl-none" 
                  : "bg-brand-primary text-white rounded-tr-none shadow-lg"
              )}>
                <div className="markdown-body">
                  <Markdown>{msg.content}</Markdown>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className={cn(
                    "text-[10px] opacity-40 font-bold uppercase tracking-tighter",
                    msg.role === 'user' ? "text-right w-full" : "text-left"
                  )}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => handleTranslateMessage(msg.id, msg.content)}
                      disabled={msg.isTranslating}
                      className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-primary opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {msg.isTranslating ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Languages size={10} />
                      )}
                      Smart Translate
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-brand-primary/5 p-5 rounded-2xl border border-[var(--color-border)] rounded-tl-none flex flex-col gap-3">
               <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
               <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] animate-pulse">
                 {thinkingStep}
               </p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 border-t border-[var(--color-border)] bg-brand-primary/5 space-y-4">
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none no-scrollbar">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 bg-brand-primary/5 border border-[var(--color-border)] hover:bg-brand-primary/10 hover:border-brand-primary/30 text-[var(--color-text-dim)] hover:text-brand-primary text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search patterns or ask for growth recommendations..."
            className="w-full bg-brand-primary/5 border border-[var(--color-border)] text-[var(--color-text-main)] pl-5 pr-14 py-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder:text-[var(--color-text-dim)] text-sm font-medium shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-2 p-2.5 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/10 disabled:text-gray-500 text-white rounded-xl transition-all shadow-lg active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}
