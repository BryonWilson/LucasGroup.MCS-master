using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;

using LucasGroup.MCS.Data;
using LucasGroup.MCS.Models;
using LucasGroup.MCS.Interfaces;
using LucasGroup.MCS.Extensions;
using Microsoft.AspNetCore.Authorization;
using LucasGroup.MCS.Security;

namespace LucasGroup.MCS
{
    public class Startup
    {

        private readonly IHostingEnvironment _hostingEnv;
        private ILogger<Startup> _logger;

        public Startup(IHostingEnvironment env)
        {
            _hostingEnv = env;
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // ===== Add our DbContext ========
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("Default")));

            // ===== Add Identity ========
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // ===== Add Jwt Authentication ========
            var _symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtKey"]));
            services.Configure<TokenAuthOptions>(_ => new TokenAuthOptions
            {
                SymmetricKey = _symmetricKey,
                Issuer = Configuration["JwtIssuer"],
                Audience = Configuration["JwtIssuer"],
                Expiry = Configuration["JwtExpireDays"]
            });
            services.AddTransient<JwtSignInHandler>(_ => new JwtSignInHandler(new TokenAuthOptions
            {
                SymmetricKey = _symmetricKey,
                Issuer = Configuration["JwtIssuer"],
                Audience = Configuration["JwtIssuer"],
                Expiry = Configuration["JwtExpireDays"]
            }));
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

                })
                .AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = Configuration["JwtIssuer"],
                        ValidAudience = Configuration["JwtIssuer"],
                        IssuerSigningKey = _symmetricKey,
                        ClockSkew = TimeSpan.Zero // remove delay of token when expire
                    };
                });

            // ===== Add Authorization ======
            services.AddAuthorization(auth =>
            {
                auth.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
                    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser().Build());
                auth.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                auth.AddPolicy("RequireUserRole", policy => policy.RequireRole("User"));

            });
            // ===== Add Bullhorn API Interface setup =====
            services.Configure<BullhornApiSettings>(Configuration.GetSection("BullhornApiSettings"));
            services.AddSingleton<BullhornApiInterface>();
            // services.AddAntiforgery(options => options.Cookie.Name = options.HeaderName = "X-XSRF-TOKEN");
            // ===== Add Https Redirection, Hsts, and SPA setup =====

            services.AddHsts(options => {
                options.MaxAge = TimeSpan.FromDays(100);
                options.IncludeSubDomains = true;
                options.Preload = true;
            });
            services.AddHttpsRedirection(options => options.HttpsPort = 443);

            services.AddSpaStaticFiles(config =>
            {
                config.RootPath = "wwwroot/dist";
            });
            // ===== Configure CORS =====
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder
                            .AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });
            services.AddMvc();
            services.AddLogging();
            // ===== Add Swagger =====
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "MCS API",
                    Description = "MCS Web API"
                });
                // c.IncludeXmlComments(GetXmlCommentsPath());
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));

            if (env.IsDevelopment())
            {

                loggerFactory.AddDebug();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MCS API V1");
                });

                // Starts "npm start" command using Shell extension.
                app.Shell("npm start", "wwwroot");
            }
            if(env.IsProduction()){
                app.UseHsts();
                app.UseHttpsRedirection();
            }
            // else
            // {
            //     app.UseHsts();
            // }
            _logger = loggerFactory.CreateLogger<Startup>();
            _logger.LogInformation("Logging enabled from StartUp");
            // app.UseMvc(routes =>
            // {
            //     routes.MapRoute("DefaultApi", "api/{controller}/{id?}");
            // });
            // app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseCors("AllowAllOrigins");
            app.UseMvc();
            app.UseSpaStaticFiles();
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "wwwroot";
                spa.Options.StartupTimeout = new TimeSpan(0, 3, 30);
                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
            if (!env.IsDevelopment())
            {
                app.Use(async (context, next) =>
                {

                    await next();
                    //TODO: Include filter for /api calls
                    if (context.Response.StatusCode == 404
                        && !Path.HasExtension(context.Request.Path.Value)
                        && !context.Request.Path.Value.Contains("/api/"))
                    {
                        context.Request.Path = "/index.html";
                        await next();
                    }
                });
            }


        }
    }
}
