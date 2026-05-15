using Microsoft.EntityFrameworkCore;
using EcaProductApi.Repository.Entity;
using System.Text.RegularExpressions;

namespace EcaProductApi.Data
{
	public class ApplicationDbContext : DbContext
	{
		public DbSet<ProductEntity> Products { get; set; }
		public DbSet<CategoryEntity> Categories { get; set; }


		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<ProductEntity>()
				.Property(p => p.CreatedAt)
				.ValueGeneratedOnAdd();
			modelBuilder.Entity<ProductEntity>()
				.Property(p => p.UpdatedAt)
				.ValueGeneratedOnAddOrUpdate();

			// modelBuilder.Entity<ProductEntity>()
			// 	.HasMany(p => p.Categories)
			// 	.WithMany(c => c.Products)
			// 	.UsingEntity(j => j.ToTable("product_categories"));

			modelBuilder.Entity<ProductEntity>()
				.HasMany(p => p.Categories)
				.WithMany(c => c.Products)
				.UsingEntity<Dictionary<string, object>>(
					"product_categories",
					j => j.HasOne<CategoryEntity>().WithMany().HasForeignKey("category_id"),
					j => j.HasOne<ProductEntity>().WithMany().HasForeignKey("product_id"),
					j =>
					{
						j.HasKey("product_id", "category_id");
					});
				
			foreach (var entity in modelBuilder.Model.GetEntityTypes())
			{
				// Convert table names to snake_case
				var name = entity.GetTableName();
				if (name != null)
				{
					entity.SetTableName(ToSnakeCase(name));
				}

				// Convert column names to snake_case
				foreach (var property in entity.GetProperties())
				{
					property.SetColumnName(ToSnakeCase(property.Name));
				}

				// Convert key names
				foreach (var key in entity.GetKeys())
				{
					var keyName = key.GetName();
					if (keyName != null) key.SetName(ToSnakeCase(keyName));
				}

				// Convert foreign keys
				foreach (var fk in entity.GetForeignKeys())
				{
					var getConstraintName = fk.GetConstraintName();
					if (getConstraintName != null) fk.SetConstraintName(ToSnakeCase(getConstraintName));
				}

				// Convert indexes
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