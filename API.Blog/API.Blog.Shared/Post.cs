using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace API.Blog.Shared
{
    public class Post
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        [Column(TypeName = "text")]
        public string? Extract { get; set; }
        [Column(TypeName = "text")]
        public string? Content { get; set; }

        public int? Status { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        [Timestamp]
        [Column(TypeName = "timestamp")]
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UserId")]

        public AspNetUser User { get; set; } = null!;
        public ICollection<PostCategory> PostCategories { get; set; } = new List<PostCategory>();

        public ICollection<PostTag> PostTags { get; set; } = new List<PostTag>();
        public ICollection<PostMeta> Resources { get; set; } = new List<PostMeta>();

    }
}
