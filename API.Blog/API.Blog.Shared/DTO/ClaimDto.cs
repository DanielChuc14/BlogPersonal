using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class ClaimDto
    {
        [Required]
        public string Type { get; set; } = null!;

        [Required]
        public string Value { get; set; } = null!;
    }
}
