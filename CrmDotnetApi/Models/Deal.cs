namespace CrmDotnetApi.Models;

public class Deal
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public decimal Value { get; set; }
    public DateTime? CloseDate { get; set; }
    public DealStage Stage { get; set; } = DealStage.Prospecting;
    public Guid LeadId { get; set; }
    public Lead? Lead { get; set; }
}