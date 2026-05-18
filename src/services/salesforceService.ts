import { CRMData } from '../types/crm';

// Mock logic for generating new Salesforce-style records
// In a real app, this would be an API call to a bridge or proxy
export const syncSalesforceData = async (): Promise<CRMData[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const regions = ['North America', 'EMEA', 'APAC', 'LATAM'];
  const products = ['AI Analytics Pro', 'Sales Growth Suite', 'Enterprise CRM', 'Cloud Connect', 'Market Intelligence'];
  const statuses = ['New', 'Contacted', 'Qualified', 'Won'];
  const customers = [
    'Interstellar Logistics', 'BioGenX', 'Specter Dynamics', 'Summit Peak', 'Vertex Solutions'
  ];
  const salespersons = ['Alex Rivera', 'Jordan Smith', 'Sam Taylor', 'Taylor Wong', 'Casey Jones'];

  // Simulate receiving a few new records
  const count = Math.floor(Math.random() * 3) + 1;
  const newData: CRMData[] = Array.from({ length: count }, (_, i) => ({
    id: `sf-${Date.now()}-${i}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    product: products[Math.floor(Math.random() * products.length)],
    revenue: Math.floor(Math.random() * 80000) + 10000,
    date: new Date().toISOString().split('T')[0],
    salesperson: salespersons[Math.floor(Math.random() * salespersons.length)],
    leadStatus: statuses[Math.floor(Math.random() * statuses.length)]
  }));

  return newData;
};
