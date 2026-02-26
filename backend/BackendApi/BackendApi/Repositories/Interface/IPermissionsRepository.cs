using BackendApi.Models.Domain;

namespace BackendApi.Repositories.Interface
{
    public interface IPermissionsRepository
    {
        Task<IEnumerable<Permission>> GetAllAsync();
    }
}
