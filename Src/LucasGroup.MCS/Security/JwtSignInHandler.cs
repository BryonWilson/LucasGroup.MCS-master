

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LucasGroup.MCS.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace LucasGroup.MCS.Security
{
    public class JwtSignInHandler
    {
        private readonly TokenAuthOptions _tokenOptions;
        // private readonly ILogger<JwtSignInHandler> _logger;
        public JwtSignInHandler(TokenAuthOptions options)
        {
            _tokenOptions = options;
            // _logger = loggerFactory.CreateLogger<JwtSignInHandler>();

            // _logger.LogInformation("Token key", _tokenOptions?.SymmetricKey.ToString());
        }

        internal async Task<JwtToken> GenerateJwtToken(string email, ApplicationUser user, IList<string> roles)
        {

            try{
            return await Task.Run(() =>
            {
                var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
            };

            foreach(var _role in roles){
                claims.Add( new Claim(ClaimTypes.Role, _role));
            }

                var key = _tokenOptions.SymmetricKey;
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.Now.AddDays(Convert.ToDouble(_tokenOptions.Expiry));

                var token = new JwtSecurityToken(
                    _tokenOptions.Issuer,
                    _tokenOptions.Audience,
                    claims,
                    expires: expires,
                    signingCredentials: creds
                );

                return new JwtToken { accessToken = new JwtSecurityTokenHandler().WriteToken(token), bearerType = "token_bearer", expiresOn = expires };
            });

            }
            catch(AggregateException aex){
                aex.Handle(e => {
                    // _logger.LogError(e, e.Message);
                    return true;
                });
            }

            return null;
        }
    }
}