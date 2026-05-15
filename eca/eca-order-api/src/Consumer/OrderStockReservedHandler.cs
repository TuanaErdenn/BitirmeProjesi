using EcaOrderApi.Contract;
using EcaOrderApi.Service;

namespace EcaOrderApi.Consumer
{
	public class OrderStockReservedHandler : IMessageConsumer<OrderStockReservedEvent>
	{
		private readonly ILogger<OrderStockReservedHandler> _logger;
		private readonly IOrderService _orderService;

		public OrderStockReservedHandler(ILogger<OrderStockReservedHandler> logger, IOrderService orderService)
		{
			_logger = logger;
			_orderService = orderService;
		}

		public async Task HandleAsync(OrderStockReservedEvent message, CancellationToken cancellationToken = default)
		{
			_logger.LogInformation("Processing OrderStockReservedEvent for OrderId: {OrderId}", message.OrderId);

			// Update order status to AwaitingPayment after stock is reserved
			await _orderService.SetAwaitingPaymentAsync(message.OrderId);

			_logger.LogInformation("Successfully processed OrderStockReservedEvent for OrderId: {OrderId}", message.OrderId);
		}
	}
}