using CrmDotnetApi.Data;
using CrmDotnetApi.Middleware;
using CrmDotnetApi.Services;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Nelknet.LibSQL.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var authToken = builder.Configuration["ConnectionStrings:AuthToken"];
var libSqlConnectionString = string.IsNullOrEmpty(authToken)
    ? $"Data Source={connectionString}"
    : $"Data Source={connectionString};Auth Token={authToken}";

builder.Services.AddScoped(_ =>
{
    var connection = new LibSQLConnection(libSqlConnectionString);
    connection.Open();
    return connection;
});

builder.Services.AddDbContext<CrmDbContext>((sp, options) =>
{
    var connection = sp.GetRequiredService<LibSQLConnection>();
    options.UseSqlite(connection);
});

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddScoped<ILeadService, LeadService>();
builder.Services.AddScoped<IDealService, DealService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var connection = scope.ServiceProvider.GetRequiredService<LibSQLConnection>();
    using var cmd = connection.CreateCommand();
    cmd.CommandText = """
        CREATE TABLE IF NOT EXISTS Leads (
            Id TEXT NOT NULL PRIMARY KEY,
            FirstName TEXT NOT NULL,
            LastName TEXT NOT NULL,
            Email TEXT NOT NULL,
            Phone TEXT NULL,
            Source TEXT NULL,
            Status TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS Deals (
            Id TEXT NOT NULL PRIMARY KEY,
            Title TEXT NOT NULL,
            Value TEXT NOT NULL,
            CloseDate TEXT NULL,
            Stage TEXT NOT NULL,
            LeadId TEXT NOT NULL,
            FOREIGN KEY (LeadId) REFERENCES Leads(Id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS IX_Deals_LeadId ON Deals(LeadId);
        """;
    cmd.ExecuteNonQuery();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();

public partial class Program;
