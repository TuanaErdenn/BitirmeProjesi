
using EcaProductApi.Model;

namespace EcaProductApi.Service
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category> GetCategoryByIdAsync(int id);
        Task<Category> AddCategoryAsync(string name);
        Task<Category> UpdateCategoryAsync(int id, string name);
        Task<bool> DeleteCategoryAsync(int id);
    }
}