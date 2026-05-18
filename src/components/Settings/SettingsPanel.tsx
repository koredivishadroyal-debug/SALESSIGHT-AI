import React from 'react';
import { 
  Settings as SettingsIcon, Bell, Shield, Database, 
  Cpu, Globe, User, ChevronRight, Zap, 
  Moon, Sun, Laptop, Key, Terminal,
  Palette, Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

import { useTranslation } from 'react-i18next';

interface SettingsPanelProps {
  theme: { primary: string; accent: string };
  onThemeChange: (theme: { primary: string; accent: string }) => void;
  themeMode: 'terminal' | 'luxury';
  onThemeModeChange: (mode: 'terminal' | 'luxury') => void;
}

export default function SettingsPanel({ theme, onThemeChange, themeMode, onThemeModeChange }: SettingsPanelProps) {
  const { t } = useTranslation();
  const primaryColors = themeMode === 'terminal' ? [
    { name: 'Default Indigo', value: '#4f46e5' },
    { name: 'Royal Blue', value: '#2563eb' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Crimson', value: '#dc2626' },
    { name: 'Amber', value: '#d97706' },
  ] : [
    { name: 'Brushed Gold', value: '#d4af37' },
    { name: 'Champagne', value: '#f7e7ce' },
    { name: 'Bronze', value: '#cd7f32' },
    { name: 'Platinum', value: '#e5e4e2' },
    { name: 'Soft Silver', value: '#c0c0c0' },
  ];

  const accentColors = themeMode === 'terminal' ? [
    { name: 'Default Purple', value: '#9333ea' },
    { name: 'Cyan', value: '#0891b2' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Slate', value: '#475569' },
  ] : [
    { name: 'Royal Velvet', value: '#4b0082' },
    { name: 'Deep Navy', value: '#000080' },
    { name: 'Onyx', value: '#353839' },
    { name: 'Ivory', value: '#fffff0' },
    { name: 'Rose Quartz', value: '#f7cac9' },
  ];

  const sections = [
    {
      title: t('settings.neural_config'),
      items: [
        { id: '1', name: t('settings.model_selection'), desc: 'Gemini 1.5 Pro (Active)', icon: Cpu, badge: 'High Perf' },
        { id: '2', name: t('settings.api_integration'), desc: 'Manage CRM & Slack keys', icon: Key },
        { id: '3', name: t('settings.endpoint_status'), desc: 'All systems operational', icon: Globe, status: 'Online' },
        { 
          id: 'sf-sync', 
          name: t('settings.sf_webhook'), 
          desc: t('settings.sf_webhook_desc'), 
          icon: Zap, 
          action: () => {
             fetch('/api/webhooks/salesforce', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ event: 'RECORD_CREATED', payload: { source: 'SIMULATOR' } })
             }).then(() => {
               alert('Webhook signal broadcasted to cloud orchestration engine.');
             });
          }
        },
      ]
    },
    {
      title: t('settings.data_privacy'),
      items: [
        { id: '4', name: t('settings.enterprise_isolation'), desc: 'VPC Tunnel enabled', icon: Shield, badge: 'Protected' },
        { id: '5', name: t('settings.retention_policy'), desc: '365 days rolling archive', icon: Database },
        { id: '6', name: t('settings.access_control'), desc: 'Managing 8 user roles', icon: User },
      ]
    },
    {
      title: t('settings.interface_patterns'),
      items: [
        { id: '7', name: t('settings.global_calibration'), desc: themeMode === 'terminal' ? 'Terminal Matrix Active' : 'Luxury Executive Sync', icon: themeMode === 'terminal' ? Terminal : Globe },
        { id: '8', name: t('settings.realtime_push'), desc: 'Immediate notification', icon: Bell, toggle: true },
        { id: '9', name: t('settings.dev_mode'), desc: 'Access GraphQL console', icon: Palette, toggle: false },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-display font-black text-[var(--color-text-main)] tracking-tight mb-2 uppercase italic transition-colors">{t('settings.control')}</h1>
            <p className="text-brand-primary/60 text-[10px] font-bold uppercase tracking-[0.4em]">{t('settings.calibration')}</p>
         </div>
         <div className="w-12 h-12 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary">
            <SettingsIcon size={24} />
         </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {/* Theme Mode Section */}
        <div className="space-y-6">
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
             <Terminal size={12} />
             {t('settings.interface_mode')}
           </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'terminal', name: t('settings.terminal'), desc: t('settings.terminal_desc'), icon: Moon },
                { id: 'luxury', name: t('settings.luxury'), desc: t('settings.luxury_desc'), icon: Sun }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onThemeModeChange(m.id as any)}
                  className={cn(
                    "relative overflow-hidden group p-6 border rounded-[32px] text-left transition-all",
                    themeMode === m.id 
                      ? "bg-brand-primary/5 border-brand-primary shadow-lg" 
                      : "bg-main-bg border-[var(--color-border)] hover:border-brand-primary/30"
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                     <div className={cn(
                       "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500",
                       themeMode === m.id ? "bg-brand-primary text-white" : "bg-brand-primary/10 text-brand-primary"
                     )}>
                        <m.icon size={20} />
                     </div>
                     <div>
                        <p className="text-[var(--color-text-main)] font-bold text-sm transition-colors">{m.name}</p>
                        <p className="text-[var(--color-text-dim)] text-[10px] uppercase font-bold tracking-widest transition-colors">{m.desc}</p>
                     </div>
                  </div>
                  {themeMode === m.id && (
                    <motion.div 
                      layoutId="theme-active"
                      className="absolute inset-0 bg-gradient-to-br opacity-5 pointer-events-none" 
                      style={{ backgroundImage: `linear-gradient(to bottom right, var(--color-primary), var(--color-accent))` }}
                    />
                  )}
                </button>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
             <Palette size={12} />
             {t('settings.brand_identity')}
           </h3>
           <div className="glass-card p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
              <div className="space-y-4">
                 <label className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest ml-1">{t('settings.primary_color')}</label>
                 <div className="flex flex-wrap gap-3">
                    {primaryColors.map((color) => (
                       <button
                          key={color.value}
                          onClick={() => onThemeChange({ ...theme, primary: color.value })}
                          className={cn(
                             "w-10 h-10 rounded-xl transition-all relative flex items-center justify-center group",
                             theme.primary === color.value ? "ring-2 ring-brand-primary ring-offset-4 ring-offset-[var(--bg-main)]" : "hover:scale-110"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                       >
                          {theme.primary === color.value && <Check size={16} className="text-white" />}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest ml-1">{t('settings.accent_color')}</label>
                 <div className="flex flex-wrap gap-3">
                    {accentColors.map((color) => (
                       <button
                          key={color.value}
                          onClick={() => onThemeChange({ ...theme, accent: color.value })}
                          className={cn(
                             "w-10 h-10 rounded-xl transition-all relative flex items-center justify-center group",
                             theme.accent === color.value ? "ring-2 ring-brand-primary ring-offset-4 ring-offset-[var(--bg-main)]" : "hover:scale-110"
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                       >
                          {theme.accent === color.value && <Check size={16} className="text-white" />}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {sections.map((section, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="space-y-4"
          >
             <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2">{section.title}</h3>
             <div className="bg-[#0f0f12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {section.items.map((item, i) => (
                  <motion.div 
                    key={item.id} 
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                    onClick={() => (item as any).action?.()}
                    className={cn(
                      "group p-6 flex items-center justify-between transition-all cursor-pointer",
                      i !== section.items.length - 1 && "border-b border-white/5"
                    )}
                  >
                    <div className="flex items-center gap-6">
                       <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all border border-white/5 group-hover:border-brand-primary/20"
                       >
                          <item.icon size={20} />
                       </motion.div>
                       <div>
                          <p className="text-white font-bold text-sm mb-1">{item.name}</p>
                          <p className="text-gray-500 text-xs">{item.desc}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       {item.badge && (
                         <span className="px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-tighter border border-brand-primary/20">
                           {item.badge}
                         </span>
                       )}
                       {item.status && (
                         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/5 rounded-full">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">{item.status}</span>
                         </div>
                       )}
                       {typeof item.toggle !== 'undefined' ? (
                         <motion.div 
                           whileTap={{ scale: 0.95 }}
                           className={cn(
                            "w-12 h-6 rounded-full p-1 transition-all",
                            item.toggle ? "bg-brand-primary" : "bg-white/10"
                           )}
                         >
                            <motion.div 
                              animate={{ x: item.toggle ? 24 : 0 }}
                              className="w-4 h-4 bg-white rounded-full transition-all shadow-md" 
                            />
                         </motion.div>
                       ) : (
                         <ChevronRight size={18} className="text-gray-700 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                       )}
                    </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/30">
               <Zap size={24} />
            </div>
            <div>
               <h4 className="text-lg font-bold text-white mb-1">{t('settings.upgrade_pro')}</h4>
               <p className="text-sm text-gray-500">{t('settings.upgrade_desc')}</p>
            </div>
         </div>
         <button className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95">
            {t('settings.upgrade_btn')}
         </button>
      </div>

      <div className="flex items-center justify-center gap-8 py-10 opacity-30">
         <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Security Certified</span>
         </div>
         <div className="w-[1px] h-4 bg-white/20" />
         <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Privacy Compliant</span>
         </div>
      </div>

      <div className="space-y-6 pt-10 border-t border-white/5">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
          <User size={12} />
          {t('settings.architectural_governance')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['BASWARAJ', 'DIVISHADROYAL', 'LASYA GUPTA', 'JASHWITHA'].map((name) => (
            <motion.div 
              key={name}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-brand-primary/30 transition-all"
            >
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1 group-hover:text-brand-primary/60 transition-colors">Systems Architect</p>
               <p className="text-xs font-black text-white tracking-widest">{name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
