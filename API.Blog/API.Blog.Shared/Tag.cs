using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Blog.Shared
{
    public class Tag
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        [Timestamp]
        [Column(TypeName = "timestamp")]
        public DateTime? UpdatedAt { get; set; }

        public ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
    }
}
