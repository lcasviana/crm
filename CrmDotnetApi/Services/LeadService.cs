using CrmDotnetApi.Common;
using CrmDotnetApi.Data;
using CrmDotnetApi.DTOs.Leads;
using CrmDotnetApi.Mappers;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace CrmDotnetApi.Services;

public class LeadService(CrmDbContext db, IValidator<LeadRequest> validator) : ILeadService
{
    public async Task<Result<PagedResult<LeadResponse>>> GetAllAsync(PaginationQuery pagination)
    {
        try
        {
            var totalCount = await db.Leads.CountAsync();
            var leads = await db.Leads
                .Include(l => l.Deals)
                .AsNoTracking()
                .Skip((pagination.Page - 1) * pagination.PageSize)
                .Take(pagination.PageSize)
                .ToListAsync();

            var pagedResult = new PagedResult<LeadResponse>(
                leads.Select(LeadMapper.ToResponse).ToList(),
                pagination.Page,
                pagination.PageSize,
                totalCount
            );

            return Result<PagedResult<LeadResponse>>.Ok(pagedResult);
        }
        catch (Exception ex)
        {
            return Result<PagedResult<LeadResponse>>.Fail($"Failed to retrieve leads: {ex.Message}");
        }
    }

    public async Task<Result<LeadResponse>> GetByIdAsync(Guid id)
    {
        try
        {
            var lead = await db.Leads.Include(l => l.Deals).AsNoTracking().FirstOrDefaultAsync(l => l.Id == id);
            return lead is null
                ? Result<LeadResponse>.Fail($"Lead with id '{id}' was not found.")
                : Result<LeadResponse>.Ok(LeadMapper.ToResponse(lead));
        }
        catch (Exception ex)
        {
            return Result<LeadResponse>.Fail($"Failed to retrieve lead: {ex.Message}");
        }
    }

    public async Task<Result<LeadResponse>> CreateAsync(LeadRequest request)
    {
        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
            return Result<LeadResponse>.Fail(validation.Errors.Select(e => e.ErrorMessage).ToList());

        try
        {
            var entity = LeadMapper.ToEntity(request);
            db.Leads.Add(entity);
            await db.SaveChangesAsync();

            return Result<LeadResponse>.Ok(LeadMapper.ToResponse(entity));
        }
        catch (Exception ex)
        {
            return Result<LeadResponse>.Fail($"Failed to create lead: {ex.Message}");
        }
    }

    public async Task<Result<LeadResponse>> UpdateAsync(Guid id, LeadRequest request)
    {
        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
            return Result<LeadResponse>.Fail(validation.Errors.Select(e => e.ErrorMessage).ToList());

        try
        {
            var entity = await db.Leads.Include(l => l.Deals).FirstOrDefaultAsync(l => l.Id == id);
            if (entity is null)
                return Result<LeadResponse>.Fail($"Lead with id '{id}' was not found.");

            LeadMapper.UpdateEntity(entity, request);
            await db.SaveChangesAsync();

            return Result<LeadResponse>.Ok(LeadMapper.ToResponse(entity));
        }
        catch (Exception ex)
        {
            return Result<LeadResponse>.Fail($"Failed to update lead: {ex.Message}");
        }
    }

    public async Task<Result<bool>> DeleteAsync(Guid id)
    {
        try
        {
            var entity = await db.Leads.FirstOrDefaultAsync(l => l.Id == id);
            if (entity is null)
                return Result<bool>.Fail($"Lead with id '{id}' was not found.");

            db.Leads.Remove(entity);
            await db.SaveChangesAsync();

            return Result<bool>.Ok(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Fail($"Failed to delete lead: {ex.Message}");
        }
    }
}