using EcaProductApi.Repository.Entity;

namespace EcaProductApi.Repository
{
    public interface ICategoryRepository
    {
        Task<CategoryEntity> GetCategoryByIdAsync(int id);
        Task<IEnumerable<CategoryEntity>> GetAllCategoriesAsync();
        Task<CategoryEntity> AddCategoryAsync(CategoryEntity category);
        Task<CategoryEntity> UpdateCategoryAsync(CategoryEntity category);
		Task<bool> DeleteCategoryAsync(int id);
		Task<IEnumerable<CategoryEntity>> GetExistingCategoriesAsync(IEnumerable<int> categoryIds);
    }
}
