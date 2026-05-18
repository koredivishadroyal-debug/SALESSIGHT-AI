import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { CRMData } from '../../types/crm';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'motion/react';
import { TrendingUp, Image as ImageIcon, FileCode } from 'lucide-react';
import { exportAsImage } from '../../lib/exportUtils';

import { useTranslation } from 'react-i18next';

interface ChartsSectionProps {
  data: CRMData[];
}

export default function ChartsSection({ data }: ChartsSectionProps) {
  const { t } = useTranslation();
  // ... existing memo processing ...
  const monthlyRevenue = React.useMemo(() => {
    const monthly: Record<string, number> = {};
    data.forEach(d => {
      const month = d.date.substring(0, 7);
      monthly[month] = (monthly[month] || 0) + d.revenue;
    });
    return Object.entries(monthly)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const regionalSales = React.useMemo(() => {
    const regional: Record<string, number> = {};
    data.forEach(d => {
      regional[d.region] = (regional[d.region] || 0) + d.revenue;
    });
    return Object.entries(regional)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const productDistribution = React.useMemo(() => {
    const products: Record<string, number> = {};
    data.forEach(d => {
      products[d.product] = (products[d.product] || 0) + 1;
    });
    return Object.entries(products)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data]);

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f43f5e'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div 
        id="revenue-trend-chart"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="glass-card p-6 border border-[var(--color-border)] shadow-xl transition-all group/card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider transition-colors">{t('dashboard.revenue_trend')}</h3>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-[10px] uppercase font-bold text-[var(--color-text-dim)]">
              <span className="flex items-center gap-1 text-brand-primary"><span className="w-2 h-2 rounded-full bg-brand-primary"></span> Actual</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
              <button 
                onClick={() => exportAsImage('revenue-trend-chart', 'revenue-trend', 'png')}
                className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
                title="Export PNG"
              >
                <ImageIcon size={14} />
              </button>
              <button 
                onClick={() => exportAsImage('revenue-trend-chart', 'revenue-trend', 'svg')}
                className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
                title="Export SVG"
              >
                <FileCode size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(str) => {
                  const [y, m] = str.split('-');
                  const date = new Date(parseInt(y), parseInt(m) - 1);
                  return date.toLocaleString('default', { month: 'short' }).toUpperCase();
                }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(var(--bg-main-rgb), 0.8)', border: '1px solid var(--color-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: 'var(--color-text-main)', fontSize: '12px' }}
                labelStyle={{ color: 'var(--color-text-dim)', fontSize: '10px', marginBottom: '4px' }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        id="regional-performance-chart"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        className="glass-card p-6 border border-[var(--color-border)] shadow-xl transition-all group/card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider transition-colors">{t('dashboard.regional_performance')}</h3>
          <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <button 
              onClick={() => exportAsImage('regional-performance-chart', 'regional-performance', 'png')}
              className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
              title="Export PNG"
            >
              <ImageIcon size={14} />
            </button>
            <button 
              onClick={() => exportAsImage('regional-performance-chart', 'regional-performance', 'svg')}
              className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
              title="Export SVG"
            >
              <FileCode size={14} />
            </button>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalSales} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                width={80}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(var(--bg-main-rgb), 0.8)', border: '1px solid var(--color-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                itemStyle={{ color: 'var(--color-text-main)', fontSize: '12px' }}
                cursor={{ fill: 'var(--brand-primary)', opacity: 0.05 }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {regionalSales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        id="product-distribution-chart"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        className="glass-card p-6 border border-[var(--color-border)] shadow-xl transition-all group/card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider transition-colors">{t('dashboard.product_distribution')}</h3>
          <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <button 
              onClick={() => exportAsImage('product-distribution-chart', 'product-distribution', 'png')}
              className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
              title="Export PNG"
            >
              <ImageIcon size={14} />
            </button>
            <button 
              onClick={() => exportAsImage('product-distribution-chart', 'product-distribution', 'svg')}
              className="p-1.5 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors"
              title="Export SVG"
            >
              <FileCode size={14} />
            </button>
          </div>
        </div>
        <div className="h-80 w-full flex items-center">
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(var(--bg-main-rgb), 0.8)', border: '1px solid var(--color-border)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: 'var(--color-text-main)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-3">
            {productDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-tight truncate transition-colors">{item.name}</span>
                </div>
                <span className="text-[10px] text-[var(--color-text-main)] font-mono transition-colors">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl shadow-xl backdrop-blur-md flex flex-col justify-center items-center text-center p-12 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-primary/10 blur-3xl rounded-full" />
        <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-6 shadow-lg">
          <TrendingUp size={32} />
        </div>
        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2 tracking-tight transition-colors">Predictive Insight</h3>
        <p className="text-[var(--color-text-dim)] text-sm max-w-xs mb-8 leading-relaxed transition-colors">System has identified a seasonal surge pattern in the South region. Forecast accuracy: 92%.</p>
        <button className="px-8 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-brand-primary/20 active:scale-95">
          View Forecast
        </button>
      </motion.div>
    </div>
  );
}
