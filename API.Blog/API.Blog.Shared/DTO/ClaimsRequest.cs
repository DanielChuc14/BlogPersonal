using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared.DTO
{
    public class ClaimsRequest
    {
        [Required, MinLength(1)]
        public ClaimDto[] Claims { get; set; } = Array.Empty<ClaimDto>();
    }
}
