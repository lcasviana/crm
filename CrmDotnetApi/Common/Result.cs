namespace CrmDotnetApi.Common;

public class Result<T>
{
    private Result(bool success, T? data, List<string>? errors)
    {
        Success = success;
        Data = data;
        Errors = errors ?? [];
    }

    public bool Success { get; }
    public T? Data { get; }
    public List<string> Errors { get; }

    public static Result<T> Ok(T data)
    {
        return new Result<T>(true, data, null);
    }

    public static Result<T> Fail(string error)
    {
        return new Result<T>(false, default, [error]);
    }

    public static Result<T> Fail(List<string> errors)
    {
        return new Result<T>(false, default, errors);
    }
}