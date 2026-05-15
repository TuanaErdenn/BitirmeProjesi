using EcaProductApi.Model;

namespace EcaProductApi.Controller.Dto
{
    public class ProductDto
    {
        public int Id { get; set; }
        public required string Sku { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string ImageUrl { get; set; }
        public decimal PriceCents { get; set; }
        public required string Currency { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public static ProductDto FromModel(Product model)
        {
            return new ProductDto
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
                UpdatedAt = model.UpdatedAt
            };
        }    

        public static List<ProductDto> FromModel(IEnumerable<Product> models)
        {
            return models.Select(FromModel).ToList();
        }   
    }
}
