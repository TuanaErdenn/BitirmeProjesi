using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EcaOrderApi.Model;

namespace EcaOrderApi.Repository.Entity
{
	[Table("orders")]
    public class OrderEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? UserId { get; set; }
        [Required]
        public OrderStatus Status { get; set; }
        [Required]
        public decimal TotalCents { get; set; }
        [Required]
        public string? Currency { get; set; }
        [Required]
        public string? PaymentStatus { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public DateTime UpdatedAt { get; set; }
        public List<OrderItemEntity> Items { get; set; } = new();


        public static OrderEntity FromModel(Order model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            return new OrderEntity
            {
                Id = model.Id,
                UserId = model.UserId,
                Status = model.Status,
                TotalCents = model.TotalCents,
                Currency = model.Currency,
                PaymentStatus = model.PaymentStatus,
                CreatedAt = model.CreatedAt,
                UpdatedAt = model.UpdatedAt,
                Items = model.Items.Select(OrderItemEntity.FromModel).ToList()
            };
        }

        public Order ToModel()
        {
            return new Order
            {
                Id = Id,
                UserId = UserId,
                Status = Status,
                TotalCents = TotalCents,
                Currency = Currency,
                PaymentStatus = PaymentStatus,
                CreatedAt = CreatedAt,
                UpdatedAt = UpdatedAt,
                Items = Items.Select(i => i.ToModel()).ToList()
            };
        }
    }
}