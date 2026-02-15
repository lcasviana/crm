using CrmDotnetApi.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace CrmDotnetApi.Tests;

public abstract class DatabaseFixture : IAsyncLifetime
{
    private SqliteConnection Connection { get; set; } = null!;

    public async Task InitializeAsync()
    {
        Connection = new SqliteConnection("Data Source=:memory:");
        await Connection.OpenAsync();

        var options = new DbContextOptionsBuilder<CrmDbContext>()
            .UseSqlite(Connection)
            .Options;

        await using var context = new CrmDbContext(options);
        await context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await Connection.DisposeAsync();
    }
}

[CollectionDefinition("Database")]
public class DatabaseCollection : ICollectionFixture<DatabaseFixture>;