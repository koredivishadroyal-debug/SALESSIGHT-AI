import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import KPISection from './components/Dashboard/KPISection';
import ChartsSection from './components/Dashboard/ChartsSection';
import DataUpload from './components/Dashboard/DataUpload';
import ChatAssistant from './components/AI/ChatAssistant';
import DetailedAnalytics from './components/Analytics/DetailedAnalytics';
import BusinessInsights from './components/AI/BusinessInsights';
import CustomerList from './components/Customers/CustomerList';
import ReportManager from './components/Reports/ReportManager';
import SettingsPanel from './components/Settings/SettingsPanel';
import LoginPage from './components/Auth/LoginPage';
import IntroScreen from './components/Auth/IntroScreen';
import UserProfile, { UserProfileData } from './components/Profile/UserProfile';
import ForecastingChart from './components/AI/ForecastingChart';
import SmartTranslator from './components/AI/SmartTranslator';
import LanguageSwitcher from './components/Layout/LanguageSwitcher';
import { CRMData, KPIStats, ViewType } from './types/crm';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  PieChart,
  Settings as SettingsIcon,
  FileText,
  RefreshCw,
  RefreshCcw,
  Lock
} from 'lucide-react';
import { formatCurrency, cn } from './lib/utils';
import { getForecastingInsights } from './services/geminiService';
import { sendNotification } from './services/notificationService';
import { syncSalesforceData } from './services/salesforceService';
import { exportAsImage } from './lib/exportUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ss from 'simple-statistics';

