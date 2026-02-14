using CrmDotnetApi.Common;
using CrmDotnetApi.Data;
using CrmDotnetApi.DTOs.Deals;
using CrmDotnetApi.Mappers;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace CrmDotnetApi.Services;

public class DealService(CrmDbContext db, IValidator<DealRequest> validator) : IDealService
{
    public async Task<Result<List<DealResponse>>> GetAllAsync()
    {
        try
        {
            var deals = await db.Deals.AsNoTracking().ToListAsync();
            return Result<List<DealResponse>>.Ok(deals.Select(DealMapper.ToResponse).ToList());
        }
        catch (Exception ex)
        {
            return Result<List<DealResponse>>.Fail($"Failed to retrieve deals: {ex.Message}");
        }
    }

    public async Task<Result<DealResponse>> GetByIdAsync(Guid id)
    {
        try
        {
            var deal = await db.Deals.AsNoTracking().FirstOrDefaultAsync(d => d.Id == id);
            if (deal is null)
                return Result<DealResponse>.Fail($"Deal with id '{id}' was not found.");

            return Result<DealResponse>.Ok(DealMapper.ToResponse(deal));
        }
        catch (Exception ex)
        {
            return Result<DealResponse>.Fail($"Failed to retrieve deal: {ex.Message}");
        }
    }

    public async Task<Result<DealResponse>> CreateAsync(DealRequest request)
    {
        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
            return Result<DealResponse>.Fail(validation.Errors.Select(e => e.ErrorMessage).ToList());

        try
        {
            var leadExists = await db.Leads.AnyAsync(l => l.Id == request.LeadId);
            if (!leadExists)
                return Result<DealResponse>.Fail($"Lead with id '{request.LeadId}' was not found.");

            var entity = DealMapper.ToEntity(request);
            db.Deals.Add(entity);
            await db.SaveChangesAsync();

            return Result<DealResponse>.Ok(DealMapper.ToResponse(entity));
        }
        catch (Exception ex)
        {
            return Result<DealResponse>.Fail($"Failed to create deal: {ex.Message}");
        }
    }

    public async Task<Result<DealResponse>> UpdateAsync(Guid id, DealRequest request)
    {
        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
            return Result<DealResponse>.Fail(validation.Errors.Select(e => e.ErrorMessage).ToList());

        try
        {
            var entity = await db.Deals.FirstOrDefaultAsync(d => d.Id == id);
            if (entity is null)
                return Result<DealResponse>.Fail($"Deal with id '{id}' was not found.");

            var leadExists = await db.Leads.AnyAsync(l => l.Id == request.LeadId);
            if (!leadExists)
                return Result<DealResponse>.Fail($"Lead with id '{request.LeadId}' was not found.");

            DealMapper.UpdateEntity(entity, request);
            await db.SaveChangesAsync();

            return Result<DealResponse>.Ok(DealMapper.ToResponse(entity));
        }
        catch (Exception ex)
        {
            return Result<DealResponse>.Fail($"Failed to update deal: {ex.Message}");
        }
    }

    public async Task<Result<bool>> DeleteAsync(Guid id)
    {
        try
        {
            var entity = await db.Deals.FirstOrDefaultAsync(d => d.Id == id);
            if (entity is null)
                return Result<bool>.Fail($"Deal with id '{id}' was not found.");

            db.Deals.Remove(entity);
            await db.SaveChangesAsync();

            return Result<bool>.Ok(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Fail($"Failed to delete deal: {ex.Message}");
        }
    }
}