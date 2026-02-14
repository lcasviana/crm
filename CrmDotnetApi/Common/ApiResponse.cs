namespace CrmDotnetApi.Common;

public record ApiResponse<T>(bool Success, T? Data, List<string> Errors)
{
    public static ApiResponse<T> FromResult(Result<T> result)
    {
        return new ApiResponse<T>(result.Success, result.Data, result.Errors);
    }
}