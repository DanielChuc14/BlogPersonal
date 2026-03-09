using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class AddPermissionsRequest
    {
        [Required, MinLength(1)]
        public string[] Permissions { get; set; } = Array.Empty<string>();
    }
}
