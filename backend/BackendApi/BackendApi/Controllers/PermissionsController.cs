using BackendApi.Models;
using BackendApi.Models.Domain;
using BackendApi.Models.DTO;
using BackendApi.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionsController : ControllerBase
    {
        private readonly IPermissionsRepository _permissionsRepository;
        public PermissionsController(IPermissionsRepository permissionsRepository)
        {
            _permissionsRepository = permissionsRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPermissions()
        {
            var permissions = await _permissionsRepository.GetAllAsync();
            // Map domain models to DTOs
            var permissionDtos = new List<PermissionDto>();
            foreach (var permission in permissions)
            {
                permissionDtos.Add(new PermissionDto
                {
                    PermissionId = permission.Id,
                    PermissionName = permission.Name,
                });
            }
            var response = new ApiResponse<List<PermissionDto>>
            {
                Status = new StatusInfo { Code = "200", Description = "Roles retrieved successfully" },
                Data = permissionDtos
            };
            return Ok(response);
        }
    }
}
