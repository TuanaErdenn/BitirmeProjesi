namespace EcaOrderApi.Model
{
    public class Order
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalCents { get; set; }
        public string? Currency { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderItem> Items { get; set; } = new();
    }
}