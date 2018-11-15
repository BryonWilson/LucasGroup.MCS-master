using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LucasGroup.MCS.Data;
using LucasGroup.MCS.Models;
using LucasGroup.MCS.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace LucasGroup.MCS.Controllers
{
    [Authorize("Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private ApplicationDbContext _dbContext;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JwtSignInHandler _jwtHandler;

        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ApplicationDbContext dbContext,
            JwtSignInHandler jwtTokenHandler,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _jwtHandler = jwtTokenHandler;
            _dbContext = dbContext;
            _logger = loggerFactory.CreateLogger<AuthController>();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<object> Login(LoginDto model)
        {
            _logger.LogInformation($"Login requested: {model.Email}, {model.Password}");
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (result.Succeeded)
            {

                var appUser = _userManager.Users.Include(u => u.UserSettings).ThenInclude(b => b.Branch).SingleOrDefault(r => r.Email == model.Email);
                var user = new
                {
                    username = appUser.UserName,
                    firstName = appUser.UserSettings.FirstName,
                    lastName = appUser.UserSettings.LastName,
                    branchId = appUser.UserSettings.Branch.Id,
                    bullhornUserId = appUser.UserSettings.BullhornUserId,
                    roles = new List<string>()
                };
                var token = await _jwtHandler.GenerateJwtToken(model.Email, appUser, await _userManager.GetRolesAsync(appUser));

                var userRoles = _userManager.GetRolesAsync(appUser).Result;
                user.roles.AddRange(userRoles);

                var loginResponse = new
                {
                    user,
                    token
                };
                return loginResponse;
            }

            throw new ApplicationException("INVALID_LOGIN_ATTEMPT");
        }


        //[AllowAnonymous]
        [HttpPost("register")]
        public async Task<object> Register(RegisterDto model)
        {
            var userBranch = _dbContext.Find<Branch>(model.BranchId);
            var appUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                UserSettings = new UserSettings
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Branch = userBranch,
                    BullhornUserId = model.BullhornUserId,
                    BullhornUsername = model.BullhornUsername
                }
            };
            var result = await _userManager.CreateAsync(appUser, model.Password);

            if (result.Succeeded)
            {
                // Add user to role
                await _userManager.AddToRoleAsync(appUser, _roleManager.FindByIdAsync(model.RoleName).Result.Name);

                await _signInManager.SignInAsync(appUser, false);

                // Generate Login Response
                var appUserRegister = _userManager.Users.Include(u => u.UserSettings).ThenInclude(b => b.Branch).SingleOrDefault(r => r.Email == model.Email);
                var user = new
                {
                    username = appUserRegister.UserName,
                    firstName = appUserRegister.UserSettings.FirstName,
                    lastName = appUserRegister.UserSettings.LastName,
                    branchId = appUserRegister.UserSettings.Branch.Id,
                    bullhornUserId = appUserRegister.UserSettings.BullhornUserId
                };
                var token = await _jwtHandler.GenerateJwtToken(model.Email, appUserRegister, await _userManager.GetRolesAsync(appUserRegister));
                var loginResponse = new
                {
                    user,
                    token
                };
                return loginResponse;
            }

            var errList = "";
            foreach (var err in result.Errors) {
                errList = $"{errList}, {err.Description}";
            }

            throw new ApplicationException(errList);
        }

        [HttpGet("roles")]
        public async Task<object> GetRoles()
        {
            return await Task.FromResult(_roleManager.Roles.Select(r => new RoleDto
            {
                RoleId = r.Id,
                RoleName = r.Name
            }));
        }

        [AllowAnonymous]
        [HttpPost("resetPassword")]
        public async Task<object> ResetPassword(ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            return _userManager.ResetPasswordAsync(user, model.Code, model.Password).Result.Succeeded;
        }

        [AllowAnonymous]
        [HttpPost("resetEmail")]
        public async Task<object> ResetEmail(ResetEmailDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if(user != null)
            {
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                var encoded = WebUtility.UrlEncode(code);
                // JwtToken token = await _jwtHandler.GenerateJwtToken(model.Email, user, await _userManager.GetRolesAsync(user));
                var url = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/#/forgot/{encoded}";
                var resetEmailBody =
                    "<p>You have requested that your LucasGroup password be reset</p>" +
                    "<p>To set your new password click <a href='" + url + "'>here.</a></p>";
                return SendEmail("support@lucasgroup.com", user.Email, "LucasGroup Password Reset", resetEmailBody);
            }

            return null;
        }

        private EmailResponse SendEmail(string fromEmail, string toEmail, string subject, string htmlBody)
        {
            var client = new SendGridClient("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");

            var message = new SendGridMessage();
            message.AddTo(new EmailAddress() { Email = toEmail });
            message.From = new EmailAddress() { Email = fromEmail };
            message.Subject = subject;
            message.HtmlContent = htmlBody;

            var response = new EmailResponse
            {
                StatusCode = client.SendEmailAsync(message).Result.StatusCode
            };
            return response;
        }

    }
}