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
builder.Services.AddScoped<IDashboardService, DashboardService>();

var app = builder.Build();

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