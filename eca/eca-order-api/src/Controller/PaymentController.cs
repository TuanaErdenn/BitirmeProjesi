using EcaOrderApi.Controller.Dto;
using EcaOrderApi.Service;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcaOrderApi.Controller
{
    [ApiController]
    public class PaymentController : ControllerBase
	{
		private readonly IOrderService _orderService;

        public PaymentController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("/api/v1/payments/{orderId}")]
        public async Task<ActionResult> Pay(int orderId)
        {
            await _orderService.ConfirmOrderAsync(orderId);
			return NoContent();
        }
	}
}