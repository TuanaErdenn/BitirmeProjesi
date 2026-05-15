using EcaProductApi.Data;
using EcaProductApi.Repository.Entity;
using Microsoft.EntityFrameworkCore;

namespace EcaProductApi.Repository
{
	public class ProductRepository : IProductRepository
	{
		private readonly ApplicationDbContext _context;

		public ProductRepository(ApplicationDbContext context)
		{
			_context = context;
		}

		public async Task<IEnumerable<ProductEntity>> GetAllProductsAsync()
		{
			return await _context.Products.ToListAsync();
		}

		public async Task<ProductEntity> GetProductByIdAsync(int id)
		{
			var productEntity = await _context.Products
				.Include(p => p.Categories)          // eager load categories
				.FirstOrDefaultAsync(p => p.Id == id);
			return productEntity!;
		}

		public async Task<ProductEntity> AddProductAsync(ProductEntity product, List<int> categoryIds)
		{
			_context.Products.Add(product);
			await _context.SaveChangesAsync();
			if (categoryIds != null && categoryIds.Any())
			{
				var distinctCategoryIds = categoryIds.Distinct().ToList();
				var existingCategories = await _context.Categories
					.Where(c => distinctCategoryIds.Contains(c.Id))
					.ToListAsync();
				foreach (var category in existingCategories)
				{
					product.Categories.Add(category);
				}
				await _context.SaveChangesAsync();
			}
			return product;
		}

public async Task<ProductEntity> UpdateProductAsync(ProductEntity incomingProduct, List<int> categoryIds)
{
    // 1. Veritabanından ürünü ve mevcut kategorilerini yükle
    var product = await _context.Products
        .Include(p => p.Categories)
        .FirstOrDefaultAsync(p => p.Id == incomingProduct.Id);

    if (product == null)
        throw new KeyNotFoundException($"Product with Id {incomingProduct.Id} not found.");

    // 2. Sku (unique) kontrolü — eğer Sku güncellenmişse ve başka bir ürün zaten kullanıyorsa hata ver
    if (product.Sku != incomingProduct.Sku)
    {
        bool skuExists = await _context.Products
            .AnyAsync(p => p.Sku == incomingProduct.Sku && p.Id != incomingProduct.Id);
        if (skuExists)
            throw new InvalidOperationException($"Sku '{incomingProduct.Sku}' is already in use.");
    }

    // 3. scalar alanların güncellenmesi
    product.Sku = incomingProduct.Sku;
    product.Name = incomingProduct.Name;
    product.Description = incomingProduct.Description;
    product.ImageUrl = incomingProduct.ImageUrl;
    product.PriceCents = incomingProduct.PriceCents;
    product.Currency = incomingProduct.Currency;
    product.IsActive = incomingProduct.IsActive;
    product.UpdatedAt = DateTime.UtcNow;  // UpdatedAt’ı manuel güncellemek iyi olabilir

    // 4. Kategori ilişkisinin güncellenmesi
    // Clear yerine önceki ilişki listesini alıp, hangileri çıkarılmalı, hangileri eklenmeli
    var distinctCategoryIds = (categoryIds ?? new List<int>()).Distinct().ToList();
    // Fetch new categories
    var newCategories = await _context.Categories
        .Where(c => distinctCategoryIds.Contains(c.Id))
        .ToListAsync();

    // Replace navigation collection
    product.Categories.Clear();
    foreach (var cat in newCategories)
    {
        product.Categories.Add(cat);
    }

    // 5. Değişiklikleri kaydet
    await _context.SaveChangesAsync();

    return product;
}

		public async Task<bool> DeleteProductAsync(int id)
		{
			var product = await _context.Products.FindAsync(id);
			if (product != null)
			{
				_context.Products.Remove(product);
				await _context.SaveChangesAsync();
				return true;
			}
			else
			{
				return false;
			}
		}

        public async Task<IEnumerable<ProductEntity>> GetProductsBySkus(List<string> skus)
        {
            var productEntities = await _context.Products
				.Where(p => skus.Contains(p.Sku))
				.ToListAsync();
			return productEntities!;
        }
    }
}