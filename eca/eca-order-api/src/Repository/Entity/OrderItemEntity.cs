using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EcaOrderApi.Model;

namespace EcaOrderApi.Repository.Entity
{
    [Table("order_items")]
    public class OrderItemEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public string? ProductSku { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal UnitPriceCents { get; set; }
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int SubtotalCents { get; private set; } 
        public OrderEntity? Order { get; set; }
        
        public static OrderItemEntity FromModel(OrderItem model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            return new OrderItemEntity
            {
                Id = model.Id,
                OrderId = model.OrderId,
                ProductSku = model.ProductSku,
                Quantity = model.Quantity,
                UnitPriceCents = model.UnitPriceCents,
                SubtotalCents = model.SubtotalCents
            };
        }
        public OrderItem ToModel()
        {
            return new OrderItem
            {
                Id = Id,
                OrderId = OrderId,
                ProductSku = ProductSku,
                Quantity = Quantity,
                UnitPriceCents = UnitPriceCents,
                SubtotalCents = SubtotalCents
            };
        }
    }
}