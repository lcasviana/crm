using CrmDotnetApi.DTOs.Deals;
using CrmDotnetApi.Models;

namespace CrmDotnetApi.DTOs.Leads;

public record LeadResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Source,
    LeadStatus Status,
    List<DealResponse> Deals
);