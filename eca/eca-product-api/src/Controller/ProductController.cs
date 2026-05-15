using EcaProductApi.Controller.Dto;
using EcaProductApi.Model;
using EcaProductApi.Service;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace EcaProductApi.Controller
{
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService; ;
        }

		[Authorize(Roles = "products:view:any")]
		[HttpGet("/api/v1/products")]
		public async Task<ActionResult<IEnumerable<ProductDto>>> List()
		{
			var products = await _productService.GetAllProductsAsync();
			if (products == null) return NotFound();
			return ProductDto.FromModel(products);
		}

		[Authorize(Roles = "products:view:any")]
		[HttpGet("/api/v1/products/{id}")]
		public async Task<ActionResult<ProductDetailsDto>> Get(int id)
		{
			var (product, categories) = await _productService.GetProductByIdAsync(id);
			if (product == null) return BadRequest();
			return ProductDetailsDto.FromModel(product, categories);
		}

		[Authorize(Roles = "products:create:any")]
		[HttpPost("/api/v1/products")]
		public async Task<ActionResult<ProductDto>> Create(CreateProductRequest request)
		{
			var product = await _productService.AddProductAsync(request.ToModel(), request.CategoryIds);
			if (product == null) return BadRequest();
			return ProductDto.FromModel(product);
		}

		[Authorize(Roles = "products:delete:any")]
		[HttpDelete("/api/v1/products/{id}")]
		public async Task<ActionResult> Delete(int id)
		{
			var ok = await _productService.DeleteProductAsync(id);
			if (!ok) return NotFound();
			return NoContent();
		}

		[Authorize(Roles = "products:update:any")]
		[HttpPut("/api/v1/products/{id}")]
		public async Task<ActionResult<ProductDto>> Update(int id, UpdateProductRequest request)
		{
			var product = await _productService.UpdateProductAsync(request.ToModel(id), request.CategoryIds);
			if (product == null) return BadRequest();
			return ProductDto.FromModel(product);
		}

		[HttpGet("/api/v1/products/by")]
		public async Task<ActionResult<IEnumerable<ProductDto>>> GetBySkus([FromQuery] List<string> sku)
		{
			var products = await _productService.GetProductBySkuAsync(sku);
			Console.WriteLine($"Retrieved {products.Count()}, for SKUs: {sku.Count()}");
			if (products == null) return NotFound();
			return ProductDto.FromModel(products);
		}		
    }

}