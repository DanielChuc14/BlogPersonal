using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Blog.Shared
{
    public class PostTag
    {
        [Key]
        public int Id { get; set; }

        public int TagId { get; set; }

        public int PostId { get; set; }
        [ForeignKey("PostId")]

        public Post Post { get; set; } = null!;
        [ForeignKey("TagId")]

        public Tag Tag { get; set; } = null!;
    }
}
