
using EcaProductApi.Data;
using Microsoft.EntityFrameworkCore;

namespace EcaProductApi.Repository.Entity
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<CategoryEntity> AddCategoryAsync(CategoryEntity category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<IEnumerable<CategoryEntity>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<CategoryEntity> GetCategoryByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            return category!;
        }

		public async Task<IEnumerable<CategoryEntity>> GetExistingCategoriesAsync(IEnumerable<int> categoryIds)
		{
			return await _context.Categories
				.Where(c => categoryIds.Contains(c.Id))
				.ToListAsync();
		}

		public async Task<CategoryEntity> UpdateCategoryAsync(CategoryEntity category)
        {
            var existing = await _context.Categories.FindAsync(category.Id);
            if (existing == null) return null;
            _context.Entry(existing).CurrentValues.SetValues(category);
            await _context.SaveChangesAsync();
            return existing;
        }
    }
}