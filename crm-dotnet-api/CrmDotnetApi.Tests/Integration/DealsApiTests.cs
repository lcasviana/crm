using System.Net;
using System.Net.Http.Json;
using CrmDotnetApi.Common;
using CrmDotnetApi.DTOs.Deals;
using CrmDotnetApi.DTOs.Leads;
using CrmDotnetApi.Models;

namespace CrmDotnetApi.Tests.Integration;

public class DealsApiTests(CrmApiFactory factory) : IClassFixture<CrmApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    private async Task<Guid> CreateLeadAsync()
    {
        var response = await _client.PostAsJsonAsync("/api/leads",
            new LeadRequest("Deal", "Test", $"deal-{Guid.NewGuid()}@example.com", null, null));
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<LeadResponse>>();
        return body!.Data!.Id;
    }

    [Fact]
    public async Task GetAll_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/deals");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<PagedResult<DealResponse>>>();
        Assert.True(body!.Success);
    }

    [Fact]
    public async Task Create_ReturnsCreated_WhenValid()
    {
        var leadId = await CreateLeadAsync();
        var request = new DealRequest("New Deal", 50000m, DateTime.UtcNow.AddDays(30), DealStage.Prospecting, leadId);

        var response = await _client.PostAsJsonAsync("/api/deals", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<DealResponse>>();
        Assert.True(body!.Success);
        Assert.Equal("New Deal", body.Data!.Title);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenLeadMissing()
    {
        var request = new DealRequest("Deal", 1000m, null, DealStage.Prospecting, Guid.NewGuid());

        var response = await _client.PostAsJsonAsync("/api/deals", request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        var response = await _client.GetAsync($"/api/deals/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenExists()
    {
        var leadId = await CreateLeadAsync();
        var createResponse = await _client.PostAsJsonAsync("/api/deals",
            new DealRequest("Deal", 5000m, null, DealStage.Prospecting, leadId));
        var created = await createResponse.Content.ReadFromJsonAsync<ApiResponse<DealResponse>>();

        var updateRequest =
            new DealRequest("Updated", 15000m, DateTime.UtcNow.AddDays(60), DealStage.Negotiation, leadId);
        var response = await _client.PutAsJsonAsync($"/api/deals/{created!.Data!.Id}", updateRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<DealResponse>>();
        Assert.Equal("Updated", body!.Data!.Title);
    }

    [Fact]
    public async Task Delete_ReturnsOk_WhenExists()
    {
        var leadId = await CreateLeadAsync();
        var createResponse = await _client.PostAsJsonAsync("/api/deals",
            new DealRequest("ToDelete", 1000m, null, DealStage.Prospecting, leadId));
        var created = await createResponse.Content.ReadFromJsonAsync<ApiResponse<DealResponse>>();

        var response = await _client.DeleteAsync($"/api/deals/{created!.Data!.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenMissing()
    {
        var response = await _client.DeleteAsync($"/api/deals/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}