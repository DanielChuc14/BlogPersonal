namespace API.Blog.Shared.DTO
{
    public class AuditLogDto
    {
        public int Id { get; set; }
        public string ActorUserId { get; set; } = null!;
        public string ActorUserName { get; set; } = null!;
        public string Action { get; set; } = null!;
        public string TargetType { get; set; } = null!;
        public string? TargetId { get; set; }
        public string? Details { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
