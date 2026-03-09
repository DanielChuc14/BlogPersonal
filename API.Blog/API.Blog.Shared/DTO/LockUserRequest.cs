namespace API.Blog.Shared.DTO
{
    public class LockUserRequest
    {
        public string? Reason { get; set; }
        public DateTimeOffset? Until { get; set; }
    }
}
