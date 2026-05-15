using EcaProductApi.Model;
using EcaProductApi.Repository;
using EcaProductApi.Repository.Entity;

namespace EcaProductApi.Service
{
    public class ProductService : IProductService
    {
		private readonly IProductRepository _productRepository;
		private readonly ICategoryRepository _categoryRepository;

		public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository)
		{
			_productRepository = productRepository;
			_categoryRepository = categoryRepository;
		}

		public async Task<Product> AddProductAsync(Product product, List<int> categoryIds)
		{
			var entity = ProductEntity.FromModel(product);
			var productEntity = await _productRepository.AddProductAsync(entity, categoryIds);
            return productEntity.ToModel();
        }

        public async Task<bool> DeleteProductAsync(int id)
        { 
            try
            {
                return  await _productRepository.DeleteProductAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting product: {ex.Message}");
                return false;
            }
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllProductsAsync();
            return products.Select(pe => pe.ToModel());
        }

        public async Task<(Product, List<Category>)> GetProductByIdAsync(int id)
        {
			var productEntity = await _productRepository.GetProductByIdAsync(id);
			return productEntity.ToModelWithCategory();
        }

        public async Task<List<Product>> GetProductBySkuAsync(List<string> skus)
        {
            var products = await _productRepository.GetProductsBySkus(skus);
            return products.Select(pe => pe.ToModel()).ToList();
        }

        public async Task<Product> UpdateProductAsync(Product product, List<int> categoryIds)
		{
			var entity = ProductEntity.FromModel(product);
			var productEntity = await _productRepository.UpdateProductAsync(entity, categoryIds);
			return productEntity.ToModel();
        }   
    }
}