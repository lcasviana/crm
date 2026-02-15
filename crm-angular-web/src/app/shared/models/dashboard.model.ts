export interface DashboardStats {
  totalRevenue: number;
  conversionRate: number;
  monthlyDealVolumes: MonthlyDealVolume[];
  leadSourceDistributions: LeadSourceDistribution[];
}

export interface MonthlyDealVolume {
  month: string;
  revenue: number;
  count: number;
}

export interface LeadSourceDistribution {
  source: string;
  count: number;
}
