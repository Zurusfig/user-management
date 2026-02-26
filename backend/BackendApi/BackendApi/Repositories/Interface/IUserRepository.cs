using BackendApi.Models.Domain;

namespace BackendApi.Repositories.Interface
{
    public interface IUserRepository
    {
        Task<User> CreateUserAsync(User user, List<UserPermission> permissions);
        Task<bool> UserExistsAsync(string id);
        Task<User?> GetUserByIdAsync(string id);
    }
}
