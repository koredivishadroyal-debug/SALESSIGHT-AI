export interface CRMData {
  id: string;
  customer: string;
  region: string;
  product: string;
  revenue: number;
  date: string;
  salesperson: string;
  leadStatus: string; // 'New', 'Contacted', 'Qualified', 'Lost', 'Won'
}

export interface KPIStats {
  totalRevenue: number;
  revenueGrowth: number;
  topRegion: string;
  topProduct: string;
  activeCustomers: number;
  conversionRate: number;
  salesForecast: number;
}

export type ViewType = 'dashboard' | 'analytics' | 'assistant' | 'forecasting' | 'insights' | 'customers' | 'upload' | 'reports' | 'settings' | 'profile' | 'translator';
