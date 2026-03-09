using API.Blog.Data;
using API.Blog.Shared;
using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Blog.API.Services
{
    public class AuditService : IAuditService
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditService(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogAsync(string action, string targetType, string? targetId, string? details)
        {
            var user = _httpContextAccessor.HttpContext?.User;

            var actorId = user?.FindFirstValue("Id")
                       ?? user?.FindFirstValue(ClaimTypes.NameIdentifier)
                       ?? "unknown";

            var actorName = user?.FindFirstValue(ClaimTypes.Email)
                         ?? user?.FindFirstValue(JwtRegisteredClaimNames.Email)
                         ?? "unknown";

            _context.Set<AuditLog>().Add(new AuditLog
            {
                ActorUserId = actorId,
                ActorUserName = actorName,
                Action = action,
                TargetType = targetType,
                TargetId = targetId,
                Details = details,
                Timestamp = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }
    }
}
