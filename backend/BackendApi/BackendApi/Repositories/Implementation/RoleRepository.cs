using BackendApi.Data;
using BackendApi.Models.Domain;
using BackendApi.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories.Implementation
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;
        public RoleRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            return await _context.Roles.ToListAsync();
        }
    }
}
