using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared
{
    public class RolePermission
    {
        public int Id { get; set; }

        [Required]
        public string RoleId { get; set; } = null!;

        [Required]
        public string PermissionName { get; set; } = null!;
    }
}
