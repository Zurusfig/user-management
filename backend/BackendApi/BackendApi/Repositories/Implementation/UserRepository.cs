using BackendApi.Data;
using BackendApi.Models.Domain;
using BackendApi.Models.DTO;
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
        public async Task<(List<User> Users, int TotalCount)> GetUsersDataTableAsync(DataTableRequestDto request)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Include(u => u.Permissions)
                    .ThenInclude(up => up.Permission) 
                .AsQueryable();


            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var searchTerm = request.Search.ToLower();
                query = query.Where(u => u.FirstName.ToLower().Contains(searchTerm) ||
                                         u.LastName.ToLower().Contains(searchTerm) ||
                                         u.Email.ToLower().Contains(searchTerm) ||
                                         (u.FirstName.ToLower() + " " + u.LastName.ToLower()).Contains(searchTerm));
            }

            
            var totalCount = await query.CountAsync();


            if (!string.IsNullOrWhiteSpace(request.OrderBy))
            {
                bool isDesc = request.OrderDirection?.ToLower() == "desc";
                query = request.OrderBy.ToLower() switch
                {
                    "userid" or "id" => isDesc ? query.OrderByDescending(u => u.Id) : query.OrderBy(u => u.Id),
                    "firstname" => isDesc ? query.OrderByDescending(u => u.FirstName) : query.OrderBy(u => u.FirstName),
                    "lastname" => isDesc ? query.OrderByDescending(u => u.LastName) : query.OrderBy(u => u.LastName),
                    "email" => isDesc ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
                    "username" => isDesc ? query.OrderByDescending(u => u.UserName) : query.OrderBy(u => u.UserName),
                    "phone" => isDesc ? query.OrderByDescending(u => u.Phone) : query.OrderBy(u => u.Phone),
                    "roleid" => isDesc ? query.OrderByDescending(u => u.RoleId) : query.OrderBy(u => u.RoleId),
                    "createddate" => isDesc ? query.OrderByDescending(u => u.CreatedDate) : query.OrderBy(u => u.CreatedDate),
                    _ => isDesc ? query.OrderByDescending(u => u.FirstName) : query.OrderBy(u => u.FirstName)
                };
            }

            int pageSize = request.PageSize > 0 ? request.PageSize : 10;
            int skip = request.PageNumber * pageSize;

            var users = await query.Skip(skip).Take(pageSize).ToListAsync();

            return (users, totalCount);
        }
    }
}
