using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class UpdateRoleRequest
    {
        [Required]
        public string Name { get; set; } = null!;
    }
}
