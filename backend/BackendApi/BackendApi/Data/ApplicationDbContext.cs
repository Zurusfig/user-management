using BackendApi.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Always call the base method first
            base.OnModelCreating(modelBuilder);

            // 1. Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = "ROLE_SUPER_ADMIN", Name = "Super Admin" },
                new Role { Id = "ROLE_ADMIN", Name = "Admin" },
                new Role { Id = "ROLE_EMPLOYEE", Name = "Employee" }
            );

            // 2. Seed Permissions (Modules)
            modelBuilder.Entity<Permission>().HasData(
                new Permission { Id = "PERM_USER_MANAGEMENT", Name = "User Management" },
                new Permission { Id = "PERM_INVENTORY", Name = "Inventory System" },
                new Permission { Id = "PERM_SALES", Name = "Sales Reports" }
            );
        }
    }
}
