using CrmDotnetApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CrmDotnetApi.Data;

public class CrmDbContext(DbContextOptions<CrmDbContext> options) : DbContext(options)
{
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<Deal> Deals => Set<Deal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.Property(l => l.Email).IsRequired();
            entity.Property(l => l.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(l => l.LastName).IsRequired().HasMaxLength(100);
            entity.Property(l => l.Status).HasConversion<string>();
            entity.HasMany(l => l.Deals).WithOne(d => d.Lead).HasForeignKey(d => d.LeadId);
        });

        modelBuilder.Entity<Deal>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Title).IsRequired().HasMaxLength(200);
            entity.Property(d => d.Value).HasColumnType("decimal(18,2)");
            entity.Property(d => d.Stage).HasConversion<string>();
        });
    }
}
