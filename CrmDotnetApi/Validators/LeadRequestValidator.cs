using CrmDotnetApi.DTOs.Leads;
using FluentValidation;

namespace CrmDotnetApi.Validators;

public class LeadRequestValidator : AbstractValidator<LeadRequest>
{
    public LeadRequestValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Phone).MaximumLength(20).When(x => x.Phone is not null);
        RuleFor(x => x.Source).MaximumLength(100).When(x => x.Source is not null);
        RuleFor(x => x.Status).IsInEnum();
    }
}
