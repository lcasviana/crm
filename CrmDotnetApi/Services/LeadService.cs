using CrmDotnetApi.Common;
using CrmDotnetApi.Data;
using CrmDotnetApi.DTOs.Leads;
using CrmDotnetApi.Mappers;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace CrmDotnetApi.Services;

public class LeadService(CrmDbContext db, IValidator<LeadRequest> validator) : ILeadService
{
    public async Task<Result<List<LeadResponse>>> GetAllAsync()
    {
        var leads = await db.Leads.Include(l => l.Deals).AsNoTracking().ToListAsync();
        return Result<List<LeadResponse>>.Ok(leads.Select(LeadMapper.ToResponse).ToList());
    }

    public async Task<Result<LeadResponse>> GetByIdAsync(Guid id)
    {
        var lead = await db.Leads.Include(l => l.Deals).AsNoTracking().FirstOrDefaultAsync(l => l.Id == id);
        if (lead is null)
            return Result<LeadResponse>.Fail($"Lead with id '{id}' was not found.");

        return Result<LeadResponse>.Ok(LeadMapper.ToResponse(lead));
    }

    public async Task<Result<LeadResponse>> CreateAsync(LeadRequest request)
    {
        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
            return Result<LeadResponse>.Fail(validation.Errors.Select(e => e.ErrorMessage).ToList());

        var entity = LeadMapper.ToEntity(request);
        db.Leads.Add(entity);
        await db.SaveChangesAsync();

        return Result<LeadResponse>.Ok(LeadMapper.ToResponse(entity));
    }

    public async Task<Result<LeadResponse>> UpdateAsync(Guid id, LeadRequest request)
    {
        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
            return Result<LeadResponse>.Fail(validation.Errors.Select(e => e.ErrorMessage).ToList());

        var entity = await db.Leads.Include(l => l.Deals).FirstOrDefaultAsync(l => l.Id == id);
        if (entity is null)
            return Result<LeadResponse>.Fail($"Lead with id '{id}' was not found.");

        LeadMapper.UpdateEntity(entity, request);
        await db.SaveChangesAsync();

        return Result<LeadResponse>.Ok(LeadMapper.ToResponse(entity));
    }

    public async Task<Result<bool>> DeleteAsync(Guid id)
    {
        var entity = await db.Leads.FirstOrDefaultAsync(l => l.Id == id);
        if (entity is null)
            return Result<bool>.Fail($"Lead with id '{id}' was not found.");

        db.Leads.Remove(entity);
        await db.SaveChangesAsync();

        return Result<bool>.Ok(true);
    }
}
