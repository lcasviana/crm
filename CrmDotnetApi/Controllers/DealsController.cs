using CrmDotnetApi.DTOs.Deals;
using CrmDotnetApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrmDotnetApi.Controllers;

public class DealsController(IDealService dealService) : ApiControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await dealService.GetAllAsync();
        return ToActionResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await dealService.GetByIdAsync(id);
        return ToActionResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DealRequest request)
    {
        var result = await dealService.CreateAsync(request);
        return ToActionResult(result, successStatusCode: 201);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] DealRequest request)
    {
        var result = await dealService.UpdateAsync(id, request);
        return ToActionResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await dealService.DeleteAsync(id);
        return ToActionResult(result);
    }
}
