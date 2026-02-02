using API.Blog.Data;
using API.Blog.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Blog.API.Controllers.Post
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostCategoriesController : ControllerBase
    {
        private readonly DataContext _context;
        public PostCategoriesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/PostCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostCategory>>> GetPostCategories()
        {
            return await _context.PostCategories.ToListAsync();
        }

        // GET: api/PostCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostCategory>> GetPostCategory(int id)
        {
            var postCategory = await _context.PostCategories.FindAsync(id);

            if (postCategory == null)
            {
                return NotFound();
            }

            return postCategory;
        }

        // PUT: api/PostCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPostCategory(int id, PostCategory postCategory)
        {
            if (id != postCategory.Id)
            {
                return BadRequest();
            }

            _context.Entry(postCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostCategoryExists(id))
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

        // POST: api/PostCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PostCategory>> PostPostCategory(PostCategory postCategory)
        {
            _context.PostCategories.Add(postCategory);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PostCategoryExists(postCategory.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPostCategory", new { id = postCategory.Id }, postCategory);
        }

        // DELETE: api/PostCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePostCategory(int id)
        {
            var postCategory = await _context.PostCategories.FindAsync(id);
            if (postCategory == null)
            {
                return NotFound();
            }

            _context.PostCategories.Remove(postCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostCategoryExists(int id)
        {
            return _context.PostCategories.Any(e => e.Id == id);
        }
    }
}
