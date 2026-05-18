import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CosmicBackground from '../Effects/CosmicBackground';
import { useTranslation } from 'react-i18next';

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const { t } = useTranslation();
  
  const initializationSteps = [
    t('intro.step1'),
    t('intro.step2'),
    t('intro.step3'),
    t('intro.step4')
  ];

  const [step, setStep] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    if (step < initializationSteps.length) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, step === 0 ? 1000 : 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowTitle(true);
      }, 500);
      
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 5000); // Title visible for transition
      
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [step, onComplete, initializationSteps.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      <CosmicBackground intensity="high" />
      
      <div className="relative z-10 text-center">
        <AnimatePresence mode="wait">
          {!showTitle ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <div className="h-4 overflow-hidden flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={step}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-indigo-400"
                    >
                      {initializationSteps[step] || initializationSteps[3]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="w-48 h-[1px] bg-white/5 mx-auto relative overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="title"
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full scale-150"
              />
              
              <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter relative">
                <span className="relative">
                  SalesSight
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ml-2"
                  >
                    AI
                  </motion.span>
                  
                  <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-full pointer-events-none"
                  />
                </span>
              </h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-6 flex flex-col items-center gap-2"
              >
                <p className="text-xs font-bold uppercase tracking-[0.6em] text-gray-500">{t('intro.subtitle')}</p>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(var(--color-primary),0.8)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
