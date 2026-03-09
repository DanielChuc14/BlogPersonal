using API.Blog.Data;
using API.Blog.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Blog.API.Seeders
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var sp = scope.ServiceProvider;

            var roleManager = sp.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = sp.GetRequiredService<UserManager<AspNetUser>>();
            var context = sp.GetRequiredService<DataContext>();

            await SeedRolesAsync(roleManager);
            await SeedPermissionsAsync(context);
            await SeedAdminUserAsync(userManager, roleManager);
            await SeedCategoriesAsync(context);
            await SeedTagsAsync(context);
        }

        // ── Roles ────────────────────────────────────────────────────────────
        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = ["Admin", "Editor", "Author", "Auditor"];

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // ── Permissions ──────────────────────────────────────────────────────
        private static async Task SeedPermissionsAsync(DataContext context)
        {
            var permissions = new List<(string Name, string Description)>
            {
                ("posts.view",       "View published posts"),
                ("posts.create",     "Create new posts"),
                ("posts.edit",       "Edit existing posts"),
                ("posts.delete",     "Delete posts"),
                ("posts.publish",    "Publish or unpublish posts"),
                ("categories.view",  "View categories"),
                ("categories.manage","Create, edit and delete categories"),
                ("tags.view",        "View tags"),
                ("tags.manage",      "Create, edit and delete tags"),
                ("users.view",       "View user list"),
                ("users.manage",     "Create, edit, lock and delete users"),
                ("roles.view",       "View roles"),
                ("roles.manage",     "Create, edit and delete roles"),
                ("permissions.view", "View permissions"),
                ("permissions.manage","Create, edit and delete permissions"),
                ("audit.view",       "View audit log"),
            };

            foreach (var (name, description) in permissions)
            {
                if (!await context.Permissions.AnyAsync(p => p.Name == name))
                {
                    context.Permissions.Add(new Permission { Name = name, Description = description });
                }
            }

            await context.SaveChangesAsync();
        }

        // ── Default admin user ────────────────────────────────────────────────
        private static async Task SeedAdminUserAsync(
            UserManager<AspNetUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            const string adminEmail = "admin@blog.com";
            const string adminPassword = "Admin@123456";

            if (await userManager.FindByEmailAsync(adminEmail) is null)
            {
                var admin = new AspNetUser
                {
                    UserName = "admin",
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, adminPassword);

                if (result.Succeeded)
                    await userManager.AddToRoleAsync(admin, "Admin");
            }
        }

        // ── Categories ───────────────────────────────────────────────────────
        private static async Task SeedCategoriesAsync(DataContext context)
        {
            if (await context.Categories.AnyAsync())
                return;

            var categories = new List<Category>
            {
                new() { Name = "Technology",  Description = "News and articles about technology", CreatedAt = DateTime.UtcNow },
                new() { Name = "Programming", Description = "Tutorials and tips for developers",   CreatedAt = DateTime.UtcNow },
                new() { Name = "Tutorial",    Description = "Step-by-step guides",                 CreatedAt = DateTime.UtcNow },
                new() { Name = "Opinion",     Description = "Opinion pieces and editorials",       CreatedAt = DateTime.UtcNow },
                new() { Name = "General",     Description = "General topics",                      CreatedAt = DateTime.UtcNow },
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        // ── Tags ─────────────────────────────────────────────────────────────
        private static async Task SeedTagsAsync(DataContext context)
        {
            if (await context.Tags.AnyAsync())
                return;

            var tags = new List<Tag>
            {
                new() { Name = "C#",         Description = "C# language",               CreatedAt = DateTime.UtcNow },
                new() { Name = ".NET",        Description = ".NET ecosystem",            CreatedAt = DateTime.UtcNow },
                new() { Name = "Angular",     Description = "Angular framework",         CreatedAt = DateTime.UtcNow },
                new() { Name = "TypeScript",  Description = "TypeScript language",       CreatedAt = DateTime.UtcNow },
                new() { Name = "PostgreSQL",  Description = "PostgreSQL database",       CreatedAt = DateTime.UtcNow },
                new() { Name = "Entity Framework", Description = "EF Core ORM",         CreatedAt = DateTime.UtcNow },
                new() { Name = "REST API",    Description = "RESTful API design",        CreatedAt = DateTime.UtcNow },
                new() { Name = "JWT",         Description = "JSON Web Tokens",           CreatedAt = DateTime.UtcNow },
                new() { Name = "Docker",      Description = "Docker containers",         CreatedAt = DateTime.UtcNow },
                new() { Name = "Open Source", Description = "Open source projects",      CreatedAt = DateTime.UtcNow },
            };

            context.Tags.AddRange(tags);
            await context.SaveChangesAsync();
        }
    }
}
