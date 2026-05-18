import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  ShoppingBag, 
  Users, 
  Target,
  BarChart3
} from 'lucide-react';
import { KPIStats } from '../../types/crm';
import { formatCurrency, formatNumber, cn } from '../../lib/utils';
import { motion } from 'motion/react';

import { useTranslation } from 'react-i18next';

interface KPISectionProps {
  stats: KPIStats;
}

interface KPICardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendPositive?: boolean;
  color: 'blue' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';
  delay: number;
}

function KPICard({ label, value, icon: Icon, trend, trendPositive, color, delay }: KPICardProps) {
  const colorMap = {
    blue: "bg-indigo-500",
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-400",
    violet: "bg-purple-500",
    amber: "bg-amber-400",
    rose: "bg-rose-500",
    cyan: "bg-cyan-400",
  };

  const progressMap = {
    blue: "w-[70%]",
    indigo: "w-[85%]",
    emerald: "w-[45%]",
    violet: "w-[60%]",
    amber: "w-[55%]",
    rose: "w-[30%]",
    cyan: "w-[75%]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden p-5 rounded-2xl glass-card border border-[var(--color-border)] shadow-xl transition-all group"
    >
      <p className="text-[var(--color-text-dim)] text-[9px] font-black uppercase tracking-[0.2em] mb-1 group-hover:text-brand-primary transition-colors">{label}</p>
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-display font-black text-[var(--color-text-main)] tracking-tight leading-none">{value}</h3>
        {trend && (
          <span className={cn(
            "text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter",
            trendPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="h-1 w-full bg-[var(--color-border)] rounded-full mt-4 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: progressMap[color].replace('w-[', '').replace('%]', '') + '%' }}
          className={cn("h-full", colorMap[color])} 
        />
      </div>
      
      {/* Absolute icon peek */}
      <Icon size={16} className="absolute top-4 right-4 text-white/10" />
    </motion.div>
  );
}

export default function KPISection({ stats }: KPISectionProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard 
        label={t('dashboard.total_revenue')} 
        value={formatCurrency(stats.totalRevenue)} 
        icon={DollarSign} 
        trend="+18.4%" 
        trendPositive={true}
        color="blue"
        delay={0.1}
      />
      <KPICard 
        label={t('dashboard.active_pipeline')} 
        value={`${stats.conversionRate}%`} 
        icon={Target} 
        trend="+2.1%" 
        trendPositive={true}
        color="emerald"
        delay={0.2}
      />
      <KPICard 
        label={t('common.insights')} 
        value={stats.topRegion} 
        icon={MapPin} 
        color="violet"
        delay={0.3}
      />
      <KPICard 
        label={t('common.customers')} 
        value={formatNumber(stats.activeCustomers)} 
        icon={Users} 
        color="amber"
        delay={0.4}
      />
      <KPICard 
        label={t('dashboard.product_distribution')} 
        value={stats.topProduct} 
        icon={ShoppingBag} 
        color="indigo"
        delay={0.5}
      />
      <KPICard 
        label={t('dashboard.revenue_trend')} 
        value={`${stats.revenueGrowth}%`} 
        icon={TrendingUp} 
        trend="+4.2%" 
        trendPositive={true}
        color="cyan"
        delay={0.6}
      />
      <KPICard 
        label={t('common.forecasting')} 
        value={formatCurrency(stats.salesForecast)} 
        icon={BarChart3} 
        color="violet"
        delay={0.7}
      />
      <KPICard 
        label={t('dashboard.total_revenue')} 
        value={formatCurrency(stats.totalRevenue * 1.2)} 
        icon={Target} 
        color="rose"
        delay={0.8}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        className="col-span-1 sm:col-span-2 lg:col-span-4 bg-brand-primary/10 border border-brand-primary/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-brand-primary">
          <TrendingUp size={120} />
        </div>
        <div className="flex items-center gap-6 z-10">
          <div className="flex -space-x-3">
             {['B', 'D', 'L', 'J'].map((initial, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-main)] bg-brand-primary flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                   {initial}
                </div>
             ))}
          </div>
          <div>
            <h4 className="text-[var(--color-text-main)] font-bold text-sm">{t('dashboard.team_pulse')}</h4>
            <p className="text-xs text-[var(--color-text-dim)]">{t('dashboard.team_desc')}</p>
          </div>
        </div>
        <div className="flex gap-3 z-10">
          <div className="px-4 py-2 bg-[var(--bg-main)]/5 rounded-xl border border-[var(--color-border)] flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{t('dashboard.active_sync')}</span>
          </div>
          <button className="px-6 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(var(--color-primary),0.4)] transition-all">
             {t('dashboard.init_briefing')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
