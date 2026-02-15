using System.ComponentModel.DataAnnotations;

namespace CrmDotnetApi.Models;

public class Lead
{
    public Guid Id { get; init; }

    [MaxLength(100)] public required string FirstName { get; set; }

    [MaxLength(100)] public required string LastName { get; set; }

    [MaxLength(254)] public required string Email { get; set; }

    [MaxLength(20)] public string? Phone { get; set; }

    [MaxLength(100)] public string? Source { get; set; }

    public LeadStatus Status { get; set; } = LeadStatus.New;

    public List<Deal> Deals { get; init; } = [];
}