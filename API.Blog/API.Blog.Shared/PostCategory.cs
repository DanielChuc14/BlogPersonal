using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Blog.Shared
{
    public class PostCategory
    {
        [Key]
        public int Id { get; set; }

        public int CategoryId { get; set; }

        public int PostId { get; set; }
        [ForeignKey("CategoryId")]

        public Category Category { get; set; } = null!;
        [ForeignKey("PostId")]

        public Post Post { get; set; } = null!;
    }
}
