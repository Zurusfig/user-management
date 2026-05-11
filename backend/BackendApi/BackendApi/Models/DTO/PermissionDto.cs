namespace BackendApi.Models.DTO
{
    public class PermissionDto
    {
        public string PermissionId { get; set; } = null!;
        public string PermissionName { get; set; } = null!;
        public bool IsReadable { get; set; } 
        public bool IsWritable { get; set; }
        public bool IsDeletable { get; set; }
    }
}
