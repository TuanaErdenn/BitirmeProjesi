using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EcaProductApi.Model;

namespace EcaProductApi.Repository.Entity
{
	[Table("products")]
    public class ProductEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Sku { get; set; }
        [Required]
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string ImageUrl { get; set; }
        [Required]
        public decimal PriceCents { get; set; }
        [Required]
        public required string Currency { get; set; }
        [Required]
        public bool IsActive { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
		public DateTime UpdatedAt { get; set; }
		public ICollection<CategoryEntity> Categories { get; set; } = [];

        public static ProductEntity FromModel(Product model)
        {
            return new ProductEntity
			{
				Id = model.Id,
				Sku = model.Sku,
				Name = model.Name,
				Description = model.Description,
				ImageUrl = model.ImageUrl,
				PriceCents = model.PriceCents,
				Currency = model.Currency,
				IsActive = model.IsActive,
				CreatedAt = model.CreatedAt,
				UpdatedAt = model.UpdatedAt,
			};
        }

		public Product ToModel()
		{
			return new Product
			{
				Id = Id,
				Sku = Sku,
				Name = Name,
				Description = Description,
				ImageUrl = ImageUrl,
				PriceCents = PriceCents,
				Currency = Currency,
				IsActive = IsActive,
				CreatedAt = CreatedAt,
				UpdatedAt = UpdatedAt
			};
		}
		
		public (Product, List<Category>) ToModelWithCategory()
        {
			var p = new Product
			{
				Id = Id,
				Sku = Sku,
				Name = Name,
				Description = Description,
				ImageUrl = ImageUrl,
				PriceCents = PriceCents,
				Currency = Currency,
				IsActive = IsActive,
				CreatedAt = CreatedAt,
				UpdatedAt = UpdatedAt
			};
			var list = Categories;
			return (p, list.Select(c => c.ToModel()).ToList());
        }
    }
}