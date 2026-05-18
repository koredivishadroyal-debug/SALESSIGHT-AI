import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, Info } from 'lucide-react';
import Papa from 'papaparse';
import { CRMData } from '../../types/crm';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { isValid, parseISO } from 'date-fns';

interface DataUploadProps {
  onDataLoaded: (data: CRMData[]) => void;
  currentDataLength: number;
}

interface ValidationError {
  row: number;
  message: string;
}

export default function DataUpload({ onDataLoaded, currentDataLength }: DataUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(false);

  const validateData = (data: any[]): { formatted: CRMData[], errors: ValidationError[] } => {
    const errors: ValidationError[] = [];
    const formatted: CRMData[] = [];

    data.forEach((row, index) => {
      const rowNum = index + 1;
      const rowErrors: string[] = [];

      // Required fields check
      const required = ['customer', 'region', 'product', 'revenue', 'date'];
      required.forEach(field => {
        if (!row[field] && row[field] !== 0) {
          rowErrors.push(`Missing ${field}`);
        }
      });

      // Type validation
      if (row.revenue && isNaN(Number(row.revenue))) {
        rowErrors.push('Revenue must be a number');
      }

      if (row.date) {
        const date = typeof row.date === 'string' ? parseISO(row.date) : new Date(row.date);
        if (!isValid(date)) {
          rowErrors.push('Invalid date format (use YYYY-MM-DD)');
        }
      }

      if (rowErrors.length > 0) {
        errors.push({ row: rowNum, message: rowErrors.join(', ') });
      } else {
        formatted.push({
          id: row.id || `row-${index}-${Date.now()}`,
          customer: String(row.customer),
          region: String(row.region),
          product: String(row.product),
          revenue: Number(row.revenue),
          date: String(row.date),
          salesperson: row.salesperson ? String(row.salesperson) : 'Unassigned',
          leadStatus: String(row.leadstatus || row.leadStatus || 'New')
        });
      }
    });

    return { formatted, errors };
  };

  const processFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors([]);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim().replace(/\s+/g, ''),
      complete: (results) => {
        setLoading(false);
        const rawData = results.data as any[];
        
        if (rawData.length === 0) {
          setError('The CSV file is empty.');
          return;
        }

        // Check headers (normalized by transformHeader)
        const requiredHeaders = ['customer', 'region', 'product', 'revenue', 'date'];
        const headers = results.meta.fields?.map(h => h.toLowerCase().trim().replace(/\s+/g, '')) || [];
        const missing = requiredHeaders.filter(h => !headers.includes(h));

        if (missing.length > 0) {
          setError(`Required columns missing: ${missing.join(', ')}`);
          return;
        }

        const { formatted, errors } = validateData(rawData);

        if (errors.length > 0) {
          setValidationErrors(errors.slice(0, 10)); // Show top 10 errors
          if (formatted.length === 0) {
            setError('All records failed validation. Please check your data types.');
          } else {
            setError(`${errors.length} records skipped due to validation errors.`);
            onDataLoaded(formatted);
          }
        } else {
          onDataLoaded(formatted);
        }
      },
      error: (err) => {
        setLoading(false);
        setError(`Error parsing CSV: ${err.message}`);
      }
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-black text-[var(--color-text-main)] tracking-tight uppercase italic transition-colors">
          Secure <span className="text-brand-primary">Data</span> Ingestion
        </h1>
        <p className="text-[var(--color-text-dim)] text-[10px] font-bold uppercase tracking-[0.4em] transition-colors">
          High-Performance CRM Dataset Processing
        </p>
      </div>

      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-500 flex flex-col items-center justify-center gap-6 glass-card",
          isDragging ? "border-brand-primary bg-brand-primary/10 scale-[1.02] shadow-[0_0_30px_rgba(79,70,229,0.2)]" : "border-[var(--color-border)]",
          loading && "opacity-50 pointer-events-none"
        )}
      >
        <div className="w-20 h-20 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center text-brand-primary shadow-xl group-hover:scale-110 transition-transform">
          <Upload size={40} />
        </div>
        
        <div className="text-center">
          <p className="text-xl font-display font-black text-[var(--color-text-main)] uppercase tracking-tight transition-colors">
            {loading ? "Decrypting Protocol..." : "Drop Secured Dataset"}
          </p>
          <p className="text-[var(--color-text-dim)] text-xs mt-2 transition-colors font-medium">Neural processing ready for CSV ingestion</p>
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={onFileInput}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="flex gap-4 mt-2">
          {['Identity', 'Revenue', 'Territory', 'Status'].map(field => (
            <div key={field} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[var(--color-text-dim)] bg-white/5 px-3 py-1.5 rounded-full border border-white/5 transition-colors">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>{field}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-6 rounded-3xl flex items-start gap-4"
        >
          <AlertCircle size={24} className="mt-1" />
          <div>
            <p className="text-sm font-black uppercase tracking-widest">Protocol Deviation Detected</p>
            <p className="text-xs mt-1 text-rose-400/80">{error}</p>
          </div>
        </motion.div>
      )}

      {currentDataLength > 0 && (
        <div className="glass-card p-8 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-[var(--color-text-main)] uppercase tracking-tight transition-colors">Active Protocol</h3>
                <p className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-widest">{currentDataLength} Secure Records Loaded</p>
              </div>
            </div>
             <button 
              onClick={() => onDataLoaded([])}
              className="p-3 text-[var(--color-text-dim)] hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
            >
              <Trash2 size={24} />
            </button>
          </div>
          
          <div className="bg-white/[0.02] border border-[var(--color-border)] rounded-2xl p-6 text-center">
             <p className="text-xs font-bold text-[var(--color-text-dim)] uppercase tracking-widest">Data is currently live in memory and ready for strategic analysis.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 glass-card border border-[var(--color-border)]">
          <h4 className="text-sm font-black text-[var(--color-text-main)] mb-4 flex items-center gap-2 uppercase tracking-widest transition-colors transition-colors">
            <Info size={16} className="text-brand-primary" />
            Ingestion Blueprint
          </h4>
          <ul className="text-[10px] text-[var(--color-text-dim)] space-y-3 font-bold uppercase tracking-widest transition-colors">
            <li className="flex items-center gap-2"><span className="text-brand-primary">•</span> Header calibration required</li>
            <li className="flex items-center gap-2"><span className="text-brand-primary">•</span> Absolute Columns: <span className="text-[var(--color-text-main)]">Customer, Revenue, Region, Date</span></li>
            <li className="flex items-center gap-2"><span className="text-brand-primary">•</span> ISO Temporal Matrix: <span className="text-[var(--color-text-main)] font-mono tracking-tighter">YYYY-MM-DD</span></li>
            <li className="flex items-center gap-2"><span className="text-brand-primary">•</span> Scalar values for revenue metrics</li>
          </ul>
        </div>
        <div className="p-8 bg-brand-primary/[0.03] border border-brand-primary/10 rounded-3xl flex flex-col justify-center items-center text-center">
          <CheckCircle2 className="text-brand-primary mb-4 w-12 h-12 opacity-50" />
          <p className="text-xs text-brand-primary font-bold uppercase tracking-widest leading-relaxed">
            "Direct In-Memory Processing: Your data is processed locally for maximum performance and security."
          </p>
        </div>
      </div>
    </div>
  );
}
