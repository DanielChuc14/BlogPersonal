namespace API.Blog.API.Services
{
    public interface IAuditService
    {
        Task LogAsync(string action, string targetType, string? targetId, string? details);
    }
}
