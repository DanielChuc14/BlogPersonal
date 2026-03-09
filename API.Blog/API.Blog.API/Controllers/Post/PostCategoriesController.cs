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
    public class PostCategoriesController : ControllerBase
    {
        private readonly DataContext _context;

        public PostCategoriesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/PostCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostCategoryDto>>> GetPostCategories()
        {
            return await _context.PostCategories
                .Select(pc => new PostCategoryDto
                {
                    Id = pc.Id,
                    PostId = pc.PostId,
                    CategoryId = pc.CategoryId
                })
                .ToListAsync();
        }

        // GET: api/PostCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostCategoryDto>> GetPostCategory(int id)
        {
            var postCategory = await _context.PostCategories.FindAsync(id);

            if (postCategory == null)
                return NotFound();

            return new PostCategoryDto
            {
                Id = postCategory.Id,
                PostId = postCategory.PostId,
                CategoryId = postCategory.CategoryId
            };
        }

        // PUT: api/PostCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPostCategory(int id, PostCategoryDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var postCategory = await _context.PostCategories.FindAsync(id);
            if (postCategory == null)
                return NotFound();

            postCategory.PostId = dto.PostId;
            postCategory.CategoryId = dto.CategoryId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostCategoryExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/PostCategories
        [HttpPost]
        public async Task<ActionResult<PostCategoryDto>> PostPostCategory(PostCategoryDto dto)
        {
            var postCategory = new PostCategory
            {
                PostId = dto.PostId,
                CategoryId = dto.CategoryId
            };

            _context.PostCategories.Add(postCategory);
            await _context.SaveChangesAsync();

            dto.Id = postCategory.Id;

            return CreatedAtAction(nameof(GetPostCategory), new { id = postCategory.Id }, dto);
        }

        // DELETE: api/PostCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePostCategory(int id)
        {
            var postCategory = await _context.PostCategories.FindAsync(id);
            if (postCategory == null)
                return NotFound();

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
