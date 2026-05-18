import React, { useState } from 'react';
import { 
  FileText, Download, Share2, Briefcase, Calendar, 
  Settings as SettingsIcon, Layout, PieChart, Info,
  CheckCircle2, Clock, Trash2, Send
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { sendNotification } from '../../services/notificationService';

interface ReportManagerProps {
  onExport: (format: 'PDF' | 'CSV' | 'JSON' | 'Excel' | 'PNG' | 'SVG') => void;
}

export default function ReportManager({ onExport }: ReportManagerProps) {
  const [activeTab, setActiveTab ] = useState<'templates' | 'scheduled' | 'history'>('templates');

  const handleGenerate = async (templateName: string, format: string) => {
    onExport(format as any);
    await sendNotification({
      type: 'Report',
      subject: `Report Generated: ${templateName}`,
      message: `The ${templateName} has been successfully generated in ${format} format and is ready for download.`
    });
  };

  const templates = [
    { id: '1', name: 'Executive Sales Summary', type: 'Strategic', format: 'PDF', icon: Briefcase, color: 'text-indigo-400' },
    { id: '2', name: 'Regional Growth Forecast', type: 'Predictive', format: 'Excel', icon: PieChart, color: 'text-emerald-400' },
    { id: '3', name: 'Product Segmentation Analysis', type: 'Technical', format: 'PDF', icon: Layout, color: 'text-purple-400' },
    { id: '6', name: 'Dashboard Snapshot', type: 'Visual', format: 'PNG', icon: PieChart, color: 'text-rose-400' },
    { id: '7', name: 'Forecast Vector Graphics', type: 'Technical', format: 'SVG', icon: Layout, color: 'text-blue-400' },
    { id: '4', name: 'Dataset Raw Export (CSV)', type: 'Raw', format: 'CSV', icon: FileText, color: 'text-gray-400' },
    { id: '5', name: 'Dataset Raw Export (JSON)', type: 'Raw', format: 'JSON', icon: FileText, color: 'text-amber-400' },
  ];

  const histories = [
    { id: 'h1', name: 'Q3 Global Performance', date: '2024-05-15', status: 'Completed', size: '2.4MB' },
    { id: 'h2', name: 'Monthly Account Review', date: '2024-05-10', status: 'Completed', size: '1.8MB' },
    { id: 'h3', name: 'Weekly Region Sync', date: '2024-05-01', status: 'Archive', size: '4.2MB' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
           {['templates', 'scheduled', 'history'].map((tab) => (
             <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border text-left",
                activeTab === tab 
                  ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary shadow-sm" 
                  : "bg-transparent border-transparent text-[var(--color-text-dim)] hover:text-[var(--color-text-main)] hover:bg-brand-primary/5"
              )}
             >
               <div className={cn("w-1.5 h-1.5 rounded-full transition-all", activeTab === tab ? "bg-brand-primary scale-110" : "bg-transparent")} />
               {tab}
             </button>
           ))}
        </div>

        <div className="md:col-span-3 space-y-6">
           <AnimatePresence mode="wait">
            {activeTab === 'templates' && (
              <motion.div 
                key="templates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {templates.map(t => (
                  <div key={t.id} className="glass-card p-6 border border-[var(--color-border)] rounded-3xl hover:border-brand-primary/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <t.icon size={64} className="text-brand-primary" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20", t.color)}>
                        <t.icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono text-[var(--color-text-dim)] tracking-tighter uppercase transition-colors">{t.format}</span>
                    </div>
                    <h4 className="text-[var(--color-text-main)] font-bold text-sm mb-1 transition-colors">{t.name}</h4>
                    <p className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-widest mb-6 transition-colors">{t.type}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleGenerate(t.name, t.format)}
                        className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
                      >
                        Generate now
                      </button>
                      <button className="p-2.5 bg-brand-primary/5 hover:bg-brand-primary/10 text-[var(--color-text-dim)] hover:text-brand-primary rounded-xl border border-[var(--color-border)] transition-all">
                        <SettingsIcon size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-main-bg border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="p-6 border-b border-[var(--color-border)] bg-brand-primary/5 flex items-center justify-between transition-colors">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] transition-colors">Export Registry</h3>
                   <button className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:underline">Clear Logs</button>
                </div>
                <div className="divide-y border-[var(--color-border)] transition-colors">
                  {histories.map(h => (
                    <div key={h.id} className="p-6 flex items-center justify-between hover:bg-brand-primary/[0.02] transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/5 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-dim)]">
                             <FileText size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-[var(--color-text-main)] mb-0.5 transition-colors">{h.name}</p>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-widest transition-colors">{h.date}</span>
                                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                                <span className="text-[10px] text-[var(--color-text-dim)] font-mono italic transition-colors">{h.size}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                             <CheckCircle2 size={12} className="text-emerald-500" />
                             <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-500">{h.status}</span>
                          </div>
                          <button className="p-2 text-[var(--color-text-dim)] hover:text-brand-primary transition-colors">
                             <Download size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'scheduled' && (
              <motion.div 
                key="scheduled"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card border border-[var(--color-border)] rounded-3xl p-12 text-center shadow-xl"
              >
                 <div className="w-20 h-20 bg-brand-primary/10 border border-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
                    <Clock size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2 transition-colors">Automated Operations</h3>
                 <p className="text-[var(--color-text-dim)] max-w-sm mx-auto text-sm leading-relaxed mb-8 transition-colors">Schedule recurring insights directly to your Slack, Email, or Webhook endpoint.</p>
                 <button className="px-8 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-brand-primary/20 active:scale-95">
                   Create workflow
                 </button>
              </motion.div>
            )}
           </AnimatePresence>
        </div>
      </div>

      <div className="bg-brand-primary/5 border border-brand-primary/20 p-8 rounded-3xl relative overflow-hidden group">
         <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px] group-hover:bg-brand-primary/20 transition-all duration-1000" />
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary">
                 <Share2 size={28} />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-1 transition-colors">Collaboration Sync</h3>
                 <p className="text-sm text-[var(--color-text-dim)] transition-colors">Connect with your team instantly. Shared reports now support live annotations.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="hidden sm:flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-main)] bg-brand-primary/10 flex items-center justify-center text-[10px] font-bold text-brand-primary transition-colors">
                       U{i}
                    </div>
                  ))}
               </div>
               <button className="px-6 py-2.5 bg-brand-primary text-white hover:bg-brand-primary/90 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg">
                 Invite Team
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
