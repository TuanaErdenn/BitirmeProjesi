using EcaProductApi.Model;

namespace EcaProductApi.Service
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<(Product, List<Category>)> GetProductByIdAsync(int id);
        Task<Product> AddProductAsync(Product product, List<int> categoryIds);
        Task<Product> UpdateProductAsync(Product product, List<int> categoryIds);
        Task<bool> DeleteProductAsync(int id);
        Task<List<Product>> GetProductBySkuAsync(List<string> skus);
    }

}