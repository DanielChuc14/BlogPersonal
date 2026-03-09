using System.ComponentModel.DataAnnotations;

namespace API.Blog.Shared
{
    public class AuditLog
    {
        public int Id { get; set; }

        [Required]
        public string ActorUserId { get; set; } = null!;

        [Required]
        public string ActorUserName { get; set; } = null!;

        [Required]
        public string Action { get; set; } = null!;

        [Required]
        public string TargetType { get; set; } = null!;

        public string? TargetId { get; set; }
        public string? Details { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
