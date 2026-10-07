using Microsoft.EntityFrameworkCore;

namespace Phonebook.Api.Data;

public class PhonebookDbContext(DbContextOptions<PhonebookDbContext> options) : DbContext(options)
{
    public DbSet<PhoneEntry> PhoneEntries => Set<PhoneEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PhoneEntry>(entity =>
        {
            entity.ToTable("phone_entries");

            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Number).HasMaxLength(32);
            entity.Property(e => e.OwnerId).HasMaxLength(64);
            entity.Property(e => e.OwnerName).HasMaxLength(255);

            // Store the enum as readable text ("Personal" / "Shared") instead of 0 / 1.
            entity.Property(e => e.Visibility).HasConversion<string>().HasMaxLength(16);

            // The list query filters by these two columns.
            entity.HasIndex(e => e.Visibility);
            entity.HasIndex(e => e.OwnerId);
        });
    }
}
