import React from 'react';
import { 
  LayoutDashboard, 
  BarChart2, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Users, 
  User,
  Upload, 
  FileText, 
  Settings,
  Menu,
  X,
  Zap,
  LogOut,
  Languages
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ViewType } from '../../types/crm';
import { motion, AnimatePresence } from 'motion/react';

import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeView, onViewChange, collapsed, setCollapsed, onLogout }: SidebarProps) {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('common.dashboard'), icon: LayoutDashboard },
    { id: 'analytics', label: t('common.analytics'), icon: BarChart2 },
    { id: 'assistant', label: t('common.assistant'), icon: MessageSquare },
    { id: 'translator', label: t('common.translator'), icon: Languages },
    { id: 'forecasting', label: t('common.forecasting'), icon: TrendingUp },
    { id: 'insights', label: t('common.insights'), icon: Target },
    { id: 'customers', label: t('common.customers'), icon: Users },
    { id: 'upload', label: t('common.upload'), icon: Upload },
    { id: 'reports', label: t('common.reports'), icon: FileText },
    { id: 'settings', label: t('common.settings'), icon: Settings },
    { id: 'profile', label: t('common.profile'), icon: User },
  ] as const;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className={cn(
        "h-screen bg-sidebar-bg text-[var(--color-text-dim)] border-r border-[var(--color-border)] flex flex-col transition-all duration-500 ease-in-out relative z-50",
        collapsed ? "items-center" : ""
      )}
    >
      <div className={cn("p-6 flex items-center justify-between", collapsed ? "p-4" : "")}>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-black text-lg text-[var(--color-text-main)] tracking-tight uppercase transition-colors">SalesSight <span className="text-brand-primary/80">AI</span></span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-primary),0.4)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors absolute -right-3 top-7 bg-[#1a1a1f] border border-white/10 text-gray-400 hover:text-white shadow-xl"
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative border border-transparent mb-0.5",
              activeView === item.id 
                ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-sm" 
                : "hover:bg-brand-primary/5 text-[var(--color-text-dim)] hover:text-[var(--color-text-main)]"
            )}
          >
            <item.icon size={18} className={cn(
              "min-w-[18px] transition-colors",
              activeView === item.id ? "text-brand-primary" : "group-hover:text-brand-primary/60"
            )} />
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <span className={cn(
                  "font-bold whitespace-nowrap text-[11px] uppercase tracking-wider"
                )}>{item.label}</span>
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto space-y-2">
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative border border-[var(--color-border)] bg-brand-primary/5 hover:bg-rose-500/10 text-[var(--color-text-dim)] hover:text-rose-500 mb-2",
            collapsed ? "justify-center px-0" : ""
          )}
        >
          <LogOut size={18} className="min-w-[18px] group-hover:text-rose-400" />
          {!collapsed && (
            <span className="font-bold whitespace-nowrap text-[11px] uppercase tracking-wider">{t('common.logout')}</span>
          )}
        </button>

        {!collapsed ? (
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-md p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 opacity-50" />
            <div className="relative z-10">
              <p className="text-[9px] text-brand-primary font-black uppercase tracking-[0.2em] mb-2">{t('common.sf_live')}</p>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed font-bold">Predictive modeling engine fully calibrated for Q3. Custom API vectors active.</p>
              <button className="w-full py-2.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                Optimize Vectors
              </button>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto">
             <Zap size={18} />
          </div>
        )}
      </div>
    </motion.aside>
  );
}
