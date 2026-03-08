using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Blog.Shared.Auth
{
    public class AuthResult
    {
        public string User { get; set; }
        public string UserEmail { get; set; }
        public string Token { get; set; }
        public bool Result { get; set; }
        public List<string> Errors { get; set; }
    }
}
