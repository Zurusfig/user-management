namespace BackendApi.Models.DTO
{
    public class UserUpdateRequestDto
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string RoleId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public List<UserPermissionRequestDto> Permissions { get; set; } = new();
    }
}
