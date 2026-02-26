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
            // Preventing duplicate user creation based on ID
            if (await _userRepository.UserExistsAsync(request.Id))
            {
                var errorResponse = new ApiResponse<UserResponseDto>
                {
                    Status = new StatusInfo
                    {
                        Code = "409",
                        Description = $"A user with the ID '{request.Id}' already exists."
                    },
                    Data = null
                };

                return Conflict(errorResponse);
            }

            // Mapping DTO to Domain Model
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

            // Create the user and associated permissions in the database
            var createdUser = await _userRepository.CreateUserAsync(userDomain, permissionsDomain);
            var userWithNames = await _userRepository.GetUserByIdAsync(createdUser.Id);

            // Mapping Domain Model back to Response DTO
            var responseDto = new UserResponseDto
            {
                Id = userWithNames.Id,
                FirstName = userWithNames.FirstName,
                LastName = userWithNames.LastName,
                Email = userWithNames.Email,
                Phone = userWithNames.Phone,
                RoleId = userWithNames.RoleId,
                UserName = userWithNames.UserName,
                Password = userWithNames.Password,

                Permissions = userWithNames.Permissions.Select(p => new PermissionDto
                {
                    PermissionId = p.PermissionId,
                    PermissionName = p.Permission?.Name ?? "Unknown"
                }).ToList()
            };

            var response = new ApiResponse<UserResponseDto>
            {
                Status = new StatusInfo { Code = "201", Description = "User created successfully" },
                Data = responseDto
            };

            return CreatedAtAction(nameof(CreateUser), new { id = createdUser.Id }, response);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new ApiResponse<UserResponseDto>
                {
                    Status = new StatusInfo { Code = "404", Description = "User not found" }
                });
            }

            // Map Domain -> DTO
            var responseDto = new UserResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                RoleId = user.RoleId,
                UserName = user.UserName,
                Password = user.Password,
                Permissions = user.Permissions.Select(up => new PermissionDto
                {
                    PermissionId = up.PermissionId,
                    PermissionName = up.Permission?.Name ?? "Unknown"
                }).ToList()
            };

            return Ok(new ApiResponse<UserResponseDto> { Data = responseDto });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var isDeleted = await _userRepository.DeleteUserAsync(id);

            if (!isDeleted)
            {
                var errorResponse = new ApiResponse<string>
                {
                    Status = new StatusInfo { Code = "404", Description = $"User with ID '{id}' was not found." },
                    Data = null
                };
                return NotFound(errorResponse);
            }

            var successResponse = new ApiResponse<string>
            {
                Status = new StatusInfo { Code = "200", Description = $"User with ID '{id}' was successfully deleted." },
                Data = id
            };

            return Ok(successResponse);
        }
    }
}
