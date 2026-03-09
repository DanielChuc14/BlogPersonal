using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Blog.Shared.DTO
{
    public class AssignRoleRequest
    {
        [Required]
        public string RoleName { get; set; } = null!;
    }
}
