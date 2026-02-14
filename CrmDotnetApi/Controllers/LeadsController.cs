using CrmDotnetApi.DTOs.Leads;
using CrmDotnetApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrmDotnetApi.Controllers;

public class LeadsController(ILeadService leadService) : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await leadService.GetAllAsync();
        return ToActionResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await leadService.GetByIdAsync(id);
        return ToActionResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] LeadRequest request)
    {
        var result = await leadService.CreateAsync(request);
        return ToActionResult(result, successStatusCode: 201);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] LeadRequest request)
    {
        var result = await leadService.UpdateAsync(id, request);
        return ToActionResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await leadService.DeleteAsync(id);
        return ToActionResult(result);
    }
}
