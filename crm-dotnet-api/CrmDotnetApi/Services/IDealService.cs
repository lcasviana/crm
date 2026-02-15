using CrmDotnetApi.Common;
using CrmDotnetApi.DTOs.Deals;

namespace CrmDotnetApi.Services;

public interface IDealService
{
    Task<Result<PagedResult<DealResponse>>> GetAllAsync(PaginationQuery pagination);
    Task<Result<DealResponse>> GetByIdAsync(Guid id);
    Task<Result<DealResponse>> CreateAsync(DealRequest request);
    Task<Result<DealResponse>> UpdateAsync(Guid id, DealRequest request);
    Task<Result<bool>> DeleteAsync(Guid id);
}