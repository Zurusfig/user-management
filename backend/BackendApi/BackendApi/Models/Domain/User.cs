namespace BackendApi.Models.Domain
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string RoleId { get; set; } = null!; //Foreign key to Role
        public string UserName { get; set; } = null!;
        public string Password { get; set; } = null!;
        public List<UserPermission> Permissions { get; set; } = new List<UserPermission>();

    }
}
