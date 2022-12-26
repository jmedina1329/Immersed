public class UserService : IUserService, IMapUser
{
    private IAuthenticationService<int> _authenticationService;
    private IDataProvider _dataProvider;

    public UserService(IAuthenticationService<int> authService, IDataProvider dataProvider)
    {
        _authenticationService = authService;
        _dataProvider = dataProvider;
    }

    public async Task<bool> LogInAsync(string email, string password)
    {
        bool isSuccessful = false;

        IUserAuthData response = GetCurrent(email, password);

        if (response != null)
        {
            await _authenticationService.LogInAsync(response);
            isSuccessful = true;
        }

        return isSuccessful;
    }

    public int Create(UserAddRequest model, int statusTypeId)
    {
        int userId = 0;
        string password = model.Password;
        string salt = BCrypt.BCryptHelper.GenerateSalt();
        string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);
        string procName = "[dbo].[Users_Insert]";

        _dataProvider.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, hashedPassword);
                col.AddWithValue("@statusTypeId", statusTypeId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
        returnParameters: delegate (SqlParameterCollection returnCollection)
        {
            object oId = returnCollection["@Id"].Value;
            int.TryParse(oId.ToString(), out userId);
        }
        );

        return userId;
    }
    public int CreateInvitedMember(UserAddRequest model, int statusTypeId)
    {
        int userId = 0;
        string password = model.Password;
        string salt = BCrypt.BCryptHelper.GenerateSalt();
        string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);
        string procName = "[dbo].[Users_Insert_InvitedMember]";

        _dataProvider.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, hashedPassword);
                col.AddWithValue("@statusTypeId", statusTypeId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
        returnParameters: delegate (SqlParameterCollection returnCollection)
        {
            object oId = returnCollection["@Id"].Value;
            int.TryParse(oId.ToString(), out userId);
        }
        );

        return userId;
    }

    public IUserAuthData GetCurrent(string email, string password)
    {
        string procName = "[dbo].[Users_Select_AuthDataV3]";
        UserBase user = null;
        AuthUser authUser = null;
        List<AuthOrganization> orgsWithRoles = null;
        List<Trainee> trainees = null;

        _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
        {
            col.AddWithValue("@Email", email);
        }, singleRecordMapper: delegate (IDataReader reader, short set)
        {

            int i = 0;

            authUser = new AuthUser();
            user = new UserBase();

            authUser.Id = reader.GetSafeInt32(i++);
            authUser.Email = reader.GetSafeString(i++);
            authUser.Password = reader.GetSafeString(i++);

            string orgsAsString = reader.GetSafeString(i++);

            if (!string.IsNullOrEmpty(orgsAsString))
            {
                orgsWithRoles = JsonConvert.DeserializeObject<List<AuthOrganization>>(orgsAsString);
            }

            trainees = reader.DeserializeObject<List<Trainee>>(i++);

            authUser.Organizations = GetOrganizations(orgsWithRoles);
            authUser.CurrentOrg = authUser.Organizations[0];
            authUser.Roles = GetRoles(orgsWithRoles);
            authUser.Trainees = GetTrainees(trainees);
            authUser.CurrentTrainee = authUser.Trainees[0];

        }
        );
        bool isValidCredentials = BCrypt.BCryptHelper.CheckPassword(password, authUser.Password);

        if (isValidCredentials)
        {
            user.Id = authUser.Id;
            user.Name = authUser.Email;
            user.TenantId = "Immersed";
            user.Organizations = authUser.Organizations;
            user.CurrentOrgId = authUser.CurrentOrg;
            user.Roles = authUser.Roles;
            user.Trainees = authUser.Trainees;
            user.CurrentTraineeId = authUser.CurrentTrainee;
        }

        return user;
    }

    public void AddUserOrgAndRole(int userId, int roleId, int orgId)
    {
        string procName = "[dbo].[UserOrgRoles_Insert]";

        _dataProvider.ExecuteNonQuery(procName
            , inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@RoleId", roleId);
                col.AddWithValue("@OrgId", orgId);
            }
            );
    }

    public async Task<bool> ChangeCurrentOrg(IUserAuthData currentUser, int orgId)
    {
        string procName = "dbo.UserOrgRoles_GetRolesByUserIdAndOrgId";
        UserBase user = null;
        List<string> roles = null;
        bool isSuccessful = false;

        _dataProvider.ExecuteCmd(
            procName,
            inputParamMapper: delegate (SqlParameterCollection coll)
            {
                coll.AddWithValue("@UserId", currentUser.Id);
                coll.AddWithValue("@OrgId", orgId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int i = 0;
                string role = reader.GetSafeString(i);
                if (roles == null)
                {
                    roles = new List<string>();
                }
                roles.Add(role);
            });
        if (user == null)
        {
            user = new UserBase();
            user.Id = currentUser.Id;
            user.Name = currentUser.Name;
            user.TenantId = currentUser.TenantId;
            user.Organizations = currentUser.Organizations;
            user.CurrentOrgId = orgId;
            user.Roles = roles;
        }
        if (user != null)
        {
            await _authenticationService.LogInAsync(user);
            isSuccessful = true;
        }
        return isSuccessful;
    }

    public BaseUser MapSingleUser(IDataReader reader, ref int startingIndex)
    {
        BaseUser aUser = new BaseUser();

        aUser.Id = reader.GetSafeInt32(startingIndex++);
        aUser.Email = reader.GetSafeString(startingIndex++);
        aUser.FirstName = reader.GetSafeString(startingIndex++);
        aUser.LastName = reader.GetSafeString(startingIndex++);
        aUser.Mi = reader.GetSafeString(startingIndex++);
        aUser.AvatarUrl = reader.GetSafeString(startingIndex++);

        return aUser;
    }

    private static void AddCommonParams(UserAddRequest model, SqlParameterCollection col, string password)
    {
        col.AddWithValue("@Email", model.Email);
        col.AddWithValue("@FirstName", model.FirstName == null ? DBNull.Value : model.FirstName);
        col.AddWithValue("@LastName", model.LastName == null ? DBNull.Value : model.LastName);
        col.AddWithValue("@Mi", model.Mi == null ? DBNull.Value : model.Mi);
        col.AddWithValue("@AvatarUrl", model.AvatarUrl == null ? DBNull.Value : model.AvatarUrl);
        col.AddWithValue("@Password", password);
    }

    private static List<int> GetOrganizations(List<AuthOrganization> orgsWithRoles)
    {
        List<int> orgs = new List<int>();

        foreach (AuthOrganization org in orgsWithRoles)
        {
            orgs.Add(org.Id);
        }
        return orgs;
    }

    private static List<int> GetTrainees(List<Trainee> traineeList)
    {
        List<int> traineeId = new List<int>();

        foreach(Trainee trainee in traineeList)
        {
            traineeId.Add(trainee.Id);
        }
        return traineeId;
    }

    private static List<string> GetRoles(List<AuthOrganization> orgsWithRoles)
    {
        List<string> roles = new List<string>();

        foreach (AuthRole role in orgsWithRoles.First().Roles)
        {
            roles.Add(role.Name);
        }
        return roles;
    }
}

