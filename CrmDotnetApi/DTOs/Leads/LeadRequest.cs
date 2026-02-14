using CrmDotnetApi.Models;

namespace CrmDotnetApi.DTOs.Leads;

public record LeadRequest(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Source,
    LeadStatus Status = LeadStatus.New
);
