namespace EcaOrderApi.Model
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public string? ProductSku { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPriceCents { get; set; }

        public int SubtotalCents { get; init; }
    }
}