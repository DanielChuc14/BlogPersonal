using API.Blog.API.Services;
using API.Blog.Data;
using API.Blog.Shared;
using API.Blog.Shared.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Blog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class PermissionsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly IAuditService _audit;

        public PermissionsController(
            DataContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<AspNetUser> userManager,
            IAuditService audit)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
            _audit = audit;
        }

        // GET /api/permissions — list all persistent permissions
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var perms = await _context.Permissions
                .Select(p => new PermissionDto { Id = p.Id, Name = p.Name, Description = p.Description })
                .ToListAsync();
            return Ok(perms);
        }

        // GET /api/permissions/{id} — get permission by id
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var perm = await _context.Permissions.FindAsync(id);
            if (perm == null) return NotFound(new { Message = "Permiso no encontrado." });
            return Ok(new PermissionDto { Id = perm.Id, Name = perm.Name, Description = perm.Description });
        }

        // POST /api/permissions — create a new permission
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePermissionRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _context.Permissions.AnyAsync(p => p.Name == body.Name))
                return Conflict(new { Message = $"El permiso '{body.Name}' ya existe." });

            var perm = new Permission { Name = body.Name, Description = body.Description };
            _context.Permissions.Add(perm);
            await _context.SaveChangesAsync();

            await _audit.LogAsync("CreatePermission", "Permission", perm.Id.ToString(),
                $"Permission '{body.Name}' created.");

            return CreatedAtAction(nameof(GetById), new { id = perm.Id },
                new PermissionDto { Id = perm.Id, Name = perm.Name, Description = perm.Description });
        }

        // PUT /api/permissions/{id} — update permission name and description
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePermissionRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var perm = await _context.Permissions.FindAsync(id);
            if (perm == null) return NotFound(new { Message = "Permiso no encontrado." });

            if (await _context.Permissions.AnyAsync(p => p.Name == body.Name && p.Id != id))
                return Conflict(new { Message = $"El nombre '{body.Name}' ya está en uso." });

            var oldName = perm.Name;
            perm.Name = body.Name;
            perm.Description = body.Description;
            await _context.SaveChangesAsync();

            await _audit.LogAsync("UpdatePermission", "Permission", id.ToString(),
                $"Permission renamed from '{oldName}' to '{body.Name}'.");

            return Ok(new PermissionDto { Id = perm.Id, Name = perm.Name, Description = perm.Description });
        }

        // DELETE /api/permissions/{id}?force={bool} — delete permission; force removes all mappings first
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] bool force = false)
        {
            var perm = await _context.Permissions.FindAsync(id);
            if (perm == null) return NotFound(new { Message = "Permiso no encontrado." });

            if (force)
            {
                _context.RolePermissions.RemoveRange(
                    _context.RolePermissions.Where(rp => rp.PermissionName == perm.Name));
                _context.UserPermissions.RemoveRange(
                    _context.UserPermissions.Where(up => up.PermissionName == perm.Name));
            }

            _context.Permissions.Remove(perm);
            await _context.SaveChangesAsync();

            await _audit.LogAsync("DeletePermission", "Permission", id.ToString(),
                $"Permission '{perm.Name}' deleted. force={force}.");

            return NoContent();
        }

        // POST /api/permissions/assign — assign a permission to a role or user
        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignPermissionRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(body.RoleId) && string.IsNullOrWhiteSpace(body.UserId))
                return BadRequest(new { Message = "Se requiere roleId o userId." });

            if (!await _context.Permissions.AnyAsync(p => p.Name == body.PermissionName))
                return NotFound(new { Message = $"El permiso '{body.PermissionName}' no existe." });

            if (!string.IsNullOrWhiteSpace(body.RoleId))
            {
                var role = await _roleManager.FindByIdAsync(body.RoleId);
                if (role == null) return NotFound(new { Message = "Rol no encontrado." });

                if (await _context.RolePermissions.AnyAsync(rp => rp.RoleId == body.RoleId && rp.PermissionName == body.PermissionName))
                    return Conflict(new { Message = "El rol ya tiene este permiso." });

                _context.RolePermissions.Add(new RolePermission { RoleId = body.RoleId, PermissionName = body.PermissionName });
                await _context.SaveChangesAsync();

                await _audit.LogAsync("AssignPermission", "Role", body.RoleId,
                    $"Permission '{body.PermissionName}' assigned to role '{role.Name}'.");
            }

            if (!string.IsNullOrWhiteSpace(body.UserId))
            {
                var user = await _userManager.FindByIdAsync(body.UserId);
                if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

                if (await _context.UserPermissions.AnyAsync(up => up.UserId == body.UserId && up.PermissionName == body.PermissionName))
                    return Conflict(new { Message = "El usuario ya tiene este permiso." });

                _context.UserPermissions.Add(new UserPermission { UserId = body.UserId, PermissionName = body.PermissionName });
                await _context.SaveChangesAsync();

                await _audit.LogAsync("AssignPermission", "User", body.UserId,
                    $"Permission '{body.PermissionName}' assigned to user '{user.Email}'.");
            }

            return Ok(new { Message = "Permiso asignado correctamente." });
        }

        // POST /api/permissions/unassign — remove a permission from a role or user
        [HttpPost("unassign")]
        public async Task<IActionResult> Unassign([FromBody] AssignPermissionRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(body.RoleId) && string.IsNullOrWhiteSpace(body.UserId))
                return BadRequest(new { Message = "Se requiere roleId o userId." });

            if (!string.IsNullOrWhiteSpace(body.RoleId))
            {
                var mapping = await _context.RolePermissions
                    .FirstOrDefaultAsync(rp => rp.RoleId == body.RoleId && rp.PermissionName == body.PermissionName);
                if (mapping == null)
                    return NotFound(new { Message = "El rol no tiene ese permiso asignado." });

                _context.RolePermissions.Remove(mapping);
                await _context.SaveChangesAsync();

                await _audit.LogAsync("UnassignPermission", "Role", body.RoleId,
                    $"Permission '{body.PermissionName}' removed from role.");
            }

            if (!string.IsNullOrWhiteSpace(body.UserId))
            {
                var mapping = await _context.UserPermissions
                    .FirstOrDefaultAsync(up => up.UserId == body.UserId && up.PermissionName == body.PermissionName);
                if (mapping == null)
                    return NotFound(new { Message = "El usuario no tiene ese permiso asignado." });

                _context.UserPermissions.Remove(mapping);
                await _context.SaveChangesAsync();

                await _audit.LogAsync("UnassignPermission", "User", body.UserId,
                    $"Permission '{body.PermissionName}' removed from user.");
            }

            return Ok(new { Message = "Permiso removido correctamente." });
        }
    }
}
