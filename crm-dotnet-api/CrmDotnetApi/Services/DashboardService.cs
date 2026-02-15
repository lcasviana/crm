using CrmDotnetApi.Common;
using CrmDotnetApi.Data;
using CrmDotnetApi.DTOs.Dashboard;
using CrmDotnetApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CrmDotnetApi.Services;

public class DashboardService(CrmDbContext db) : IDashboardService
{
    public async Task<Result<DashboardStatsResponse>> GetStatsAsync()
    {
        try
        {
            var totalRevenue = await db.Deals
                .Where(d => d.Stage == DealStage.ClosedWon)
                .SumAsync(d => d.Value);

            var totalLeads = await db.Leads.CountAsync();
            var leadsWithDeals = await db.Deals
                .Select(d => d.LeadId)
                .Distinct()
                .CountAsync();
            var conversionRate = totalLeads > 0
                ? Math.Round((double)leadsWithDeals / totalLeads * 100, 1)
                : 0;

            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
            var monthlyVolumes = await db.Deals
                .Where(d => d.Stage == DealStage.ClosedWon && d.CloseDate != null && d.CloseDate >= sixMonthsAgo)
                .ToListAsync();

            var monthlyDealVolumes = monthlyVolumes
                .GroupBy(d => d.CloseDate!.Value.ToString("yyyy-MM"))
                .OrderBy(g => g.Key)
                .Select(g => new MonthlyDealVolume(g.Key, g.Sum(d => d.Value), g.Count()))
                .ToList();

            var leadSourceDistributions = await db.Leads
                .GroupBy(l => l.Source ?? "Unknown")
                .Select(g => new LeadSourceDistribution(g.Key, g.Count()))
                .ToListAsync();

            var stats = new DashboardStatsResponse(
                totalRevenue,
                conversionRate,
                monthlyDealVolumes,
                leadSourceDistributions
            );

            return Result<DashboardStatsResponse>.Ok(stats);
        }
        catch (Exception ex)
        {
            return Result<DashboardStatsResponse>.Fail($"Failed to retrieve dashboard stats: {ex.Message}");
        }
    }
}
