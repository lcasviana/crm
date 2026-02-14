using CrmDotnetApi.DTOs.Leads;
using CrmDotnetApi.Models;

namespace CrmDotnetApi.Mappers;

public static class LeadMapper
{
    public static Lead ToEntity(LeadRequest request) => new()
    {
        Id = Guid.NewGuid(),
        FirstName = request.FirstName,
        LastName = request.LastName,
        Email = request.Email,
        Phone = request.Phone,
        Source = request.Source,
        Status = request.Status
    };

    public static void UpdateEntity(Lead entity, LeadRequest request)
    {
        entity.FirstName = request.FirstName;
        entity.LastName = request.LastName;
        entity.Email = request.Email;
        entity.Phone = request.Phone;
        entity.Source = request.Source;
        entity.Status = request.Status;
    }

    public static LeadResponse ToResponse(Lead entity) => new(
        entity.Id,
        entity.FirstName,
        entity.LastName,
        entity.Email,
        entity.Phone,
        entity.Source,
        entity.Status,
        entity.Deals.Select(DealMapper.ToResponse).ToList()
    );
}
