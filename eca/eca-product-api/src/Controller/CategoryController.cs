using EcaProductApi.Controller.Dto;
using EcaProductApi.Model;
using EcaProductApi.Service;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcaProductApi.Controller
{
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

		public CategoryController(ICategoryService categoryService)
		{
			_categoryService = categoryService;
		}

		[Authorize(Roles = "category:view:any")]
		[HttpGet("/api/v1/categories")]
		public async Task<ActionResult<IEnumerable<CategoryDto>>> List()
		{
			var categories = await _categoryService.GetAllCategoriesAsync();
			if (categories == null) return NotFound();
			return CategoryDto.FromModel(categories);
		}

		[Authorize(Roles = "category:create:any")]
		[HttpPost("/api/v1/categories")]
		public async Task<ActionResult<CategoryDto>> Create(CreateCategoryRequest request)
		{
			var category = await _categoryService.AddCategoryAsync(request.Name);
			if (category == null) return BadRequest();
			return CategoryDto.FromModel(category);
		}

		[Authorize(Roles = "category:delete:any")]
		[HttpDelete("/api/v1/categories/{id}")]
		public async Task<ActionResult> Delete(int id)
		{
			var ok = await _categoryService.DeleteCategoryAsync(id);
			if (!ok) return NotFound();
			return NoContent();
		}

		[Authorize(Roles = "category:update:any")]
		[HttpPut("/api/v1/categories/{id}")]
		public async Task<ActionResult<CategoryDto>> Update(int id, UpdateCategoryRequest request)
		{
			var category = await _categoryService.UpdateCategoryAsync(id, request.Name);
			if (category == null) return BadRequest();
			return CategoryDto.FromModel(category);
		}
    }
}