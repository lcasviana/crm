using CrmDotnetApi.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Nelknet.LibSQL.Data;

namespace CrmDotnetApi.Tests.Integration;

public class CrmApiFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection;

    public CrmApiFactory()
    {
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove all EF Core and LibSQL registrations from the production setup
            var descriptorsToRemove = services.Where(d =>
                    d.ServiceType == typeof(LibSQLConnection) ||
                    d.ServiceType == typeof(DbContextOptions<CrmDbContext>) ||
                    (d.ServiceType.IsGenericType &&
                     d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>)) ||
                    d.ServiceType.FullName?.Contains("IDbContextOptionsConfiguration") == true)
                .ToList();

            foreach (var descriptor in descriptorsToRemove)
                services.Remove(descriptor);

            services.AddDbContext<CrmDbContext>(options =>
                options.UseSqlite(_connection));
        });

        builder.UseEnvironment("Development");
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
            _connection.Dispose();
    }
}