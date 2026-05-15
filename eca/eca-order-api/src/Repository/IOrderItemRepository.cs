using EcaOrderApi.Repository.Entity;

namespace EcaOrderApi.Repository
{
    public interface IOrderItemRepository
    {
        Task<OrderItemEntity> AddOrderItemAsync(OrderItemEntity orderItem);
        Task<bool> DeleteOrderItemAsync(int id);
        Task<IEnumerable<OrderItemEntity>> GetAllOrderItemsAsync();
        Task<OrderItemEntity> GetOrderItemByIdAsync(int id);
        Task<OrderItemEntity?> UpdateOrderItemAsync(OrderItemEntity orderItem);
    }
}