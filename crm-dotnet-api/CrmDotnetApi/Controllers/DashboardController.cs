using CrmDotnetApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrmDotnetApi.Controllers;

public class DashboardController(IDashboardService dashboardService) : ApiControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await dashboardService.GetStatsAsync();
        return ToActionResult(result);
    }
}
