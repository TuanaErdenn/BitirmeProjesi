using EcaProductApi.Repository.Entity;

namespace EcaProductApi.Repository
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductEntity>> GetAllProductsAsync();
        Task<ProductEntity> GetProductByIdAsync(int id);
        Task<ProductEntity> AddProductAsync(ProductEntity product, List<int> categoryIds);
        Task<ProductEntity> UpdateProductAsync(ProductEntity product, List<int> categoryIds);
        Task<bool> DeleteProductAsync(int id);
        Task<IEnumerable<ProductEntity>> GetProductsBySkus(List<string> skus);
    }
}
