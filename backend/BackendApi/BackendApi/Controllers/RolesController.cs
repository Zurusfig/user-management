using BackendApi.Data;
using BackendApi.Models;
using BackendApi.Models.DTO;
using BackendApi.Repositories.Implementation;
using BackendApi.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleRepository _roleRepository;
        public RolesController(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        // GET: /api/roles
        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleRepository.GetAllAsync();

            // Map domain models to DTOs
            var roleDtos = new List<RoleDto>();
            foreach (var role in roles)
            {
                roleDtos.Add(new RoleDto
                {
                    RoleId = role.Id,
                    RoleName = role.Name
                });
            }

            var response = new ApiResponse<List<RoleDto>>
            {
                Status = new StatusInfo { Code = "200", Description = "Roles retrieved successfully" },
                Data = roleDtos
            };

            return Ok(response);
        }
    }
}
