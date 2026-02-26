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
        public async Task<bool> UserExistsAsync(string id)
        {
            return await _context.Users.AnyAsync(u => u.Id == id);
        }
        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _context.Users
                .Include(u => u.Permissions)           // Get the join table rows
                    .ThenInclude(up => up.Permission)  // Join the actual Permission table for the Name
                .FirstOrDefaultAsync(u => u.Id == id);
        }
        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<User?> UpdateUserAsync(string id, User updatedUser, List<UserPermission> newPermissions)
        {
            var existingUser = await _context.Users
                .Include(u => u.Permissions)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (existingUser == null)
            {
                return null;
            }

           
            existingUser.FirstName = updatedUser.FirstName;
            existingUser.LastName = updatedUser.LastName;
            existingUser.Email = updatedUser.Email;
            existingUser.Phone = updatedUser.Phone;
            existingUser.RoleId = updatedUser.RoleId;
            existingUser.UserName = updatedUser.UserName;


            _context.UserPermissions.RemoveRange(existingUser.Permissions);

        
            foreach (var perm in newPermissions)
            {
                perm.UserId = existingUser.Id;
                _context.UserPermissions.Add(perm);
            }
            await _context.SaveChangesAsync();

            return existingUser;
        }
    }
}
