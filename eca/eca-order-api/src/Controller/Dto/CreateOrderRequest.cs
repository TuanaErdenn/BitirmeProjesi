using System.ComponentModel.DataAnnotations;
using EcaOrderApi.Model;

namespace EcaOrderApi.Controller.Dto
{
    public class CreateOrderRequest
	{
		[Required]
		public required string UserId { get; set; }
		[Required]
		[StringLength(3)]
		public required string Currency { get; set; }
		[Required]
		[MinLength(1)]
        public List<ProductQuantity> Products { get; set; } = new List<ProductQuantity>();

        public Order ToModel()
        {
            return new Order
            {
                UserId = this.UserId,
                Currency = this.Currency,
                Items = this.Products.Select(pq => new OrderItem
                {
                    ProductSku = pq.ProductSku,
                    Quantity = pq.Quantity
                }).ToList()
            };
        }
    }

    public class ProductQuantity
	{
		[Required]
		public string? ProductSku { get; set; }
		[Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}