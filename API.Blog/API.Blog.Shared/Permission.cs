using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared
{
    public class Permission
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }
    }
}
