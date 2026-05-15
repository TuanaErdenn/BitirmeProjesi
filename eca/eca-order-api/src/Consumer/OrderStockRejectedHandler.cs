using EcaOrderApi.Contract;
using EcaOrderApi.Service;

namespace EcaOrderApi.Consumer
{
	public class OrderStockRejectedHandler : IMessageConsumer<OrderStockRejectedEvent>
	{
		private readonly ILogger<OrderStockRejectedHandler> _logger;
		private readonly IOrderService _orderService;

		public OrderStockRejectedHandler(ILogger<OrderStockRejectedHandler> logger, IOrderService orderService)
		{
			_logger = logger;
			_orderService = orderService;
		}

		public async Task HandleAsync(OrderStockRejectedEvent message, CancellationToken cancellationToken = default)
		{
			_logger.LogInformation("Processing OrderStockRejectedEvent for OrderId: {OrderId}, Reason: {Reason}", 
				message.OrderId, message.Reason);

			await _orderService.RejectOrderAsync(message.OrderId, message.Reason);

			_logger.LogInformation("Successfully processed OrderStockRejectedEvent for OrderId: {OrderId}", message.OrderId);
		}
	}
}
