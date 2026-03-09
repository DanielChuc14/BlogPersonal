using API.Blog.API.Services;
using API.Blog.Data;
using API.Blog.Shared;
using API.Blog.Shared.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Blog.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly DataContext _context;
        private readonly IAuditService _audit;

        public UsersController(UserManager<AspNetUser> userManager, DataContext context, IAuditService audit)
        {
            _userManager = userManager;
            _context = context;
            _audit = audit;
        }

        // GET /api/users?page={}&pageSize={} — paginated list of users with summarized roles
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var total = await _userManager.Users.CountAsync();
            var users = await _userManager.Users
                .OrderBy(u => u.Email)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new List<UserSummaryDto>();
            foreach (var u in users)
            {
                result.Add(new UserSummaryDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    UserName = u.UserName,
                    LockoutEnabled = u.LockoutEnabled,
                    LockoutEnd = u.LockoutEnd,
                    Roles = await _userManager.GetRolesAsync(u)
                });
            }

            return Ok(new { Total = total, Page = page, PageSize = pageSize, Items = result });
        }

        // GET /api/users/{id} — user details including roles and claims (no password)
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            var roles = await _userManager.GetRolesAsync(user);
            var claims = (await _userManager.GetClaimsAsync(user))
                .Select(c => new ClaimDto { Type = c.Type, Value = c.Value })
                .ToList();

            return Ok(new UserDetailDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                LockoutEnabled = user.LockoutEnabled,
                LockoutEnd = user.LockoutEnd,
                Roles = roles,
                Claims = claims
            });
        }

        // POST /api/users — create user with initial password and optional roles
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (await _userManager.FindByEmailAsync(body.Email) != null)
                return Conflict(new { Message = "El email ya está registrado." });

            var user = new AspNetUser { Email = body.Email, UserName = body.Email };
            var createResult = await _userManager.CreateAsync(user, body.Password);
            if (!createResult.Succeeded)
                return BadRequest(new { Errors = createResult.Errors.Select(e => e.Description) });

            if (body.Roles is { Length: > 0 })
            {
                foreach (var role in body.Roles)
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, role);
                    if (!roleResult.Succeeded)
                        return BadRequest(new { Errors = roleResult.Errors.Select(e => e.Description) });
                }
            }

            await _audit.LogAsync("CreateUser", "User", user.Id,
                $"User '{body.Email}' created with roles: {string.Join(", ", body.Roles ?? Array.Empty<string>())}.");

            return CreatedAtAction(nameof(GetById), new { id = user.Id },
                new UserDto { Id = user.Id, Email = user.Email, UserName = user.UserName });
        }

        // PUT /api/users/{id} — update profile fields (email, username); not password
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserProfileRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            var changes = new List<string>();

            if (!string.IsNullOrWhiteSpace(body.Email) && body.Email != user.Email)
            {
                if (await _userManager.FindByEmailAsync(body.Email) != null)
                    return Conflict(new { Message = "El email ya está en uso." });
                user.Email = body.Email;
                user.NormalizedEmail = body.Email.ToUpperInvariant();
                changes.Add($"Email → {body.Email}");
            }

            if (!string.IsNullOrWhiteSpace(body.UserName) && body.UserName != user.UserName)
            {
                if (await _userManager.FindByNameAsync(body.UserName) != null)
                    return Conflict(new { Message = "El nombre de usuario ya está en uso." });
                user.UserName = body.UserName;
                user.NormalizedUserName = body.UserName.ToUpperInvariant();
                changes.Add($"UserName → {body.UserName}");
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            if (changes.Count > 0)
                await _audit.LogAsync("UpdateUser", "User", id, string.Join("; ", changes));

            return Ok(new UserDto { Id = user.Id, Email = user.Email, UserName = user.UserName });
        }

        // GET /api/users/{id}/roles — get the list of roles assigned to a user
        [HttpGet("{id}/roles")]
        public async Task<IActionResult> GetRoles(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });
            return Ok(await _userManager.GetRolesAsync(user));
        }

        // POST /api/users/{id}/roles — assign one or more roles to a user
        [HttpPost("{id}/roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignRoles(string id, [FromBody] AssignRolesRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            var assigned = new List<string>();
            foreach (var role in body.Roles.Distinct())
            {
                if (!await _userManager.IsInRoleAsync(user, role))
                {
                    var result = await _userManager.AddToRoleAsync(user, role);
                    if (!result.Succeeded)
                        return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
                    assigned.Add(role);
                }
            }

            if (assigned.Count > 0)
                await _audit.LogAsync("AssignRolesToUser", "User", id,
                    $"Roles assigned: {string.Join(", ", assigned)}.");

            return Ok(new { Message = "Roles procesados.", Assigned = assigned });
        }

        // DELETE /api/users/{id}/roles/{role} — remove a specific role from a user
        [HttpDelete("{id}/roles/{role}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveRole(string id, string role)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            if (!await _userManager.IsInRoleAsync(user, role))
                return BadRequest(new { Message = $"El usuario no tiene el rol '{role}'." });

            var result = await _userManager.RemoveFromRoleAsync(user, role);
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            await _audit.LogAsync("RemoveRoleFromUser", "User", id, $"Role '{role}' removed.");

            return NoContent();
        }

        // POST /api/users/{id}/claims — add claims to a user
        [HttpPost("{id}/claims")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddClaims(string id, [FromBody] ClaimsRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            var forbidden = new[] { "Id", "role", ClaimTypes.Role };
            var invalid = body.Claims.Where(c => forbidden.Contains(c.Type)).ToList();
            if (invalid.Count > 0)
                return BadRequest(new { Message = $"Tipo de claim no permitido: {string.Join(", ", invalid.Select(c => c.Type))}." });

            var newClaims = body.Claims.Select(c => new Claim(c.Type, c.Value)).ToList();
            var result = await _userManager.AddClaimsAsync(user, newClaims);
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            await _audit.LogAsync("AddClaimsToUser", "User", id,
                $"Claims added: {string.Join(", ", newClaims.Select(c => $"{c.Type}={c.Value}"))}.");

            return Ok(new { Message = "Claims agregados correctamente." });
        }

        // DELETE /api/users/{id}/claims — remove claims from a user by type+value
        [HttpDelete("{id}/claims")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveClaims(string id, [FromBody] ClaimsRequest body)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            var toRemove = body.Claims.Select(c => new Claim(c.Type, c.Value)).ToList();
            var result = await _userManager.RemoveClaimsAsync(user, toRemove);
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            await _audit.LogAsync("RemoveClaimsFromUser", "User", id,
                $"Claims removed: {string.Join(", ", toRemove.Select(c => $"{c.Type}={c.Value}"))}.");

            return NoContent();
        }

        // POST /api/users/{id}/lock — lock a user account (optional reason and expiry)
        [HttpPost("{id}/lock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Lock(string id, [FromBody] LockUserRequest? body)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            await _userManager.SetLockoutEnabledAsync(user, true);
            var lockUntil = body?.Until ?? DateTimeOffset.UtcNow.AddYears(100);
            var result = await _userManager.SetLockoutEndDateAsync(user, lockUntil);
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            await _audit.LogAsync("LockUser", "User", id,
                $"User locked until {lockUntil:O}. Reason: {body?.Reason ?? "no reason provided"}.");

            return Ok(new { Message = "Usuario bloqueado.", LockoutEnd = lockUntil });
        }

        // POST /api/users/{id}/unlock — unlock a user account
        [HttpPost("{id}/unlock")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Unlock(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            var result = await _userManager.SetLockoutEndDateAsync(user, null);
            if (!result.Succeeded)
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });

            await _userManager.ResetAccessFailedCountAsync(user);
            await _audit.LogAsync("UnlockUser", "User", id, "User account unlocked.");

            return Ok(new { Message = "Usuario desbloqueado." });
        }

        // POST /api/users/{id}/password/reset — generate a password reset token for the user
        [HttpPost("{id}/password/reset")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetPassword(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            await _audit.LogAsync("GeneratePasswordReset", "User", id,
                $"Password reset token generated for '{user.Email}'.");

            // TODO: In production, send token via email service instead of returning it in the response
            return Ok(new { Message = "Token de restablecimiento generado.", Email = user.Email, Token = token });
        }

        // GET /api/users/{id}/posts — list all posts authored by a user
        [HttpGet("{id}/posts")]
        public async Task<IActionResult> GetPosts(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { Message = "Usuario no encontrado." });

            var posts = await _context.Posts
                .Where(p => p.UserId == id)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Extract = p.Extract,
                    Content = p.Content,
                    Status = p.Status,
                    UserId = p.UserId,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            return Ok(posts);
        }
    }
}