// Helper to generate mock data
const generateMockData = (): CRMData[] => {
  const regions = ['North America', 'EMEA', 'APAC', 'LATAM'];
  const products = ['AI Analytics Pro', 'Sales Growth Suite', 'Enterprise CRM', 'Cloud Connect', 'Market Intelligence'];
  const statuses = ['New', 'Contacted', 'Qualified', 'Lost', 'Won', 'Won', 'Won']; // Weighted towards Won for demo
  const customers = [
    'Nebula Corp', 'Cyberdyne Systems', 'Stark Industries', 'Wayne Enterprises', 
    'Globex', 'Soylent Corp', 'Initech', 'Umbrella Corp', 'Massive Dynamic', 'Aperture Science'
  ];
  const salespersons = ['Alex Rivera', 'Jordan Smith', 'Sam Taylor', 'Taylor Wong', 'Casey Jones'];

  return Array.from({ length: 48 }, (_, i) => ({
    id: `rec-${i}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    product: products[Math.floor(Math.random() * products.length)],
    revenue: Math.floor(Math.random() * 50000) + 5000,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    salesperson: salespersons[Math.floor(Math.random() * salespersons.length)] || salespersons[0],
    leadStatus: statuses[Math.floor(Math.random() * statuses.length)]
  })).sort((a, b) => a.date.localeCompare(b.date));
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [showIntro, setShowIntro] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserProfileData>({
    name: 'Authorized User',
    email: 'admin@sales-sight.ai',
    avatar: '',
    role: 'Managing Director',
    company: 'SalesSight Systems',
    bio: 'Overseeing global operations and strategic AI integration for enterprise clients.'
  });
  
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [crmData, setCrmData] = useState<CRMData[]>([]);

  useEffect(() => {
    // Initialize with mock data for robust demonstration
    if (crmData.length === 0) {
      const mockData = generateMockData();
      setCrmData(mockData);
    }
  }, []);
  const [aiForecast, setAiForecast] = useState<string | null>(null);
  const [isSalesforceConnected, setIsSalesforceConnected] = useState(() => 
    typeof window !== 'undefined' ? localStorage.getItem('sf-connected') === 'true' : false
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSfSync, setLastSfSync] = useState<string | null>(null);

  const [themeMode, setThemeMode] = useState<'terminal' | 'luxury'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sales-sight-theme-mode') : null;
    return (saved as any) || 'terminal';
  });
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sales-sight-theme') : null;
    return saved ? JSON.parse(saved) : {
      primary: '#4f46e5', // Default indigo-600
      accent: '#9333ea'  // Default purple-600
    };
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    localStorage.setItem('sales-sight-theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('sales-sight-theme-mode', themeMode);
    
    // When switching theme mode, reset custom colors to theme defaults if they were default
    if (themeMode === 'luxury' && theme.primary === '#4f46e5') {
       setTheme({ primary: '#d4af37', accent: '#e5e4e2' });
    } else if (themeMode === 'terminal' && theme.primary === '#d4af37') {
       setTheme({ primary: '#4f46e5', accent: '#9333ea' });
    }
  }, [themeMode]);

  useEffect(() => {
    if (crmData.length > 0 && activeView === 'forecasting') {
      getForecastingInsights(crmData, i18n.language).then(setAiForecast);
    }
  }, [crmData, activeView, i18n.language]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsSalesforceConnected(true);
        localStorage.setItem('sf-connected', 'true');
        sendNotification({
          type: 'System',
          subject: 'Salesforce Pipeline Connected',
          message: 'Real-time synchronization with Salesforce instance has been established via OAuth. Incoming opportunities will appear in your ledger automatically.'
        });
        
        // Push to analytics view maybe? Or just show a toast if I had one
        handleManualSync();
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    // Real-time synchronization polling
    let interval: any;
    
    if (isSalesforceConnected) {
      // Immediate sync on connect
      handleManualSync();

      interval = setInterval(async () => {
        setIsSyncing(true);
        try {
          const newData = await syncSalesforceData();
          if (newData.length > 0) {
            setCrmData(prev => {
              // Avoid duplicates by checking IDs
              const existingIds = new Set(prev.map(d => d.id));
              const filteredNewData = newData.filter(d => !existingIds.has(d.id));
              if (filteredNewData.length === 0) return prev;
              
              // Only notify if we actually got new records
              sendNotification({
                type: 'System',
                subject: 'Real-time Synchronized',
                message: `Successfully ingested ${filteredNewData.length} new records from Salesforce.`
              });

              return [...prev, ...filteredNewData].sort((a, b) => a.date.localeCompare(b.date));
            });
            setLastSfSync(new Date().toLocaleTimeString());
          }
        } catch (error) {
          console.error('SF Sync failed', error);
        } finally {
          // Keep the syncing state visible for a moment for UX
          setTimeout(() => setIsSyncing(false), 1500);
        }
      }, 30000); // Sync every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSalesforceConnected]);

  useEffect(() => {
    // Simple Anomaly Detection
    if (crmData.length < 10) return;

    const checkAnomalies = async () => {
      const revenues = crmData.map(d => d.revenue);
      const mean = ss.mean(revenues);
      const stdDev = ss.standardDeviation(revenues);
      
      const anomalies = crmData.filter(d => {
        const zScore = (d.revenue - mean) / stdDev;
        return Math.abs(zScore) > 3; // 3 standard deviations = significant anomaly
      });

      if (anomalies.length > 0) {
        await sendNotification({
          type: 'Anomaly',
          subject: 'Significant Data Anomaly Detected',
          message: `The system has identified ${anomalies.length} transaction entries that deviate significantly from the norm (Z-Score > 3). Please review the high-revenue outliers immediately.`
        });
      }
    };

    checkAnomalies();
  }, [crmData]);

  const stats = useMemo<KPIStats>(() => {
    if (crmData.length === 0) {
      return { 
        totalRevenue: 0, revenueGrowth: 0, topRegion: 'N/A', topProduct: 'N/A', 
        activeCustomers: 0, conversionRate: 0, salesForecast: 0 
      };
    }
    
    const totalRevenue = crmData.reduce((acc, curr) => acc + curr.revenue, 0);
    const regions: Record<string, number> = {};
    const products: Record<string, number> = {};
    const customers = new Set(crmData.map(d => d.customer));
    const wonLeads = crmData.filter(d => d.leadStatus === 'Won').length;

    crmData.forEach(d => {
      regions[d.region] = (regions[d.region] || 0) + d.revenue;
      products[d.product] = (products[d.product] || 0) + d.revenue;
    });

    const topRegion = Object.entries(regions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const topProduct = Object.entries(products).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Simple forecasting based on linear regression
    let forecast = totalRevenue / crmData.length * (crmData.length + 5); 
    try {
      const series = crmData.map((d, i) => [i, d.revenue]);
      const l = ss.linearRegression(series);
      forecast = ss.linearRegressionLine(l)(crmData.length + 1);
    } catch(e) {}

    return {
      totalRevenue,
      revenueGrowth: 15.4, // Mock growth
      topRegion,
      topProduct,
      activeCustomers: customers.size,
      conversionRate: Math.round((wonLeads / crmData.length) * 100),
      salesForecast: forecast > 0 ? forecast : totalRevenue * 1.05
    };
  }, [crmData]);

  if (showIntro) {
    return (
      <AnimatePresence>
        <IntroScreen onComplete={() => setShowIntro(false)} />
      </AnimatePresence>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} themeMode={themeMode} />;
  }

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SalesSight AI', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ENTERPRISE INTELLIGENCE REPORT', 20, 32);
    doc.text(new Date().toLocaleString(), pageWidth - 20, 25, { align: 'right' });

    // Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Executive Summary', 20, 55);
    
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 58, pageWidth - 20, 58);

    doc.setFontSize(12);
    const summaryData = [
      ['Total Revenue:', formatCurrency(stats.totalRevenue)],
      ['Revenue Growth:', `${stats.revenueGrowth}%`],
      ['Top Region:', stats.topRegion],
      ['Top Product:', stats.topProduct],
      ['Active Customers:', stats.activeCustomers.toString()],
      ['Conversion Rate:', `${stats.conversionRate}%`],
      ['Sales Forecast:', formatCurrency(stats.salesForecast)]
    ];

    autoTable(doc, {
      startY: 65,
      head: [],
      body: summaryData,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: { 
        0: { fontStyle: 'bold', minCellWidth: 40 },
        1: { halign: 'left' }
      }
    });

    // Detailed Data Section
    doc.setFontSize(16);
    doc.text('Detailed Transaction Ledger', 20, (doc as any).lastAutoTable.finalY + 15);
    
    const tableData = crmData.map(d => [
      d.customer,
      d.region,
      d.product,
      d.leadStatus,
      formatCurrency(d.revenue),
      d.date
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Customer', 'Region', 'Product', 'Status', 'Revenue', 'Date']],
      body: tableData,
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      styles: { fontSize: 8, cellPadding: 3 },
      margin: { top: 20 }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save(`SalesSight-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportCSV = () => {
    if (crmData.length === 0) return;
    const headers = ['Customer', 'Region', 'Product', 'Status', 'Revenue', 'Date', 'Salesperson'];
    const csvContent = [
      headers.join(','),
      ...crmData.map(d => [
        `"${d.customer.replace(/"/g, '""')}"`,
        `"${d.region.replace(/"/g, '""')}"`,
        `"${d.product.replace(/"/g, '""')}"`,
        `"${d.leadStatus.replace(/"/g, '""')}"`,
        d.revenue,
        `"${d.date}"`,
        `"${d.salesperson.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `SalesSight-Data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (crmData.length === 0) return;
    const jsonString = JSON.stringify(crmData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `SalesSight-Data-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSalesforce = async () => {
    if (isSalesforceConnected) {
      // Disconnect
      setIsSalesforceConnected(false);
      localStorage.setItem('sf-connected', 'false');
      return;
    }

    try {
      // Initiate OAuth
      const response = await fetch('/api/auth/salesforce/url');
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to get auth URL');
      }
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'sf_oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        alert('Popup blocked. Please allow popups to connect Salesforce.');
      }
    } catch (error: any) {
      console.error('SF Auth error:', error);
      alert(`Salesforce Connection Failed: ${error.message}`);
    }
  };

  const handleManualSync = async () => {
     if (!isSalesforceConnected || isSyncing) return;
     setIsSyncing(true);
     try {
       const newData = await syncSalesforceData();
       if (newData.length > 0) {
         setCrmData(prev => {
           const existingIds = new Set(prev.map(d => d.id));
           const filteredNewData = newData.filter(d => !existingIds.has(d.id));
           return [...prev, ...filteredNewData].sort((a, b) => a.date.localeCompare(b.date));
         });
         setLastSfSync(new Date().toLocaleTimeString());
       }
     } finally {
       setTimeout(() => setIsSyncing(false), 1000);
     }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-display font-black text-[var(--color-text-main)] tracking-tight uppercase italic transition-colors">{t('dashboard.title')}</h1>
                <p className="text-brand-primary/60 text-[10px] font-bold uppercase tracking-[0.4em] mt-1">{t('dashboard.subtitle')}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={exportPDF}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
                >
                  <Download size={16} />
                  <span>Export Insight</span>
                </button>
              </div>
            </div>

            <KPISection stats={stats} />
            <ChartsSection data={crmData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider">Transaction Ledger</h3>
                    <button 
                      onClick={() => setActiveView('customers')}
                      className="text-brand-primary text-[10px] font-bold uppercase hover:underline flex items-center gap-1"
                    >
                      View full log <ChevronRight size={12} />
                    </button>
                 </div>
                 <div className="overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[var(--color-text-dim)] border-b border-[var(--color-border)]">
                          <th className="pb-3 font-medium uppercase tracking-wider">Customer</th>
                          <th className="pb-3 font-medium uppercase tracking-wider">Status</th>
                          <th className="pb-3 font-medium uppercase tracking-wider text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y border-[var(--color-border)]">
                        {crmData.slice(-5).map((d) => (
                          <tr key={d.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary/20 transition-colors">
                                  <BarChart3 size={16} />
                                </div>
                                <div>
                                  <p className="font-bold text-[var(--color-text-main)] mb-0.5 transition-colors">{d.customer}</p>
                                  <p className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-tighter transition-colors">{d.product} • {d.region}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight",
                                d.leadStatus === 'Won' ? "bg-emerald-500/10 text-emerald-400" : 
                                d.leadStatus === 'Lost' ? "bg-rose-500/10 text-rose-400" :
                                "bg-brand-primary/10 text-brand-primary"
                              )}>
                                {d.leadStatus}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <p className="font-mono text-[var(--color-text-main)] font-bold transition-colors">{formatCurrency(d.revenue)}</p>
                              <p className="text-[10px] text-[var(--color-text-dim)] transition-colors">{d.date}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </div>
              
              <div className="bg-[#0f0f12] border border-white/10 rounded-2xl flex flex-col relative overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white">AI Analyst</span>
                  </div>
                </div>
                <div className="flex-1 p-5 space-y-4">
                  <div className="bg-white/5 p-4 rounded-xl rounded-tl-none border border-white/5">
                    <p className="text-brand-primary/80 text-[10px] font-bold uppercase tracking-wider mb-2">Automated Discovery</p>
                    <p className="text-xs text-gray-400 leading-relaxed italic">"South region shows <span className="text-emerald-400">12.4%</span> growth momentum compared to last quarter."</p>
                  </div>
                  <div className="bg-brand-primary/10 p-4 rounded-xl rounded-tr-none border border-brand-primary/20">
                    <p className="text-xs text-gray-300 leading-relaxed italic">"Risk detection: Churn for 'AI Analytics Pro' identifies 3 accounts at risk."</p>
                  </div>
                </div>
                <div className="p-5">
                  <button 
                    onClick={() => setActiveView('assistant')}
                    className="w-full py-3 bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 text-brand-primary rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Open Console
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return <DetailedAnalytics data={crmData} />;
      case 'insights':
        return <BusinessInsights data={crmData} />;
      case 'customers':
        return <CustomerList data={crmData} />;
      case 'reports':
        return (
          <ReportManager 
            onExport={(format) => {
              if (format === 'PDF') exportPDF();
              else if (format === 'CSV' || format === 'Excel') exportCSV();
              else if (format === 'JSON') exportJSON();
              else if (format === 'PNG') exportAsImage('main-dashboard-content', 'SalesSight-Snapshot', 'png');
              else if (format === 'SVG') exportAsImage('main-dashboard-content', 'SalesSight-Snapshot', 'svg');
            }} 
          />
        );
      case 'assistant':
        return <ChatAssistant data={crmData} />;
      case 'translator':
        return <SmartTranslator />;
      case 'forecasting':
        return (
          <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl font-display font-black text-[var(--color-text-main)] tracking-tight uppercase italic transition-colors">
                  Predictive <span className="text-brand-primary">Engine</span>
                </h1>
                <p className="text-brand-primary/60 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
                  Advanced Statistical & Neural Growth Calibration
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-brand-primary" />
                    <span className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase tracking-wider">Projected ARR</span>
                  </div>
                  <p className="text-xl font-bold text-[var(--color-text-main)] transition-colors">
                    {formatCurrency(stats.salesForecast * 12)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               {/* Left Column: Metrics & Risk */}
               <div className="space-y-6">
                  <div className="bg-brand-primary rounded-3xl p-8 relative overflow-hidden text-white shadow-2xl group">
                    <div className="absolute top-0 right-0 p-6 opacity-20 transition-transform group-hover:scale-110 duration-500">
                      <TrendingUp size={80} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-white/40 font-bold mb-1 text-[10px] uppercase tracking-[0.2em]">Next Month Forecast</p>
                      <h2 className="text-5xl font-black mb-6 tracking-tighter italic">{formatCurrency(stats.salesForecast)}</h2>
                      <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Confidence Score: 94.8%
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8 border border-[var(--color-border)] rounded-3xl">
                    <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                      <AlertTriangle className="text-amber-500" size={18} />
                      Risk Intelligence Matrix
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em]">
                          <span className="text-[var(--color-text-dim)]">Market Volatility</span>
                          <span className="text-emerald-500">Minimal</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '12%' }} transition={{ duration: 1, delay: 0.5 }} className="bg-emerald-500 h-full" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em]">
                          <span className="text-[var(--color-text-dim)]">Regional Saturation</span>
                          <span className="text-amber-500">Medium Density</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} transition={{ duration: 1, delay: 0.7 }} className="bg-amber-500 h-full" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em]">
                          <span className="text-[var(--color-text-dim)]">Customer Concentration</span>
                          <span className="text-rose-500">Critical Monitor</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1, delay: 0.9 }} className="bg-rose-500 h-full" />
                        </div>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Right Column: Chart */}
               <div className="xl:col-span-2">
                 <ForecastingChart data={crmData} />
               </div>
            </div>

            {/* Bottom Row: Insights */}
            <div className="glass-card p-10 border border-[var(--color-border)] rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[120px] rounded-full -mr-20 -mt-20 group-hover:bg-brand-primary/10 transition-colors duration-1000" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-display font-black text-[var(--color-text-main)] uppercase tracking-tight italic">
                    Strategic AI <span className="text-brand-primary">Recommendations</span>
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-brand-primary uppercase tracking-[0.2em]">Neural Engine v4.2</span>
                  </div>
                </div>
                
                {aiForecast ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="bg-white/[0.02] p-10 rounded-2xl border border-white/5 text-gray-300 leading-relaxed italic text-lg font-serif">
                      {aiForecast}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full" />
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                        className="relative"
                      >
                        <RefreshCw className="text-brand-primary w-12 h-12" />
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-primary">Synthesizing Dataset Dynamics</p>
                      <p className="text-[10px] text-gray-600 mt-2">Calibrating growth vectors and seasonal variances...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'upload':
        return <DataUpload onDataLoaded={setCrmData} currentDataLength={crmData.length} />;
      case 'settings':
        return <SettingsPanel theme={theme} onThemeChange={setTheme} themeMode={themeMode} onThemeModeChange={setThemeMode} />;
      case 'profile':
        return <UserProfile user={userData} onUpdate={setUserData} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-20 text-gray-500">
            <ExternalLink size={48} className="mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-white">Module Initializing</h2>
            <p className="text-sm">This system component is being calibrated for your dataset.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-main-bg font-sans text-gray-200">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={() => setIsAuthenticated(false)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Clean & Elegant Background Gradient */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-1000"
          style={{
            background: themeMode === 'terminal' 
              ? 'radial-gradient(circle at 0% 0%, #0f172a 0%, #020617 100%)'
              : 'radial-gradient(circle at 100% 0%, #fdfbf7 0%, #f5f2ed 100%)'
          }}
        />
        
        {/* Background elements */}
        {themeMode === 'terminal' && (
          <>
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />
          </>
        )}

        <header className="h-16 border-b border-[var(--color-border)] bg-main-bg/5 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0 transition-colors">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold tracking-wide text-[var(--color-text-main)] uppercase transition-colors">Enterprise Analytics</h1>
            <div className="h-4 w-[1px] bg-[var(--color-border)]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[var(--color-text-dim)] font-bold uppercase tracking-widest transition-colors">{activeView}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <div 
              onClick={toggleSalesforce}
              className={cn(
                "hidden lg:flex items-center gap-2 px-3 py-1 border rounded-full group cursor-pointer transition-all",
                isSalesforceConnected 
                  ? "bg-brand-primary/10 border-brand-primary/30" 
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]",
                !isSalesforceConnected ? "bg-gray-600" :
                isSyncing ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              )} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                isSalesforceConnected ? "text-brand-primary" : "text-gray-400 group-hover:text-gray-300"
              )}>
                {isSalesforceConnected 
                  ? (isSyncing ? t('common.syncing') : `${t('common.sf_live')} ${lastSfSync ? `• ${lastSfSync}` : ''}`) 
                  : t('common.connect_sf')}
              </span>
            </div>

            {isSalesforceConnected && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleManualSync();
                }}
                disabled={isSyncing}
                className={cn(
                  "p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all",
                  isSyncing ? "opacity-50 cursor-not-allowed" : "cursor-pointer shadow-sm active:scale-95"
                )}
                title="Force Synchronization"
              >
                <RefreshCw size={14} className={cn(isSyncing ? "animate-spin" : "")} />
              </button>
            )}

            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full group cursor-default">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full bg-emerald-400"
              )} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">
                System Live
              </span>
            </div>
            <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-indigo-500 transition-all">
              <Filter size={14} className="text-gray-500 mr-2" />
              <input type="text" placeholder={t('common.search')} className="bg-transparent border-none text-xs outline-none w-48 text-gray-300 placeholder:text-gray-600" />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveView('profile')}
                className="w-8 h-8 rounded-full bg-brand-primary border-2 border-white/10 shadow-lg cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all overflow-hidden flex items-center justify-center text-[10px] font-bold text-white uppercase"
              >
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userData.name.substring(0, 1)
                )}
              </button>
            </div>
          </div>
        </header>

        <div id="main-dashboard-content" className="flex-1 overflow-y-auto overflow-x-hidden p-8 scrollbar-hide relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
