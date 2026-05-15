using EcaOrderApi.Model;

namespace EcaOrderApi.Controller.Dto
{
    public class OrderDto
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public required OrderStatus Status { get; set; }
        public required decimal TotalCents { get; set; }
        public required string Currency { get; set; }
        public required string PaymentStatus { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderItem> Items { get; set; } = [];

        public static OrderDto FromModel(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                Status = order.Status,
                TotalCents = order.TotalCents,
                Currency = order.Currency,
                PaymentStatus = order.PaymentStatus,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                Items = order.Items
            };
        }

        public static List<OrderDto> FromModel(IEnumerable<Order> models)
        {
            return models.Select(FromModel).ToList();
        }
    }
}