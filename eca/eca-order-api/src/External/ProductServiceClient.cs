using System.Text.Json;
using EcaOrderApi.Model;

namespace EcaOrderApi.External
{
    public class ProductServiceClient : IProductServiceClient
    {
        private readonly HttpClient _httpClient;

        public ProductServiceClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<Product>> GetProductsInAsync(List<string?> skus)
		{
            if (skus == null || !skus.Any())
                return Enumerable.Empty<Product>();
            var query = string.Join("&", skus.Select(s => $"sku={Uri.EscapeDataString(s)}"));
			var response = await _httpClient.GetAsync($"/api/v1/products/by?{query}");
            response.EnsureSuccessStatusCode();
            var products = await response.Content.ReadFromJsonAsync<IEnumerable<Product>>();
            return products ?? Enumerable.Empty<Product>();
        }
    }
}