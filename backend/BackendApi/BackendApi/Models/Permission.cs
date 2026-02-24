namespace BackendApi.Models
{
    public class Permission
    {
        public string Id { get; set; } = null!;
        public string PermissionId { get; set; } = null!;
        public bool IsReadable { get; set; }
        public bool IsWritable { get; set; }
        public bool IsDeletable { get; set; }
        public string UserId { get; set; } = null!; //Foreign key to User

    }
}
