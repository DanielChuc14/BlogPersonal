using API.Blog.Data;
using API.Blog.Shared;
using API.Blog.Shared.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Blog.API.Controllers.Post
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class PostTagsController : ControllerBase
    {
        private readonly DataContext _context;

        public PostTagsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/PostTags
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostTagDto>>> GetPostTags()
        {
            return await _context.PostTags
                .Select(pt => new PostTagDto
                {
                    Id = pt.Id,
                    PostId = pt.PostId,
                    TagId = pt.TagId
                })
                .ToListAsync();
        }

        // GET: api/PostTags/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostTagDto>> GetPostTag(int id)
        {
            var postTag = await _context.PostTags.FindAsync(id);

            if (postTag == null)
                return NotFound();

            return new PostTagDto
            {
                Id = postTag.Id,
                PostId = postTag.PostId,
                TagId = postTag.TagId
            };
        }

        // PUT: api/PostTags/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPostTag(int id, PostTagDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var postTag = await _context.PostTags.FindAsync(id);
            if (postTag == null)
                return NotFound();

            postTag.PostId = dto.PostId;
            postTag.TagId = dto.TagId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostTagExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/PostTags
        [HttpPost]
        public async Task<ActionResult<PostTagDto>> PostPostTag(PostTagDto dto)
        {
            var postTag = new PostTag
            {
                PostId = dto.PostId,
                TagId = dto.TagId
            };

            _context.PostTags.Add(postTag);
            await _context.SaveChangesAsync();

            dto.Id = postTag.Id;

            return CreatedAtAction(nameof(GetPostTag), new { id = postTag.Id }, dto);
        }

        // DELETE: api/PostTags/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePostTag(int id)
        {
            var postTag = await _context.PostTags.FindAsync(id);
            if (postTag == null)
                return NotFound();

            _context.PostTags.Remove(postTag);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostTagExists(int id)
        {
            return _context.PostTags.Any(e => e.Id == id);
        }
    }
}
