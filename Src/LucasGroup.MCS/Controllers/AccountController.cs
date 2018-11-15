using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LucasGroup.MCS.Data;
using LucasGroup.MCS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LucasGroup.MCS.Controllers
{
    [Authorize("Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private UserManager<ApplicationUser> _userManager;

        private ApplicationDbContext _dbContext;
        public AccountController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext){
            _userManager = userManager;
            _dbContext = dbContext;
        }

        [HttpGet("users")]
        public Task<IQueryable<UserDto>> GetUsers()
        {
            var users = _userManager.Users.Select(u => new UserDto
            {
                Email = u.Email,
                FirstName = u.UserSettings.FirstName,
                LastName = u.UserSettings.LastName,
                BullhornUserId = u.UserSettings.BullhornUserId,
                BullhornUsername = u.UserSettings.BullhornUsername,
                BranchId = u.UserSettings.Branch.Id,
                Roles = new List<string>()
            });

            return Task.FromResult(users);
        }

        [HttpPut("user")]
        public async Task UpdateUser(ApplicationUser user){
            await _userManager.UpdateAsync(user);
        }

        [HttpGet("settings")]
        public async Task<JsonResult> GetSettings(string userEmail = null)
        {
            var user = string.IsNullOrEmpty(userEmail) ? await _userManager.GetUserAsync(User) : await _userManager.FindByEmailAsync(userEmail);
            var userSettings =  _dbContext.Users.Include(u => u.UserSettings).ThenInclude(b => b.Branch).FirstOrDefault(u => u.Id == user.Id)?.UserSettings;

            var myUser = new UserDto
            {
                Email = user.Email,
                FirstName = userSettings.FirstName,
                LastName = userSettings.LastName,
                BullhornUserId = userSettings.BullhornUserId,
                BullhornUsername = userSettings.BullhornUsername,
                BranchId = userSettings.Branch.Id
            };
            return Json(myUser);
        }

        [HttpPut("settings")]
        public async Task UpdateSettings(SettingsDTO settings, string userEmail = null)
        {
            if (settings == null)
            {
                throw new ArgumentNullException(nameof(settings));
            }

            var user = await _userManager.FindByEmailAsync(userEmail ?? settings.Email);
            var userSettings =  _dbContext.Users.Include(u => u.UserSettings).ThenInclude(b => b.Branch).AsNoTracking().FirstOrDefault(u => u.Id == user.Id)?.UserSettings;
            var newSettings = new UserSettings{
                Id = userSettings.Id,
                Branch = await _dbContext.FindAsync<Branch>(settings.BranchId),
                BullhornUserId = settings.BullhornUserId,
                BullhornUsername = settings.BullhornUsername,
                FirstName = settings.FirstName,
                LastName = settings.LastName
            };
            _dbContext.Update<UserSettings>(newSettings);
            _dbContext.SaveChanges();

        }

        [HttpGet("branches")]
        public async Task<IEnumerable<Branch>> GetBranches()
        {
            return await _dbContext.Branches.ToListAsync();
        }

    }
}

