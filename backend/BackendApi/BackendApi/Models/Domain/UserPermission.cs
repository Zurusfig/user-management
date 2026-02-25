namespace BackendApi.Models.Domain
{
    public class UserPermission
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public bool IsReadable { get; set; }
        public bool IsWritable { get; set; }
        public bool IsDeletable { get; set; }
        public string UserId { get; set; } = null!; //Foreign key to User
        public string PermissionId { get; set; } = null!; //Foreign key to Permission
    }
}
