using CrmDotnetApi.Common;
using CrmDotnetApi.DTOs.Dashboard;

namespace CrmDotnetApi.Services;

public interface IDashboardService
{
    Task<Result<DashboardStatsResponse>> GetStatsAsync();
}
