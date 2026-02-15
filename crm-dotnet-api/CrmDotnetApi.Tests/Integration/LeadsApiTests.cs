using System.Net;
using System.Net.Http.Json;
using CrmDotnetApi.Common;
using CrmDotnetApi.DTOs.Leads;
using CrmDotnetApi.Models;

namespace CrmDotnetApi.Tests.Integration;

public class LeadsApiTests(CrmApiFactory factory) : IClassFixture<CrmApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    private static LeadRequest ValidLead(string email = "test@example.com")
    {
        return new LeadRequest("John", "Doe", email, "555-0100", "Web");
    }

    [Fact]
    public async Task GetAll_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/leads");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<PagedResult<LeadResponse>>>();
        Assert.NotNull(body);
        Assert.True(body.Success);
    }

    [Fact]
    public async Task Create_ReturnsCreated_WhenValid()
    {
        var response = await _client.PostAsJsonAsync("/api/leads", ValidLead("create@example.com"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<LeadResponse>>();
        Assert.NotNull(body);
        Assert.True(body.Success);
        Assert.Equal("John", body.Data!.FirstName);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenInvalidEmail()
    {
        var request = new LeadRequest("John", "Doe", "bad-email", null, null);

        var response = await _client.PostAsJsonAsync("/api/leads", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<LeadResponse>>();
        Assert.NotNull(body);
        Assert.False(body.Success);
        Assert.NotEmpty(body.Errors);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        var response = await _client.GetAsync($"/api/leads/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetById_ReturnsOk_WhenExists()
    {
        var createResponse = await _client.PostAsJsonAsync("/api/leads", ValidLead("getbyid@example.com"));
        var created = await createResponse.Content.ReadFromJsonAsync<ApiResponse<LeadResponse>>();

        var response = await _client.GetAsync($"/api/leads/{created!.Data!.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Update_ReturnsOk_WhenExists()
    {
        var createResponse = await _client.PostAsJsonAsync("/api/leads", ValidLead("update@example.com"));
        var created = await createResponse.Content.ReadFromJsonAsync<ApiResponse<LeadResponse>>();
        var updateRequest = new LeadRequest("Jane", "Smith", "jane@example.com", null, null, LeadStatus.Qualified);

        var response = await _client.PutAsJsonAsync($"/api/leads/{created!.Data!.Id}", updateRequest);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ApiResponse<LeadResponse>>();
        Assert.Equal("Jane", body!.Data!.FirstName);
    }

    [Fact]
    public async Task Delete_ReturnsOk_WhenExists()
    {
        var createResponse = await _client.PostAsJsonAsync("/api/leads", ValidLead("delete@example.com"));
        var created = await createResponse.Content.ReadFromJsonAsync<ApiResponse<LeadResponse>>();

        var response = await _client.DeleteAsync($"/api/leads/{created!.Data!.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenMissing()
    {
        var response = await _client.DeleteAsync($"/api/leads/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}