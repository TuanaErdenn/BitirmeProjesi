using EcaProductApi.Model;
using EcaProductApi.Repository;
using EcaProductApi.Repository.Entity;

namespace EcaProductApi.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Category> AddCategoryAsync(string name)
        {
            var slug = $"{name}1";

            var a = new CategoryEntity
            {
                Name = name,
                Slug = slug
            };
            var categoryEntity = await _categoryRepository.AddCategoryAsync(a);
            return categoryEntity.ToModel();
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            try
            {
                return  await _categoryRepository.DeleteCategoryAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting category: {ex.Message}");
                return false;
            }
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllCategoriesAsync();
            return categories.Select(ce => ce.ToModel());
        }

        public async Task<Category> GetCategoryByIdAsync(int id)
        {
            try
            {
                var categoryEntity = await _categoryRepository.GetCategoryByIdAsync(id);
                return categoryEntity.ToModel();
            }
            catch (System.Exception e)
            {
                return null;
            }
        }

        public async Task<Category> UpdateCategoryAsync(int id, string name)
		{
			var slug = $"{name}1";
            var a = new CategoryEntity
			{
				Name = name,
				Id = id,
				Slug = slug
			};
            var categoryEntity = await _categoryRepository.UpdateCategoryAsync(a);
            return categoryEntity.ToModel();
        }
    }
}