namespace API.Blog.Shared.DTO
{
    public class UserDetailDto
    {
        public string Id { get; set; } = null!;
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public bool LockoutEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
        public IList<ClaimDto> Claims { get; set; } = new List<ClaimDto>();
    }
}
