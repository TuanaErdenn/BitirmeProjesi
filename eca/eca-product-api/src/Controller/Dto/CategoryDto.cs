using EcaProductApi.Model;

namespace EcaProductApi.Controller.Dto
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Slug { get; set; }

        public static CategoryDto FromModel(Category model)
        {
            return new CategoryDto
            {
                Id = model.Id,
                Name = model.Name,
                Slug = model.Slug
            };
        }    

        public static List<CategoryDto> FromModel(IEnumerable<Category> models)
        {
            return models.Select(FromModel).ToList();
        }   
    }
}