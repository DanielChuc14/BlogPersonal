using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class AssignRolesRequest
    {
        [Required, MinLength(1)]
        public string[] Roles { get; set; } = Array.Empty<string>();
    }
}
