using API.Blog.Data;
using API.Blog.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Blog.API.Controllers.Post
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostMetasController : ControllerBase
    {
        private readonly Data.DataContext _context;
        public PostMetasController(DataContext context)
        {
            _context = context;
        }

        // GET: api/PostMetas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostMeta>>> GetPostMetas()
        {
            return await _context.PostMetas.ToListAsync();
        }

        // GET: api/PostMetas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostMeta>> GetPostMeta(int id)
        {
            var postMeta = await _context.PostMetas.FindAsync(id);

            if (postMeta == null)
            {
                return NotFound();
            }

            return postMeta;
        }

        // PUT: api/PostMetas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPostMetas(int id, PostMeta postMeta)
        {
            if (id != postMeta.Id)
            {
                return BadRequest();
            }

            _context.Entry(postMeta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!postMetaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/PostMetas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PostMeta>> PostPostMetas(PostMeta postMeta)
        {
            _context.PostMetas.Add(postMeta);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (postMetaExists(postMeta.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPostMeta", new { id = postMeta.Id }, postMeta);
        }

        // DELETE: api/PostMetas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePostMeta(int id)
        {
            var postMeta = await _context.PostMetas.FindAsync(id);
            if (postMeta == null)
            {
                return NotFound();
            }

            _context.PostMetas.Remove(postMeta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool postMetaExists(int id)
        {
            return _context.PostMetas.Any(e => e.Id == id);
        }
    }
}
