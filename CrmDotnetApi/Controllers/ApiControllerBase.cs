using CrmDotnetApi.Common;
using Microsoft.AspNetCore.Mvc;

namespace CrmDotnetApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    protected IActionResult ToActionResult<T>(Result<T> result, int successStatusCode = 200)
    {
        var response = ApiResponse<T>.FromResult(result);

        if (!result.Success)
        {
            var isNotFound = result.Errors.Any(e => e.Contains("was not found"));
            return isNotFound
                ? NotFound(response)
                : BadRequest(response);
        }

        return successStatusCode == 201
            ? StatusCode(201, response)
            : Ok(response);
    }
}