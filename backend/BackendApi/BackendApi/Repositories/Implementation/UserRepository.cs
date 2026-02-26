using BackendApi.Data;
using BackendApi.Models.Domain;
using BackendApi.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        public UserRepository(ApplicationDbContext context)
        {
            this._context = context;
        }
        public async Task<User> CreateUserAsync(User user, List<UserPermission> permissions)
        {
            user.Permissions = permissions;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }
    }
}
