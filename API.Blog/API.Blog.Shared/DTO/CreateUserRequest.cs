using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class CreateUserRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required, MinLength(6)]
        public string Password { get; set; } = null!;

        public string[]? Roles { get; set; }
    }
}
