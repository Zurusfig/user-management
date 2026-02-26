using BackendApi.Models.Domain;

namespace BackendApi.Repositories.Interface
{
    public interface IUserRepository
    {
        Task<User> CreateUserAsync(User user, List<UserPermission> permissions);
    }
}
