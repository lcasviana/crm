using CrmDotnetApi.DTOs.Deals;
using FluentValidation;

namespace CrmDotnetApi.Validators;

public class DealRequestValidator : AbstractValidator<DealRequest>
{
    public DealRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Value).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Stage).IsInEnum();
        RuleFor(x => x.LeadId).NotEmpty();
    }
}
