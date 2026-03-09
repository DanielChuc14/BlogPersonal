using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared
{
    public class UserPermission
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        public string PermissionName { get; set; } = null!;
    }
}
