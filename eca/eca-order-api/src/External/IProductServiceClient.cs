using EcaOrderApi.Model;

namespace EcaOrderApi.External
{
    public interface IProductServiceClient
    {
        Task<IEnumerable<Product>> GetProductsInAsync(List<string?> skus);
    }
}