using CrmDotnetApi.Common;
using CrmDotnetApi.Data;
using CrmDotnetApi.DTOs.Deals;
using CrmDotnetApi.DTOs.Leads;
using CrmDotnetApi.Models;
using CrmDotnetApi.Services;
using CrmDotnetApi.Validators;
using Microsoft.EntityFrameworkCore;

namespace CrmDotnetApi.Tests.Unit;

public class DealServiceTests : IDisposable
{
    private readonly CrmDbContext _db;
    private readonly LeadService _leadService;
    private readonly DealService _sut;

    public DealServiceTests()
    {
        var options = new DbContextOptionsBuilder<CrmDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new CrmDbContext(options);
        _sut = new DealService(_db, new DealRequestValidator());
        _leadService = new LeadService(_db, new LeadRequestValidator());
    }

    public void Dispose()
    {
        _db.Dispose();
    }

    private async Task<Guid> CreateTestLeadAsync()
    {
        var result = await _leadService.CreateAsync(new LeadRequest("John", "Doe", "john@example.com", null, null));
        return result.Data!.Id;
    }

    [Fact]
    public async Task GetAllAsync_ReturnsEmptyList_WhenNoDeals()
    {
        var result = await _sut.GetAllAsync(new PaginationQuery());

        Assert.True(result.Success);
        Assert.Empty(result.Data!.Items);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsFail_WhenDealNotFound()
    {
        var result = await _sut.GetByIdAsync(Guid.NewGuid());

        Assert.False(result.Success);
        Assert.Contains("was not found", result.Errors[0]);
    }

    [Fact]
    public async Task CreateAsync_ReturnsSuccess_WhenValidRequest()
    {
        var leadId = await CreateTestLeadAsync();
        var request = new DealRequest("Big Deal", 10000m, DateTime.UtcNow.AddDays(30), DealStage.Prospecting, leadId);

        var result = await _sut.CreateAsync(request);

        Assert.True(result.Success);
        Assert.Equal("Big Deal", result.Data!.Title);
        Assert.Equal(10000m, result.Data.Value);
    }

    [Fact]
    public async Task CreateAsync_ReturnsFail_WhenLeadDoesNotExist()
    {
        var request = new DealRequest("Big Deal", 10000m, null, DealStage.Prospecting, Guid.NewGuid());

        var result = await _sut.CreateAsync(request);

        Assert.False(result.Success);
        Assert.Contains("was not found", result.Errors[0]);
    }

    [Fact]
    public async Task CreateAsync_ReturnsFail_WhenTitleIsEmpty()
    {
        var leadId = await CreateTestLeadAsync();
        var request = new DealRequest("", 10000m, null, DealStage.Prospecting, leadId);

        var result = await _sut.CreateAsync(request);

        Assert.False(result.Success);
    }

    [Fact]
    public async Task CreateAsync_ReturnsFail_WhenValueIsNegative()
    {
        var leadId = await CreateTestLeadAsync();
        var request = new DealRequest("Deal", -100m, null, DealStage.Prospecting, leadId);

        var result = await _sut.CreateAsync(request);

        Assert.False(result.Success);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsSuccess_WhenDealExists()
    {
        var leadId = await CreateTestLeadAsync();
        var created = await _sut.CreateAsync(new DealRequest("Deal", 5000m, null, DealStage.Prospecting, leadId));
        var updateRequest =
            new DealRequest("Updated Deal", 15000m, DateTime.UtcNow.AddDays(60), DealStage.Proposal, leadId);

        var result = await _sut.UpdateAsync(created.Data!.Id, updateRequest);

        Assert.True(result.Success);
        Assert.Equal("Updated Deal", result.Data!.Title);
        Assert.Equal(DealStage.Proposal, result.Data.Stage);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsFail_WhenDealNotFound()
    {
        var leadId = await CreateTestLeadAsync();
        var request = new DealRequest("Deal", 5000m, null, DealStage.Prospecting, leadId);

        var result = await _sut.UpdateAsync(Guid.NewGuid(), request);

        Assert.False(result.Success);
        Assert.Contains("was not found", result.Errors[0]);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsSuccess_WhenDealExists()
    {
        var leadId = await CreateTestLeadAsync();
        var created = await _sut.CreateAsync(new DealRequest("Deal", 5000m, null, DealStage.Prospecting, leadId));

        var result = await _sut.DeleteAsync(created.Data!.Id);

        Assert.True(result.Success);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFail_WhenDealNotFound()
    {
        var result = await _sut.DeleteAsync(Guid.NewGuid());

        Assert.False(result.Success);
    }
}