using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Blog.Shared
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        [Column(TypeName = "text")]
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        [Timestamp]
        [Column(TypeName = "timestamp")]
        public DateTime? UpdatedAt { get; set; }

        public ICollection<PostCategory> PostCategories { get; set; } = new List<PostCategory>();
    }
}
