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
    public class PostMetasController : ControllerBase
    {
        private readonly DataContext _context;

        public PostMetasController(DataContext context)
        {
            _context = context;
        }

        // GET: api/PostMetas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostMetaDto>>> GetPostMetas()
        {
            return await _context.PostMetas
                .Select(pm => new PostMetaDto
                {
                    Id = pm.Id,
                    Key = pm.Key,
                    PostId = pm.PostId
                })
                .ToListAsync();
        }

        // GET: api/PostMetas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostMetaDto>> GetPostMeta(int id)
        {
            var postMeta = await _context.PostMetas.FindAsync(id);

            if (postMeta == null)
                return NotFound();

            return new PostMetaDto
            {
                Id = postMeta.Id,
                Key = postMeta.Key,
                PostId = postMeta.PostId
            };
        }

        // PUT: api/PostMetas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPostMeta(int id, PostMetaDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var postMeta = await _context.PostMetas.FindAsync(id);
            if (postMeta == null)
                return NotFound();

            postMeta.Key = dto.Key;
            postMeta.PostId = dto.PostId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostMetaExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/PostMetas
        [HttpPost]
        public async Task<ActionResult<PostMetaDto>> PostPostMeta(PostMetaDto dto)
        {
            var postMeta = new PostMeta
            {
                Key = dto.Key,
                PostId = dto.PostId
            };

            _context.PostMetas.Add(postMeta);
            await _context.SaveChangesAsync();

            dto.Id = postMeta.Id;

            return CreatedAtAction(nameof(GetPostMeta), new { id = postMeta.Id }, dto);
        }

        // DELETE: api/PostMetas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePostMeta(int id)
        {
            var postMeta = await _context.PostMetas.FindAsync(id);
            if (postMeta == null)
                return NotFound();

            _context.PostMetas.Remove(postMeta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostMetaExists(int id)
        {
            return _context.PostMetas.Any(e => e.Id == id);
        }
    }
}
