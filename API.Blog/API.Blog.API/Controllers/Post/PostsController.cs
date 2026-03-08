using API.Blog.Data;
using API.Blog.Shared;
using API.Blog.Shared.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Blog.API.Controllers.Post
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly DataContext _context;

        public PostsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetPosts()
        {
            return await _context.Posts
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Extract = p.Extract,
                    Content = p.Content,
                    Status = p.Status,
                    UserId = p.UserId,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(int id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
                return NotFound();

            return new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Extract = post.Extract,
                Content = post.Content,
                Status = post.Status,
                UserId = post.UserId,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt
            };
        }

        // PUT: api/Posts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(int id, PostDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound();

            post.Title = dto.Title;
            post.Extract = dto.Extract;
            post.Content = dto.Content;
            post.Status = dto.Status;
            post.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Posts
        [HttpPost]
        public async Task<ActionResult<PostDto>> PostPost(PostDto dto)
        {
            var post = new Shared.Post
            {
                Title = dto.Title,
                Extract = dto.Extract,
                Content = dto.Content,
                Status = dto.Status,
                UserId = dto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            dto.Id = post.Id;
            dto.CreatedAt = post.CreatedAt;

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, dto);
        }

        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(int id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }
    }
}
