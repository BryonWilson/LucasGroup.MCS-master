
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LucasGroup.MCS.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LucasGroup.MCS.Models
{

    // Utility Class for typing anonymous object produced by GenerateJwtToken() in JwtSignInHandler.cs
    public class JwtToken
    {
        public string accessToken { get; set; }
        public string bearerType { get; set; }
        public DateTime expiresOn { get; set; }
    }

    #region DTOs
    public class LoginDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

    }

    public class ResetEmailDto
    {
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Code { get; set; }
    }

    public class RoleDto
    {
        public string RoleId { get; set; }
        public string RoleName { get; set; }
    }

    public class RegisterDto : SettingsDTO
    {
        [Required]
        [StringLength(100, ErrorMessage = "PASSWORD_MIN_LENGTH", MinimumLength = 6)]
        public string Password { get; set; }
        public string RoleName { get; set; }
    }

    public class UserDto : RegisterDto
    {
        public List<string> Roles { get; set; }
    }

    public class SettingsDTO
    {
        [Required]
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int BranchId { get; set; }
        public string BullhornUsername { get; set; }
        public int BullhornUserId { get; set; }
    }
    #endregion

    #region Entities
    public class ApplicationUser : IdentityUser
    {
        public virtual UserSettings UserSettings {get; set;}

    }

    public class UserSettings
    {

        [Key]
        public int Id {get; set;}
        public string BullhornUsername {get; set;}
        public int BullhornUserId {get;set;}
        public string FirstName {get; set;}
        public string LastName {get; set;}
        public Branch Branch {get; set;}
    }
    #endregion

    #region IdentityInitializer for Seed
    public static class IdentityInitializer
    {
        public static void SeedData(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext dbContext)
        {
            SeedRoles(roleManager);
            SeedUsers(userManager, dbContext);
        }

        public static void SeedUsers(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            if (userManager.FindByEmailAsync("lucasadmin@lucasgroup.com").Result == null)
            {
                var branch = dbContext.Find<Branch>(1);
                ApplicationUser user = new ApplicationUser
                {
                    UserName = "lucasadmin@lucasgroup.com",
                    Email = "lucasadmin@lucasgroup.com",
                    UserSettings = new UserSettings
                    {
                        FirstName = "John",
                        LastName = "Carter",
                        BullhornUserId = 1418,
                        BullhornUsername = "",
                        Branch = branch
                    }
                };
                var result = userManager.CreateAsync(user, "Test#123").Result;
                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, "Admin").Wait();
                }
            }
        }

        public static void SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.RoleExistsAsync("Admin").Result)
            {
                IdentityRole admin = new IdentityRole
                {
                    Name = "Admin",
                };

                var result = roleManager.CreateAsync(admin).Result;
            }

            if (!roleManager.RoleExistsAsync("User").Result)
            {
                IdentityRole user = new IdentityRole
                {
                    Name = "User",
                };

                var result = roleManager.CreateAsync(user).Result;
            }
        }
    }
    #endregion

}
