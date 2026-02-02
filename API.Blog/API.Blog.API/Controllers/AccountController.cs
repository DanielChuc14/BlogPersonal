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
                var token = GenerateToken(user);
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

            var token = GenerateToken(existUser);
            return Ok(new AuthResult()
            {
                Result = true,
                Token = token
            });
        }
        private string GenerateToken(IdentityUser user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtConfig.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new ClaimsIdentity(new[]
                {
                    new Claim("Id", user.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString())
                }
                )),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }
    }
}
