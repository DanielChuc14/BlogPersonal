using API.Blog.API.Configuration;
using API.Blog.Data;
using API.Blog.Shared.Auth;
using API.Blog.Shared.DTO;
using API.Blog.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Blog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AspNetUser> _userManager;
        private readonly JwtConfig _jwtConfig;
        //private readonly SignInManager<IdentityUser> _signInManager;
        private readonly DataContext _context;
        public AccountController(DataContext context, UserManager<AspNetUser> userManager, IOptions<JwtConfig> jwtConfig)
        {
            _context = context;
            _userManager = userManager;
            _jwtConfig = jwtConfig.Value;
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> register([FromBody] RegisterUser request)
        {
            if (!ModelState.IsValid) return BadRequest();

            var emailExist = await _userManager.FindByEmailAsync(request.Email);
            if (emailExist != null) return BadRequest(new AuthResult()
            {
                Result = false,
                Errors = new List<string>()
            {
                "El email ya existe"
            }
            });

            //Create User
            var user = new AspNetUser()
            {
                Email = request.Email,
                UserName = request.Email
            };
            var isCreated = await _userManager.CreateAsync(user, request.Password);
            if (isCreated.Succeeded)
            {
                var token = await GenerateTokenAsync(user);
                return Ok(new AuthResult()
                {
                    Result = true,
                    Token = token
                });
            }
            else
            {
                var errors = new List<string>();
                foreach (var err in isCreated.Errors)
                {
                    errors.Add(err.Description);
                }
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = errors
                });
            }
            /* return BadRequest(new AuthResult()
             {
                 Result = false,
                 Errors = new List<string> { "El usuario no puede ser registrado"}
             });*/
        }
        [HttpPost("ForgotPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid) return BadRequest();

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // Do not reveal whether the user exists
                return Ok(new { Message = "Si el correo está registrado, recibirás las instrucciones para restablecer tu contraseña." });
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            // In production: send resetToken via email service
            // For now, return it in the response (development only)
            return Ok(new { Message = "Token de recuperación generado.", Token = resetToken, Email = user.Email });
        }

        [HttpPost("ResetPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid) return BadRequest();

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest(new AuthResult { Result = false, Errors = new List<string> { "Usuario no encontrado." } });
            }

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            if (result.Succeeded)
            {
                return Ok(new AuthResult { Result = true });
            }

            var errors = new List<string>();
            foreach (var err in result.Errors)
            {
                errors.Add(err.Description);
            }
            return BadRequest(new AuthResult { Result = false, Errors = errors });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest userDto)
        {
            if (!ModelState.IsValid) return BadRequest();

            var existUser = await _userManager.FindByEmailAsync(userDto.Email);
            if (existUser == null) return BadRequest(new AuthResult
            {
                Errors = new List<string> { "Invalid Payload" },
                Result = false
            });

            var checkUserAndPass = await _userManager.CheckPasswordAsync(existUser, userDto.Password);
            if (!checkUserAndPass) return BadRequest(new AuthResult
            {
                Errors = new List<string> { "Invalid Credentials" },
                Result = false
            });

            var token = await GenerateTokenAsync(existUser);
            return Ok(new AuthResult()
            {
                User = existUser.Id,
                UserEmail = userDto.Email,
                Result = true,
                Token = token
            });
        }
        private async Task<string> GenerateTokenAsync(AspNetUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim("Id", user.Id),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email!),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString())
            };

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtConfig.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }
    }
}
