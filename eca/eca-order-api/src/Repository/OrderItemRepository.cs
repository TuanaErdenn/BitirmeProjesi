using EcaOrderApi.Data;
using EcaOrderApi.Repository.Entity;
using Microsoft.EntityFrameworkCore;

namespace EcaOrderApi.Repository
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderItemEntity> AddOrderItemAsync(OrderItemEntity orderItem)
        {
            await _context.OrderItems.AddAsync(orderItem);
            await _context.SaveChangesAsync();
            return orderItem;
        }

        public async Task<bool> DeleteOrderItemAsync(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null) return false;

            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<OrderItemEntity>> GetAllOrderItemsAsync()
        {
            return await _context.OrderItems.ToListAsync();
        }

        public async Task<OrderItemEntity> GetOrderItemByIdAsync(int id)
        {
            return await _context.OrderItems.FindAsync(id);
        }

        public async Task<OrderItemEntity?> UpdateOrderItemAsync(OrderItemEntity orderItem)
        {
            var existingOrderItem = await _context.OrderItems.FindAsync(orderItem.Id);
            if (existingOrderItem == null) return null;

            _context.Entry(existingOrderItem).CurrentValues.SetValues(orderItem);
            await _context.SaveChangesAsync();
            return existingOrderItem;
        }
    }
}
