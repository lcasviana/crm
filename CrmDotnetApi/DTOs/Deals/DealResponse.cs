using CrmDotnetApi.Models;

namespace CrmDotnetApi.DTOs.Deals;

public record DealResponse(
    Guid Id,
    string Title,
    decimal Value,
    DateTime? CloseDate,
    DealStage Stage,
    Guid LeadId
);