namespace BackendApi.Models
{
    public class ApiResponse<T>
    {
        public StatusInfo Status { get; set; } = new();
        public T? Data { get; set; }
    }

    public class StatusInfo
    {
        public string Code { get; set; } = "200";
        public string Description { get; set; } = "Success";
    }
}