using CrmDotnetApi.DTOs.Deals;
using CrmDotnetApi.Models;

namespace CrmDotnetApi.Mappers;

public static class DealMapper
{
    public static Deal ToEntity(DealRequest request) => new()
    {
        Id = Guid.NewGuid(),
        Title = request.Title,
        Value = request.Value,
        CloseDate = request.CloseDate,
        Stage = request.Stage,
        LeadId = request.LeadId
    };

    public static void UpdateEntity(Deal entity, DealRequest request)
    {
        entity.Title = request.Title;
        entity.Value = request.Value;
        entity.CloseDate = request.CloseDate;
        entity.Stage = request.Stage;
        entity.LeadId = request.LeadId;
    }

    public static DealResponse ToResponse(Deal entity) => new(
        entity.Id,
        entity.Title,
        entity.Value,
        entity.CloseDate,
        entity.Stage,
        entity.LeadId
    );
}
