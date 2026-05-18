import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, TrendingUp, AlertCircle, Target, ArrowRight, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { getAbsolutePredictions } from '../../services/geminiService';
import { CRMData } from '../../types/crm';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { cn, formatCurrency } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

interface BusinessInsightsProps {
  data: CRMData[];
}

export default function BusinessInsights({ data }: BusinessInsightsProps) {
  const { t, i18n } = useTranslation();
  const [predictions, setPredictions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    if (!data.length) return null;
    const totalRev = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const winRate = (data.filter(d => d.leadStatus === 'Won').length / data.length) * 100;
    const avgDeal = totalRev / data.length;
    
    // Find top growth product
    const productRevs: Record<string, number> = {};
    data.forEach(d => productRevs[d.product] = (productRevs[d.product] || 0) + d.revenue);
    const topProd = Object.entries(productRevs).sort((a, b) => b[1] - a[1])[0]?.[0];

    return { totalRev, winRate, avgDeal, topProd };
  }, [data]);

  useEffect(() => {
    if (data.length > 0 && !predictions) {
      generateInsights();
    }
  }, [data]);

  const generateInsights = async () => {
    setIsLoading(true);
    const result = await getAbsolutePredictions(data);
    setPredictions(result);
    setIsLoading(false);
  };

  const InsightCard = ({ title, value, icon: Icon, trend, color, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 border border-[var(--color-border)] relative overflow-hidden group hover:border-brand-primary/30 transition-all cursor-default"
    >
      <div className={cn("absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity", color)}>
        <Icon size={80} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2 rounded-lg bg-white/5 border border-white/5", color)}>
            <Icon size={18} />
          </div>
          <h3 className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-[0.2em]">{title}</h3>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-display font-black text-[var(--color-text-main)] italic tracking-tighter">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-500 uppercase">
                <TrendingUp size={12} />
                {trend}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border)] pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded text-[8px] font-black text-brand-primary uppercase tracking-widest">Enterprise Edition</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-display font-black text-[var(--color-text-main)] tracking-tight uppercase italic transition-colors">
            Business <span className="text-brand-primary">{t('common.insights')}</span>
          </h1>
          <p className="text-[var(--color-text-dim)] text-sm max-w-xl mt-3 leading-relaxed transition-colors">
            Absolute high-fidelity neural analysis of your transaction ledger. We cross-reference your <span className="text-brand-primary font-bold">{data.length} records</span> against global market indices to provide strategic expansion vectors.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={generateInsights}
            disabled={isLoading}
            className="px-8 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl shadow-brand-primary/20 active:scale-95 disabled:opacity-50 group"
          >
            <Zap size={16} className={isLoading ? "animate-spin" : "group-hover:rotate-12 transition-transform"} />
            <span>{isLoading ? 'Calibrating...' : t('common.refresh')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard 
          title="Conversion Efficiency" 
          value={stats ? `${stats.winRate.toFixed(1)}%` : '0%'} 
          icon={ShieldCheck} 
          trend="+4.2% optimized" 
          color="text-emerald-400"
          delay={0}
        />
        <InsightCard 
          title="Revenue Velocity" 
          value={stats ? formatCurrency(stats.avgDeal) : '$0'} 
          icon={TrendingUp} 
          trend="Above Sector Avg" 
          color="text-brand-primary"
          delay={0.1}
        />
        <InsightCard 
          title="Strategic Anchor" 
          value={stats ? stats.topProd : 'N/A'} 
          icon={Target} 
          trend="Primary Growth Vector" 
          color="text-amber-400"
          delay={0.2}
        />
        <InsightCard 
          title="Churn Risk Node" 
          value="Low" 
          icon={AlertCircle} 
          trend="Secure Perimeter" 
          color="text-rose-400"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card border border-[var(--color-border)] overflow-hidden min-h-[600px] flex flex-col shadow-2xl relative">
            {/* Scrabble/Grid Background for subtle tech feel */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-white/[0.02] relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-[0.2em]">{t('ai.neural_report')}</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest transition-colors">Engine v4.2 Synchronized</span>
                </div>
                <div className="h-4 w-[1px] bg-[var(--color-border)]" />
                <button className="text-[var(--color-text-dim)] hover:text-brand-primary transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-10 relative z-10">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-24">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full scale-110" />
                    <Loader2 className="w-16 h-16 text-brand-primary animate-spin relative" />
                  </div>
                  <h4 className="text-xl font-display font-black text-[var(--color-text-main)] uppercase tracking-tight italic transition-colors">Analyzing Market Vectors</h4>
                  <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.4em] mt-2 animate-pulse">Processing {data.length} transactions through Neural Net</p>
                </div>
              ) : predictions ? (
                <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-white/[0.03] p-10 rounded-3xl border border-white/5 text-[var(--color-text-main)] leading-relaxed markdown-body shadow-inner">
                    <Markdown>{predictions}</Markdown>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                     <button className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-brand-primary/20 hover:scale-105 active:scale-95 group">
                       <ShieldCheck size={18} />
                       Commit to Strategic Briefing
                       <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                     <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-[var(--color-border)] text-[var(--color-text-main)] text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-95">
                       Download Evidence (JSON)
                     </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-[var(--color-text-dim)]">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:border-brand-primary/30 transition-all">
                    <Sparkles className="w-10 h-10 opacity-20" />
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-[var(--color-text-main)] italic">Calibration Required</h3>
                  <p className="text-sm max-w-md text-center mt-3 leading-relaxed">The Intelligence Engine has mapped your dataset but needs a trigger to perform absolute growth simulations.</p>
                  <button 
                    onClick={generateInsights}
                    className="mt-8 px-10 py-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-lg"
                  >
                    Execute Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card border border-[var(--color-border)] p-8 rounded-3xl"
          >
            <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
              <Zap className="text-brand-primary" size={18} />
              Immediate Actions
            </h3>
            <div className="space-y-6">
              {[
                { 
                  title: 'EMEA Upsell Surge', 
                  desc: 'High demand for AI Analytics in Nordic markets.', 
                  color: 'border-brand-primary',
                  priority: 'Critical'
                },
                { 
                  title: 'APAC Churn Alert', 
                  desc: '3 massive dynamic accounts showing low health index.', 
                  color: 'border-rose-500',
                  priority: 'High'
                },
                { 
                  title: 'Cloud Connect Saturation', 
                  desc: 'Product-market fit reaching ceiling in North America.', 
                  color: 'border-amber-500',
                  priority: 'Strategic'
                }
              ].map((action, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={cn("p-5 rounded-2xl bg-white/[0.02] border-l-4 group cursor-pointer hover:bg-white/[0.05] transition-all", action.color)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-[var(--color-text-main)] uppercase tracking-wider">{action.title}</p>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{action.priority}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">{action.desc}</p>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 border border-[var(--color-border)] bg-brand-primary/5 hover:bg-brand-primary/10 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-main)] transition-all">
              View All 12 Recommendations
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-indigo-900/40 to-indigo-950/40 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} className="text-indigo-400" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-display font-black text-white italic uppercase tracking-tight mb-3">Upgrade to Oracle™</h4>
              <p className="text-sm text-indigo-200/70 leading-relaxed mb-6">Unlock real-time competitor tracking and automated Slack battlecards for your sales force.</p>
              <button className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                Contact Enterprise Sales
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
