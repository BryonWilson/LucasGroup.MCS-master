using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Web;

using LucasGroup.MCS.Data;
using Microsoft.AspNetCore.Identity;
using LucasGroup.MCS.Models;

namespace LucasGroup.MCS
{
    public class Program
    {
        private static readonly Dictionary<string, string> defaults = new Dictionary<string, string> {
                                                                            { WebHostDefaults.EnvironmentKey, "Production" }
                                                                        };
        private static IConfiguration config;
        public static void Main(string[] args)
        {
            var logger = NLogBuilder.ConfigureNLog("nlog.config").GetCurrentClassLogger();
            try
            {
                config = new ConfigurationBuilder()
                    .AddInMemoryCollection(defaults)
                    .AddEnvironmentVariables("ASPNETCORE_")
                    .AddCommandLine(args)
                    .Build();
                var host = BuildWebHost();

                using (var scope = host.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;
                    try
                    {
                        logger.Info(config.ToString());
                        var dbContext = services.GetService<ApplicationDbContext>();
                        dbContext.Database.Migrate();
                        // Seed Roles and Admin User
                        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
                        IdentityInitializer.SeedData(userManager, roleManager, dbContext);

                    }
                    catch (Exception ex)
                    {
                        logger.Error(ex, "An error occurred validating DB creation.");
                    }
                }

                host.Run();
            }
            catch(Exception ex)
            {
                logger.Error(ex, "Stopped program because of exception");
                throw;
            }
            finally
            {
                LogManager.Shutdown();
            }
        }

        public static IWebHost BuildWebHost() =>
            WebHost.CreateDefaultBuilder()
                .UseConfiguration(config)
                /*Following setting already accounted for in CreateDefaultBuilder() : https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.webhost.createdefaultbuilder?view=aspnetcore-2.0 */
                // .UseContentRoot(Directory.GetCurrentDirectory())
                .ConfigureLogging(logging =>{
                    logging.ClearProviders();
                })
                .UseNLog()
                .UseStartup<Startup>()
                .Build();
    }
}
