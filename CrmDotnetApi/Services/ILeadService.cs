using CrmDotnetApi.Common;
using CrmDotnetApi.DTOs.Leads;

namespace CrmDotnetApi.Services;

public interface ILeadService
{
    Task<Result<PagedResult<LeadResponse>>> GetAllAsync(PaginationQuery pagination);
    Task<Result<LeadResponse>> GetByIdAsync(Guid id);
    Task<Result<LeadResponse>> CreateAsync(LeadRequest request);
    Task<Result<LeadResponse>> UpdateAsync(Guid id, LeadRequest request);
    Task<Result<bool>> DeleteAsync(Guid id);
}