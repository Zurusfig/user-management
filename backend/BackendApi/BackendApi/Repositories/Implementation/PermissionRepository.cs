using BackendApi.Data;
using BackendApi.Models.Domain;
using BackendApi.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Repositories.Implementation
{
    public class PermissionRepository : IPermissionsRepository
    {
        private readonly ApplicationDbContext _context;
        public PermissionRepository(ApplicationDbContext context)
        {
            this._context = context;
        }
        public async Task<IEnumerable<Permission>> GetAllAsync()
        {
            return await _context.Permissions.ToListAsync();
        }
    }
}
