using EcaOrderApi.Repository.Entity;

namespace EcaOrderApi.Repository
{
    public interface IOrderRepository
    {
        Task<IEnumerable<OrderEntity>> GetAllOrdersAsync();
        Task<OrderEntity> GetOrderByIdAsync(int id);
        Task<OrderEntity> AddOrderAsync(OrderEntity order);
        Task<OrderEntity?> UpdateOrderAsync(OrderEntity order);
        Task<bool> DeleteOrderAsync(int id);
    }
}