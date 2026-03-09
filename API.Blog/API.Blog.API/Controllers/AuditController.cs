using API.Blog.Data;
using API.Blog.Shared.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Blog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Auditor")]
    public class AuditController : ControllerBase
    {
        private readonly DataContext _context;

        public AuditController(DataContext context)
        {
            _context = context;
        }

        // GET /api/audit — paginated, filterable list of audit log entries
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? actorUserId,
            [FromQuery] string? action,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] string? targetType,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var query = _context.AuditLogs.AsQueryable();

            if (!string.IsNullOrWhiteSpace(actorUserId))
                query = query.Where(a => a.ActorUserId == actorUserId);

            if (!string.IsNullOrWhiteSpace(action))
                query = query.Where(a => a.Action.Contains(action));

            if (!string.IsNullOrWhiteSpace(targetType))
                query = query.Where(a => a.TargetType == targetType);

            if (from.HasValue)
                query = query.Where(a => a.Timestamp >= from.Value);

            if (to.HasValue)
                query = query.Where(a => a.Timestamp <= to.Value);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(a => a.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AuditLogDto
                {
                    Id = a.Id,
                    ActorUserId = a.ActorUserId,
                    ActorUserName = a.ActorUserName,
                    Action = a.Action,
                    TargetType = a.TargetType,
                    TargetId = a.TargetId,
                    Details = a.Details,
                    Timestamp = a.Timestamp
                })
                .ToListAsync();

            return Ok(new { Total = total, Page = page, PageSize = pageSize, Items = items });
        }

        // GET /api/audit/{id} — get single audit log entry by id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entry = await _context.AuditLogs.FindAsync(id);
            if (entry == null) return NotFound(new { Message = "Registro de auditoría no encontrado." });

            return Ok(new AuditLogDto
            {
                Id = entry.Id,
                ActorUserId = entry.ActorUserId,
                ActorUserName = entry.ActorUserName,
                Action = entry.Action,
                TargetType = entry.TargetType,
                TargetId = entry.TargetId,
                Details = entry.Details,
                Timestamp = entry.Timestamp
            });
        }
    }
}
