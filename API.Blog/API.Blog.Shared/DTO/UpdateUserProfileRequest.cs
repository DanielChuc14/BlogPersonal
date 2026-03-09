using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class UpdateUserProfileRequest
    {
        [EmailAddress]
        public string? Email { get; set; }

        public string? UserName { get; set; }
    }
}
