using Microsoft.IdentityModel.Tokens;

namespace LucasGroup.MCS.Security
{
    public class TokenAuthOptions
    {
        public string Issuer {get; set;}
        public string Audience {get; set;}
        public string Expiry {get; set;}

        public SymmetricSecurityKey SymmetricKey {get; set;}
    }
}