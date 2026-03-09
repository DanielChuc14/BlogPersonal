using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class AssignPermissionRequest
    {
        [Required]
        public string PermissionName { get; set; } = null!;

        public string? RoleId { get; set; }
        public string? UserId { get; set; }
    }
}
