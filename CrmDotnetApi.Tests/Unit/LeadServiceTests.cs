using CrmDotnetApi.Data;
using CrmDotnetApi.DTOs.Leads;
using CrmDotnetApi.Models;
using CrmDotnetApi.Services;
using CrmDotnetApi.Validators;
using Microsoft.EntityFrameworkCore;

namespace CrmDotnetApi.Tests.Unit;

public class LeadServiceTests : IDisposable
{
    private readonly CrmDbContext _db;
    private readonly LeadService _sut;

    public LeadServiceTests()
    {
        var options = new DbContextOptionsBuilder<CrmDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new CrmDbContext(options);
        _sut = new LeadService(_db, new LeadRequestValidator());
    }

    public void Dispose()
    {
        _db.Dispose();
    }

    [Fact]
    public async Task GetAllAsync_ReturnsEmptyList_WhenNoLeads()
    {
        var result = await _sut.GetAllAsync();

        Assert.True(result.Success);
        Assert.Empty(result.Data!);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsFail_WhenLeadNotFound()
    {
        var result = await _sut.GetByIdAsync(Guid.NewGuid());

        Assert.False(result.Success);
        Assert.Contains("was not found", result.Errors[0]);
    }

    [Fact]
    public async Task CreateAsync_ReturnsSuccess_WhenValidRequest()
    {
        var request = new LeadRequest("John", "Doe", "john@example.com", null, null);

        var result = await _sut.CreateAsync(request);

        Assert.True(result.Success);
        Assert.Equal("John", result.Data!.FirstName);
        Assert.Equal("Doe", result.Data.LastName);
        Assert.Equal(LeadStatus.New, result.Data.Status);
    }

    [Fact]
    public async Task CreateAsync_ReturnsFail_WhenInvalidEmail()
    {
        var request = new LeadRequest("John", "Doe", "not-an-email", null, null);

        var result = await _sut.CreateAsync(request);

        Assert.False(result.Success);
        Assert.NotEmpty(result.Errors);
    }

    [Fact]
    public async Task CreateAsync_ReturnsFail_WhenEmptyFirstName()
    {
        var request = new LeadRequest("", "Doe", "john@example.com", null, null);

        var result = await _sut.CreateAsync(request);

        Assert.False(result.Success);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsSuccess_WhenLeadExists()
    {
        var createRequest = new LeadRequest("John", "Doe", "john@example.com", null, null);
        var created = await _sut.CreateAsync(createRequest);
        var updateRequest = new LeadRequest("Jane", "Doe", "jane@example.com", "555-1234", "Web", LeadStatus.Contacted);

        var result = await _sut.UpdateAsync(created.Data!.Id, updateRequest);

        Assert.True(result.Success);
        Assert.Equal("Jane", result.Data!.FirstName);
        Assert.Equal(LeadStatus.Contacted, result.Data.Status);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsFail_WhenLeadNotFound()
    {
        var request = new LeadRequest("John", "Doe", "john@example.com", null, null);

        var result = await _sut.UpdateAsync(Guid.NewGuid(), request);

        Assert.False(result.Success);
        Assert.Contains("was not found", result.Errors[0]);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsSuccess_WhenLeadExists()
    {
        var created = await _sut.CreateAsync(new LeadRequest("John", "Doe", "john@example.com", null, null));

        var result = await _sut.DeleteAsync(created.Data!.Id);

        Assert.True(result.Success);
        Assert.True(result.Data);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFail_WhenLeadNotFound()
    {
        var result = await _sut.DeleteAsync(Guid.NewGuid());

        Assert.False(result.Success);
        Assert.Contains("was not found", result.Errors[0]);
    }
}