using Microsoft.EntityFrameworkCore;
using EcaOrderApi.Repository.Entity;
using System.Text.RegularExpressions;

namespace EcaOrderApi.Data
{
	public class ApplicationDbContext : DbContext
	{
		public DbSet<OrderEntity> Orders { get; set; }
		public DbSet<OrderItemEntity> OrderItems { get; set; }

		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<OrderEntity>()
				.Property(o => o.CreatedAt)
				.ValueGeneratedOnAdd();
			modelBuilder.Entity<OrderEntity>()
				.Property(o => o.UpdatedAt)
				.ValueGeneratedOnAddOrUpdate();
			modelBuilder.Entity<OrderItemEntity>()
				.Property(x => x.SubtotalCents)
				.HasComputedColumnSql("quantity * unit_price_cents", stored: true);
			modelBuilder.Entity<OrderEntity>()
				.HasMany(o => o.Items)
				.WithOne(i => i.Order!)
				.HasForeignKey(i => i.OrderId)
				.OnDelete(DeleteBehavior.Cascade);
			modelBuilder.Entity<OrderEntity>()
				.HasMany(o => o.Items)
				.WithOne(i => i.Order!)
				.HasForeignKey(i => i.OrderId)
				.OnDelete(DeleteBehavior.Cascade);

			foreach (var entity in modelBuilder.Model.GetEntityTypes())
			{
				var name = entity.GetTableName();
				if (name != null)
				{
					entity.SetTableName(ToSnakeCase(name));
				}

				foreach (var property in entity.GetProperties())
				{
					property.SetColumnName(ToSnakeCase(property.Name));
				}

				foreach (var key in entity.GetKeys())
				{
					var keyName = key.GetName();
					if (keyName != null) key.SetName(ToSnakeCase(keyName));
				}

				foreach (var fk in entity.GetForeignKeys())
				{
					var getConstraintName = fk.GetConstraintName();
					if (getConstraintName != null) fk.SetConstraintName(ToSnakeCase(getConstraintName));
				}

				foreach (var index in entity.GetIndexes())
				{
					var getDatabaseName = index.GetDatabaseName();
					if (getDatabaseName != null) index.SetDatabaseName(ToSnakeCase(getDatabaseName));
				}
			}
		}

		private static string ToSnakeCase(string name)
		{
			if (string.IsNullOrEmpty(name))
				return name;

			var startUnderscores = Regex.Match(name, @"^_+");
			return startUnderscores + Regex.Replace(name, @"([a-z0-9])([A-Z])", "$1_$2").ToLower();
		}

	}
}