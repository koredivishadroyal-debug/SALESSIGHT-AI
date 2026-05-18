import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ComposedChart, Area
} from 'recharts';
import { CRMData } from '../../types/crm';
import { formatCurrency, cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Filter, Search, MoreHorizontal, ShieldCheck, Zap, Image as ImageIcon, FileCode } from 'lucide-react';
import { exportAsImage } from '../../lib/exportUtils';

interface DetailedAnalyticsProps {
  data: CRMData[];
}

export default function DetailedAnalytics({ data }: DetailedAnalyticsProps) {
  const performanceMetrics = useMemo(() => {
    const regionMetrics: Record<string, { revenue: number, count: number }> = {};
    const productMetrics: Record<string, { revenue: number, count: number }> = {};

    data.forEach(d => {
      if (!regionMetrics[d.region]) regionMetrics[d.region] = { revenue: 0, count: 0 };
      if (!productMetrics[d.product]) productMetrics[d.product] = { revenue: 0, count: 0 };
      
      regionMetrics[d.region].revenue += d.revenue;
      regionMetrics[d.region].count += 1;
      productMetrics[d.product].revenue += d.revenue;
      productMetrics[d.product].count += 1;
    });

    return {
      regions: Object.entries(regionMetrics).map(([name, stats]) => ({
        name,
        revenue: stats.revenue,
        avgDeal: stats.revenue / stats.count,
        count: stats.count
      })).sort((a, b) => b.revenue - a.revenue),
      products: Object.entries(productMetrics).map(([name, stats]) => ({
        name,
        revenue: stats.revenue,
        avgDeal: stats.revenue / stats.count,
        count: stats.count
      })).sort((a, b) => b.revenue - a.revenue)
    };
  }, [data]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          id="growth-matrix-chart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="col-span-2 glass-card p-8 border border-[var(--color-border)] shadow-xl group/card overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-display font-black text-[var(--color-text-main)] mb-1 uppercase tracking-tight italic transition-colors">Growth <span className="text-brand-primary">Matrix</span></h3>
              <p className="text-[10px] text-brand-primary/60 uppercase tracking-[0.4em] font-black">Volume vs Velocity Vector</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 border-r border-[var(--color-border)] pr-6 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <button 
                  onClick={() => exportAsImage('growth-matrix-chart', 'growth-matrix', 'png')}
                  className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
                  title="Export PNG"
                >
                  <ImageIcon size={16} />
                </button>
                <button 
                  onClick={() => exportAsImage('growth-matrix-chart', 'growth-matrix', 'svg')}
                  className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
                  title="Export SVG"
                >
                  <FileCode size={16} />
                </button>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-wider transition-colors">Avg Transaction</p>
                <p className="text-lg font-mono font-bold text-brand-primary">
                  {formatCurrency(performanceMetrics.products[0]?.avgDeal || 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceMetrics.products}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-text-dim)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val}
                />
                <YAxis 
                  stroke="var(--color-text-dim)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(var(--bg-main-rgb), 0.8)', border: '1px solid var(--color-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: 'var(--color-text-main)', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                <Line type="monotone" dataKey="avgDeal" stroke="var(--color-emerald)" strokeWidth={3} dot={{ fill: 'var(--color-emerald)', r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="bg-brand-primary/5 border border-[var(--color-border)] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-500"
        >
           <div className="absolute top-0 right-0 p-4">
             <Activity className="text-brand-primary/10 w-24 h-24" />
           </div>
           <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-lg">
              <TrendingUp size={32} />
           </div>
           <h3 className="text-2xl font-display font-black text-[var(--color-text-main)] mb-2 uppercase tracking-tighter transition-colors">Efficiency Rating</h3>
           <p className="text-emerald-500 text-4xl font-display font-black mb-4 transition-transform hover:scale-110">92.4%</p>
           <p className="text-[var(--color-text-dim)] text-sm max-w-xs leading-relaxed transition-colors">Your sales velocity is currently <span className="text-[var(--color-text-main)] font-semibold transition-colors">14% faster</span> than the industry average for SaaS products.</p>
           <button className="mt-8 px-8 py-3 bg-brand-primary/5 hover:bg-brand-primary/10 text-[var(--color-text-main)] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border border-[var(--color-border)]">
             Explore Details
           </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="col-span-1 bg-gradient-to-br from-brand-primary/20 to-transparent border border-brand-primary/20 rounded-3xl p-6 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-primary/20">
              <Zap size={20} />
            </div>
            <h4 className="text-white font-bold mb-2">Smart Forecast</h4>
            <p className="text-xs text-brand-primary/80 leading-relaxed font-medium">
              Based on current momentum, we project a <strong className="text-white">22% revenue increase</strong> in the EMEA region next quarter.
            </p>
          </div>
          <button className="mt-6 w-full py-2 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95">
            Review Strategy
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-3 bg-main-bg border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500"
        >
          <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-brand-primary/5 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-brand-primary" size={18} />
              <h3 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider transition-colors">Lead Integrity Matrix</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter signals..." 
                  className="bg-brand-primary/5 border border-[var(--color-border)] rounded-lg pl-9 pr-4 py-1.5 text-[10px] text-[var(--color-text-main)] focus:outline-none focus:border-brand-primary/50 w-40 font-medium transition-colors"
                />
              </div>
              <button className="p-1.5 bg-brand-primary/5 border border-[var(--color-border)] rounded-lg text-[var(--color-text-dim)] hover:text-brand-primary transition-colors">
                <Filter size={14} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[9px] font-bold text-[var(--color-text-dim)] uppercase tracking-widest bg-brand-primary/[0.02] transition-colors">
                  <th className="px-6 py-4">Descriptor</th>
                  <th className="px-6 py-4">Territory</th>
                  <th className="px-6 py-4">Valuation</th>
                  <th className="px-6 py-4">Health Index</th>
                  <th className="px-6 py-4">Phase</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-[var(--color-border)] transition-colors">
                {data.slice(0, 5).map((lead, i) => (
                  <tr key={i} className="group hover:bg-brand-primary/[0.02] transition-colors cursor-default">
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-[var(--color-text-main)] group-hover:text-brand-primary transition-colors">{lead.product}</p>
                      <p className="text-[10px] text-[var(--color-text-dim)] transition-colors">{new Date(lead.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-tighter transition-colors">{lead.region}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-brand-primary">{formatCurrency(lead.revenue)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm" />
                        <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Stable</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-brand-primary/10 rounded-md text-[9px] text-brand-primary border border-brand-primary/20 font-bold uppercase tracking-tighter">Growth</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[var(--color-text-dim)] hover:text-brand-primary transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 border border-[var(--color-border)] shadow-xl transition-colors duration-500"
        >
          <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-6 uppercase tracking-wider transition-colors">Regional Density</h3>
          <div className="space-y-6">
            {performanceMetrics.regions.map((region, i) => (
              <div key={region.name} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-dim)] uppercase tracking-tighter transition-colors">{region.name}</p>
                    <p className="text-sm font-bold text-[var(--color-text-main)] transition-colors">{formatCurrency(region.revenue)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[var(--color-text-dim)] uppercase font-bold transition-colors">Vol: {region.count}</p>
                    <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
                      <ArrowUpRight size={12} />
                      +{(10 - i * 2).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(region.revenue / performanceMetrics.regions[0].revenue) * 100}%` }}
                    className="h-full bg-brand-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          id="product-performance-analytics-chart"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card p-8 border border-[var(--color-border)] shadow-xl transition-colors duration-500 group/card overflow-hidden"
        >
           <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--color-text-main)] uppercase tracking-wider transition-colors">Product Performance</h3>
            <div className="flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
              <button 
                onClick={() => exportAsImage('product-performance-analytics-chart', 'product-performance', 'png')}
                className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
                title="Export PNG"
              >
                <ImageIcon size={14} />
              </button>
              <button 
                onClick={() => exportAsImage('product-performance-analytics-chart', 'product-performance', 'svg')}
                className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
                title="Export SVG"
              >
                <FileCode size={14} />
              </button>
            </div>
           </div>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceMetrics.products} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="var(--color-text-dim)" fontSize={10} axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(var(--bg-main-rgb), 0.8)', border: '1px solid var(--color-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: 'var(--color-text-main)', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
