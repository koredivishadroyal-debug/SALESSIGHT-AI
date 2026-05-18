import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Mail, 
  Lock, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import CosmicBackground from '../Effects/CosmicBackground';
import { cn } from '../../lib/utils';

import { useTranslation } from 'react-i18next';

interface LoginPageProps {
  onLogin: () => void;
  themeMode: 'terminal' | 'luxury';
}

export default function LoginPage({ onLogin, themeMode }: LoginPageProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Simulate authorization handshake
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-main-bg font-sans transition-colors duration-1000">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: themeMode === 'terminal' 
            ? 'radial-gradient(circle at 0% 0%, #0f172a 0%, #020617 100%)'
            : 'radial-gradient(circle at 100% 0%, #fdfbf7 0%, #f5f2ed 100%)'
        }}
      />

      {/* Effects */}
      {themeMode === 'terminal' && <CosmicBackground intensity="medium" />}
      
      {/* Dynamic Cursor Glow */}
      <div 
        className="fixed w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none transition-transform duration-300 ease-out z-0"
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`
        }}
      />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Brand & Visuals */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="hidden lg:flex flex-col justify-center space-y-12"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="text-white w-7 h-7" />
              </div>
              <span className="text-4xl font-display font-black tracking-tighter text-[var(--color-text-main)] transition-colors">
                SalesSight <span className="text-brand-primary">AI</span>
              </span>
            </motion.div>
            
            <h2 className="text-5xl font-display font-bold leading-tight text-[var(--color-text-main)] tracking-tight transition-colors">
              {t('login.brand_intelligence')}
            </h2>
            
            <p className="text-lg text-[var(--color-text-dim)] max-w-lg leading-relaxed transition-colors">
              {t('login.brand_synthesize')}
              <br />
              {t('login.brand_calibration')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: t('login.growth_delta'), value: '+42.5%', icon: Globe },
              { label: t('login.security_grade'), value: 'Level 5', icon: ShieldCheck }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 backdrop-blur-md"
              >
                <stat.icon className="text-indigo-400 mb-3" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">{t('login.architected_by')}</p>
            <div className="flex gap-4">
              {['BASWARAJ', 'DIVISHADROYAL', 'LASYA GUPTA', 'JASHWITHA'].map((name) => (
                <p key={name} className="text-[10px] font-bold text-gray-400/60 tracking-widest">{name}</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md animate-float">
            <div className="glass-card p-10 neon-border">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-display font-black text-[var(--color-text-main)] mb-2 tracking-tight uppercase transition-colors">
                  {t('login.title')}
                </h3>
                <p className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.2em] transition-colors">
                  {t('login.subtitle')}
                </p>
                
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest ml-1 transition-colors">{t('login.identity_vector')}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-primary group-focus-within:text-brand-primary transition-colors">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-primary/5 border border-[var(--color-border)] rounded-2xl pl-12 pr-4 py-4 text-sm text-[var(--color-text-main)] outline-none focus:border-brand-primary/50 focus:bg-brand-primary/10 transition-all"
                        placeholder="identity@enterprise.ai"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest transition-colors">{t('login.secret_cipher')}</label>
                      <button type="button" className="text-[9px] font-bold text-brand-primary hover:underline uppercase tracking-widest transition-colors">{t('login.recover')}</button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-primary group-focus-within:text-brand-primary transition-colors">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-brand-primary/5 border border-[var(--color-border)] rounded-2xl pl-12 pr-12 py-4 text-sm text-[var(--color-text-main)] outline-none focus:border-brand-primary/50 focus:bg-brand-primary/10 transition-all"
                        placeholder="••••••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-2xl font-display font-bold text-sm tracking-[0.2em] uppercase shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <span className="relative z-10">{t('login.initialize')}</span>
                      <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  
                  {/* Button Light sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[sweep_1.5s_infinite]" />
                </motion.button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-xs text-gray-500 font-medium italic">
                  Systems fully calibrated for neural dataset ingestion.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Floating Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div 
          animate={{ y: [0, -40, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 right-[10%] w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 left-[10%] w-96 h-96 bg-brand-accent/10 blur-[120px] rounded-full"
        />
      </div>
    </div>
  );
}
