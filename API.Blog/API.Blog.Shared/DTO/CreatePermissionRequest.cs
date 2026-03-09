using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class CreatePermissionRequest
    {
        [Required]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }
    }
}
