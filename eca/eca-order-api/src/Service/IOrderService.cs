using EcaOrderApi.Controller.Dto;
using EcaOrderApi.Model;

namespace EcaOrderApi.Service
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order> GetOrderByIdAsync(int id);
        Task<Order> AddOrderAsync(Order order);
		Task<bool> DeleteOrderAsync(int id);
		Task ConfirmOrderAsync(int orderId);
		Task RejectOrderAsync(int orderId, string reason);
		Task SetAwaitingPaymentAsync(int orderId);
    }
}