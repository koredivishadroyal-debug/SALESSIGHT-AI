import React, { useMemo, useState } from 'react';
import { CRMData } from '../../types/crm';
import { formatCurrency, cn } from '../../lib/utils';
import { 
  Users, Search, Filter, MoreHorizontal, Mail, Phone, 
  ExternalLink, ArrowUpDown, ChevronLeft, ChevronRight,
  ShieldCheck, Clock, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerListProps {
  data: CRMData[];
}

export default function CustomerList({ data }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');

  const customers = useMemo(() => {
    const customerMap: Record<string, {
      name: string;
      region: string;
      totalRevenue: number;
      lastPurchase: string;
      products: Set<string>;
      status: string;
    }> = {};

    data.forEach(d => {
      if (!customerMap[d.customer]) {
        customerMap[d.customer] = {
          name: d.customer,
          region: d.region,
          totalRevenue: 0,
          lastPurchase: d.date,
          products: new Set(),
          status: 'Active'
        };
      }
      
      const c = customerMap[d.customer];
      c.totalRevenue += d.revenue;
      c.products.add(d.product);
      if (new Date(d.date) > new Date(c.lastPurchase)) {
        c.lastPurchase = d.date;
      }
    });

    return Object.values(customerMap).filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = filterRegion === 'All' || c.region === filterRegion;
      return matchesSearch && matchesRegion;
    });
  }, [data, searchTerm, filterRegion]);

  const regions = ['All', ...new Set(data.map(d => d.region))];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border border-[var(--color-border)]">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] group-focus-within:text-brand-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search enterprise clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-primary/5 border border-[var(--color-border)] rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-brand-primary/50 transition-all text-[var(--color-text-main)] placeholder:text-[var(--color-text-dim)]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-[var(--color-text-main)] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
             {regions.map(r => (
               <button
                key={r}
                onClick={() => setFilterRegion(r)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
                  filterRegion === r 
                    ? "bg-brand-primary text-white border-brand-primary/50 shadow-lg" 
                    : "bg-brand-primary/5 text-[var(--color-text-dim)] border-[var(--color-border)] hover:bg-brand-primary/10 hover:text-[var(--color-text-main)]"
                )}
               >
                 {r}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-main-bg border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-primary/5 border-b border-[var(--color-border)]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-dim)]">
                  <div className="flex items-center gap-2">Client Entity <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-dim)]">Geography</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-dim)] text-right">LTV Gross</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-dim)] text-right">Last Engagement</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-dim)] text-right">Solutions</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-dim)] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--color-border)]">
              <AnimatePresence>
                {customers.map((c) => (
                  <motion.tr 
                    key={c.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-brand-primary/[0.02] transition-all"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-[var(--color-border)] flex items-center justify-center text-brand-primary font-bold text-xs">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-text-main)] text-sm group-hover:text-brand-primary transition-colors">{c.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <ShieldCheck size={10} className="text-emerald-500" />
                             <span className="text-[10px] text-[var(--color-text-dim)] tracking-tighter">Verified Enterprise</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded-lg bg-brand-primary/5 border border-[var(--color-border)] text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-tighter">
                        {c.region}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="font-mono font-bold text-[var(--color-text-main)] text-sm transition-colors">{formatCurrency(c.totalRevenue)}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-[var(--color-text-dim)] text-[10px] font-bold uppercase tabular-nums transition-colors">
                        <Clock size={12} className="text-[var(--color-text-dim)] opacity-60" />
                        {c.lastPurchase}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-tighter truncate max-w-[120px] transition-colors">
                        {Array.from(c.products).join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 bg-brand-primary/5 hover:bg-brand-primary/20 text-[var(--color-text-dim)] hover:text-brand-primary rounded-lg transition-all border border-[var(--color-border)]">
                          <Mail size={14} />
                        </button>
                        <button className="p-2 bg-brand-primary/5 hover:bg-brand-primary/10 text-[var(--color-text-dim)] hover:text-[var(--color-text-main)] rounded-lg transition-all border border-[var(--color-border)]">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {customers.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-brand-primary/5 rounded-full flex items-center justify-center mb-6 border border-[var(--color-border)]">
               <Users className="text-[var(--color-text-dim)] w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">No customers identified</h3>
            <p className="text-[var(--color-text-dim)] max-w-sm mx-auto text-sm leading-relaxed">Adjust your search parameters or filters to locate specific client entities in your dataset.</p>
          </div>
        )}

        <div className="px-6 py-4 bg-brand-primary/5 border-t border-[var(--color-border)] flex items-center justify-between">
           <p className="text-xs text-[var(--color-text-dim)] font-bold uppercase tracking-widest">
             Total Records: <span className="text-[var(--color-text-main)]">{customers.length}</span>
           </p>
           <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-brand-primary/5 text-[var(--color-text-dim)] disabled:opacity-30 cursor-not-allowed">
                <ChevronLeft size={16} />
              </button>
              <div className="bg-brand-primary/5 px-4 py-2 rounded-lg text-[10px] font-bold text-[var(--color-text-main)] uppercase border border-[var(--color-border)]">
                Page 1 of 1
              </div>
              <button className="p-2 rounded-lg bg-brand-primary/5 text-[var(--color-text-dim)] disabled:opacity-30 cursor-not-allowed">
                <ChevronRight size={16} />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
