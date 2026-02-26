using BackendApi.Models.Domain;

namespace BackendApi.Repositories.Interface
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>> GetAllAsync();
    }
}
