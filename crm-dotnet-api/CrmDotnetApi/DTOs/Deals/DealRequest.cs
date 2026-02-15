using CrmDotnetApi.Models;

namespace CrmDotnetApi.DTOs.Deals;

public record DealRequest(
    string Title,
    decimal Value,
    DateTime? CloseDate,
    DealStage Stage,
    Guid LeadId
);