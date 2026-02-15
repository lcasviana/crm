namespace CrmDotnetApi.DTOs.Dashboard;

public record DashboardStatsResponse(
    decimal TotalRevenue,
    double ConversionRate,
    List<MonthlyDealVolume> MonthlyDealVolumes,
    List<LeadSourceDistribution> LeadSourceDistributions
);

public record MonthlyDealVolume(string Month, decimal Revenue, int Count);

public record LeadSourceDistribution(string Source, int Count);
