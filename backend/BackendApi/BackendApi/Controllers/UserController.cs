using Azure.Core;
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
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser(UserCreateRequestDto request)
        {
            var userDomain = new User
            {
                Id = request.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                RoleId = request.RoleId,
                UserName = request.UserName,
                Password = request.Password
            };

            var permissionsDomain = new List<UserPermission>();
            foreach (var permDto in request.Permissions)
            {
                permissionsDomain.Add(new UserPermission
                {
                    PermissionId = permDto.PermissionId,
                    IsReadable = permDto.IsReadable,
                    IsWritable = permDto.IsWritable,
                    IsDeletable = permDto.IsDeletable,
                    UserId = request.Id
                });
            }

            var createdUser = await _userRepository.CreateUserAsync(userDomain, permissionsDomain);

            var responseDto = new UserResponseDto
            {
                Id = createdUser.Id,
                FirstName = createdUser.FirstName,
                LastName = createdUser.LastName,
                Email = createdUser.Email,
                Phone = createdUser.Phone,
                RoleId = createdUser.RoleId,
                UserName = createdUser.UserName,
                Password = createdUser.Password,

                Permissions = createdUser.Permissions.Select(p => new PermissionDto
                {
                    PermissionId = p.PermissionId,
                    PermissionName = "Name fetched on GET" // Placeholder until we write the GET method
                }).ToList()
            };

            var response = new ApiResponse<UserResponseDto>
            {
                Status = new StatusInfo { Code = "201", Description = "User created successfully" },
                Data = responseDto
            };

            return CreatedAtAction(nameof(CreateUser), new { id = createdUser.Id }, response);
        }
    }
}
