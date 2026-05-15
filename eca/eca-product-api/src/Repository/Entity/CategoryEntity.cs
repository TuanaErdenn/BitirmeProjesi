using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EcaProductApi.Model;

namespace EcaProductApi.Repository.Entity
{
    [Table("categories")]
    public class CategoryEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
		public string? Slug { get; set; }
		public ICollection<ProductEntity> Products { get; set; } = [];

        public static CategoryEntity FromModel(Category model)
        {
            return new CategoryEntity
            {
                Id = model.Id,
                Name = model.Name,
                Slug = model.Slug
            };
        }

        public Category ToModel()
        {
            return new Category
            {
                Id = Id,
                Name = Name,
                Slug = Slug
            };
        }
    }
}