namespace BackendApi.Models.DTO
{
    public class UserPermissionRequestDto
    {
        public string PermissionId { get; set; } = null!;
        public bool IsReadable { get; set; }
        public bool IsWritable { get; set; }
        public bool IsDeletable { get; set; }
    }
}
