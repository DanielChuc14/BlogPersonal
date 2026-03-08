using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
