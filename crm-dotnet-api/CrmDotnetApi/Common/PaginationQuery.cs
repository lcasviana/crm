namespace CrmDotnetApi.Common;

public record PaginationQuery(int Page = 1, int PageSize = 10)
{
    public int Page { get; } = Page < 1 ? 1 : Page;
    public int PageSize { get; } = PageSize < 1 ? 10 : PageSize > 100 ? 100 : PageSize;
}