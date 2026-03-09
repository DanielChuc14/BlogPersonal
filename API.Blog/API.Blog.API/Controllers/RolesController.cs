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
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AspNetUser> _userManager;
        private readonly DataContext _context;
        private readonly IAuditService _audit;

        public RolesController(
            RoleManager<IdentityRole> roleManager,
            UserManager<AspNetUser> userManager,
            DataContext context,
            IAuditService audit)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _context = context;
            _audit = audit;
        }

        // GET /api/roles — return id and name for all roles
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var roles = await _roleManager.Roles
                .Select(r => new RoleDto { Id = r.Id, Name = r.Name! })
                .ToListAsync();
            return Ok(roles);
        }

        // GET /api/roles/{id} — get a single role by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound(new { Message = "Rol no encontrado." });
            return Ok(new RoleDto { Id = role.Id, Name = role.Name! });
        }

        // POST /api/roles — create a new role
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRoleRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _roleManager.RoleExistsAsync(body.Name))
                return Conflict(new { Message = $"El rol '{body.Name}' ya existe." });

            var result = await _roleManager.CreateAsync(new IdentityRole(body.Name));
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            var created = await _roleManager.FindByNameAsync(body.Name);
            await _audit.LogAsync("CreateRole", "Role", created!.Id, $"Role '{body.Name}' created.");

            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                new RoleDto { Id = created.Id, Name = created.Name! });
        }

        // PUT /api/roles/{id} — rename a role; validates name uniqueness
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateRoleRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound(new { Message = "Rol no encontrado." });

            if (!string.Equals(role.Name, body.Name, StringComparison.OrdinalIgnoreCase)
                && await _roleManager.RoleExistsAsync(body.Name))
                return Conflict(new { Message = $"El rol '{body.Name}' ya existe." });

            var oldName = role.Name;
            role.Name = body.Name;
            var result = await _roleManager.UpdateAsync(role);
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            await _audit.LogAsync("UpdateRole", "Role", id, $"Role renamed from '{oldName}' to '{body.Name}'.");

            return Ok(new RoleDto { Id = role.Id, Name = role.Name! });
        }

        // DELETE /api/roles/{id}?force={bool} — delete role; force=true removes it from all users first
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id, [FromQuery] bool force = false)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound(new { Message = "Rol no encontrado." });

            if (force)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
                foreach (var user in usersInRole)
                    await _userManager.RemoveFromRoleAsync(user, role.Name!);
            }

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            await _audit.LogAsync("DeleteRole", "Role", id, $"Role '{role.Name}' deleted. force={force}.");

            return NoContent();
        }

        // GET /api/roles/{id}/permissions — list all permissions assigned to this role
        [HttpGet("{id}/permissions")]
        public async Task<IActionResult> GetPermissions(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound(new { Message = "Rol no encontrado." });

            var permissions = await _context.RolePermissions
                .Where(rp => rp.RoleId == id)
                .Select(rp => rp.PermissionName)
                .ToListAsync();

            return Ok(permissions);
        }

        // POST /api/roles/{id}/permissions — assign one or more permissions to the role
        [HttpPost("{id}/permissions")]
        public async Task<IActionResult> AddPermissions(string id, [FromBody] AddPermissionsRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound(new { Message = "Rol no encontrado." });

            var added = new List<string>();
            foreach (var perm in body.Permissions.Distinct())
            {
                var alreadyExists = await _context.RolePermissions
                    .AnyAsync(rp => rp.RoleId == id && rp.PermissionName == perm);
                if (!alreadyExists)
                {
                    _context.RolePermissions.Add(new RolePermission { RoleId = id, PermissionName = perm });
                    added.Add(perm);
                }
            }

            if (added.Count > 0)
            {
                await _context.SaveChangesAsync();
                await _audit.LogAsync("AssignPermissionsToRole", "Role", id,
                    $"Permissions assigned: {string.Join(", ", added)}.");
            }

            return Ok(new { Message = "Permisos procesados.", Assigned = added });
        }

        // DELETE /api/roles/{id}/permissions/{permissionName} — remove a specific permission from the role
        [HttpDelete("{id}/permissions/{permissionName}")]
        public async Task<IActionResult> RemovePermission(string id, string permissionName)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return NotFound(new { Message = "Rol no encontrado." });

            var mapping = await _context.RolePermissions
                .FirstOrDefaultAsync(rp => rp.RoleId == id && rp.PermissionName == permissionName);
            if (mapping == null)
                return NotFound(new { Message = $"El rol no tiene el permiso '{permissionName}'." });

            _context.RolePermissions.Remove(mapping);
            await _context.SaveChangesAsync();

            await _audit.LogAsync("RemovePermissionFromRole", "Role", id,
                $"Permission '{permissionName}' removed from role '{role.Name}'.");

            return NoContent();
        }
    }
}
