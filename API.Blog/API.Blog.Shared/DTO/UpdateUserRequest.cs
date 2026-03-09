using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Blog.Shared.DTO
{
    public class UpdateUserRequest
    {
        [EmailAddress]
        public string? Email { get; set; }

        public string? UserName { get; set; }

        public string? CurrentPassword { get; set; }

        [MinLength(6)]
        public string? NewPassword { get; set; }
    }
}
