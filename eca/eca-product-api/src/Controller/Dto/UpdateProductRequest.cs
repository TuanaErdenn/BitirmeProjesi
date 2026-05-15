using EcaProductApi.Model;

namespace EcaProductApi.Controller.Dto
{
	public class UpdateProductRequest
	{
		public required string Name { get; set; }
		public required string Sku { get; set; }
		public required string Description { get; set; }
		public required string ImageUrl { get; set; }
		public decimal PriceCents { get; set; }
		public required string Currency { get; set; }
		public bool IsActive { get; set; }
		public List<int> CategoryIds { get; set; } = new List<int>();

		public Product ToModel(int id)
		{
			return new Product
			{
				Id = id,
				Name = this.Name,
				Sku = this.Sku,
				Description = this.Description,
				ImageUrl = this.ImageUrl,
				PriceCents = this.PriceCents,
				Currency = this.Currency,
				IsActive = this.IsActive
			};
		}
	}
}