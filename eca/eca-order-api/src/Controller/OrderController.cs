using EcaOrderApi.Controller.Dto;
using EcaOrderApi.Service;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcaOrderApi.Controller
{
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [Authorize(Roles = "orders:view:any")]
        [HttpGet("api/v1/orders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> List()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            if (orders == null) return NotFound();
            return OrderDto.FromModel(orders);
        }

        [Authorize(Roles = "orders:view:any")]
        [HttpGet("/api/v1/orders/{id}")]
        public async Task<ActionResult<OrderDto>> Get(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return BadRequest();
            return OrderDto.FromModel(order);
        }

        [Authorize(Roles = "orders:create:any")]
        [HttpPost("/api/v1/orders")]
        public async Task<ActionResult<OrderDto>> Create(CreateOrderRequest request)
        {
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			var order = await _orderService.AddOrderAsync(request.ToModel());
			return OrderDto.FromModel(order);
        }

        [Authorize(Roles = "orders:delete:any")]
        [HttpDelete("/api/v1/orders/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var ok = await _orderService.DeleteOrderAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
    }
}