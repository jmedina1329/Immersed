public class WebAuthenticationService
{
    /*
    ======
    Most code is removed, only Claims I worked on are included.
    ======
    */

    public async Task LogInAsync(IUserAuthData user, params Claim[] extraClaims)
    {
        ClaimsIdentity identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme
                                                        , ClaimsIdentity.DefaultNameClaimType
                                                        , ClaimsIdentity.DefaultRoleClaimType);

        identity.AddClaim(new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider"
                            , _title
                            , ClaimValueTypes.String));

        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(), ClaimValueTypes.String));

        identity.AddClaim(new Claim(ClaimsIdentity.DefaultNameClaimType, user.Name, ClaimValueTypes.String));

        if (user.Roles != null && user.Roles.Any())
        {
            foreach (string singleRole in user.Roles)
            {
                identity.AddClaim(new Claim(ClaimsIdentity.DefaultRoleClaimType, singleRole, ClaimValueTypes.String));
            }
        }
        if (user.Organizations != null && user.Organizations.Any())
        {
            foreach (int org in user.Organizations)
            {
                identity.AddClaim(new Claim("Orgs", org.ToString(), ClaimValueTypes.String));
            }
        }
        if (user.Trainees != null && user.Trainees.Any())
        {
            foreach (int trainee in user.Trainees)
            {
                identity.AddClaim(new Claim("Trainees", trainee.ToString(), ClaimValueTypes.String));
            }
        }
        identity.AddClaim(new Claim("CurrentOrg", user.CurrentOrgId.ToString(),ClaimValueTypes.String));

        identity.AddClaim(new Claim("CurrentTrainee", user.CurrentTraineeId.ToString(), ClaimValueTypes.String));

        identity.AddTenantId(user.TenantId);

        identity.AddClaims(extraClaims);

        AuthenticationProperties props = new AuthenticationProperties
        {
            IsPersistent = true,
            IssuedUtc = DateTime.UtcNow,
            ExpiresUtc = DateTime.UtcNow.AddDays(60),
            AllowRefresh = true
        };

        ClaimsPrincipal principal = new ClaimsPrincipal(identity);

        await _contextAccessor.HttpContext
            .SignInAsync(AuthenticationDefaults.AuthenticationScheme, principal, props);
    }
}
