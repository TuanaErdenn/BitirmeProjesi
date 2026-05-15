using EcaOrderApi.Data;
using EcaOrderApi.Repository.Entity;
using Microsoft.EntityFrameworkCore;

namespace EcaOrderApi.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrderEntity> AddOrderAsync(OrderEntity order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return await _context.Orders.Include(o => o.Items).FirstAsync(o => o.Id == order.Id);
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<OrderEntity>> GetAllOrdersAsync()
        {
            return await _context.Orders.Include(o => o.Items).ToListAsync();
        }

        public async Task<OrderEntity> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
            return order!;
        }

        public async Task<OrderEntity?> UpdateOrderAsync(OrderEntity order)
        {
            var existing = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == order.Id);
            if (existing == null) return null;
            _context.Entry(existing).CurrentValues.SetValues(order);
            await _context.SaveChangesAsync();
            return existing;
        }
    }
}