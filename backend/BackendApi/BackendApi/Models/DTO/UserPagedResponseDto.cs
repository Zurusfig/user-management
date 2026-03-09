namespace BackendApi.Models.DTO
{
    public class UserPagedResponseDto
    {
        public List<UserListItemDto> DataSource { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    }
    public class UserListItemDto
    {
        public string UserId { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!; 
        public string Email { get; set; } = null!;
        public RoleDto Role { get; set; } = null!;
        public string Username { get; set; } = null!;
        public List<PermissionDto> Permissions { get; set; } = new();
        public string CreatedDate { get; set; } = null!;
    }
}
