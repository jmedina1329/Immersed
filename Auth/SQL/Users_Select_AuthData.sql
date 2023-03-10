USE [Immersed]
GO
/****** Object:  StoredProcedure [dbo].[Users_Select_AuthDataV2]    Script Date: 12/26/2022 13:56:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Andrew Hoang>
-- Create date: <10/20/2022>
-- Description: <Selects User by Email and associated UserRoles. This data will be put inside Auth Cookie.>
-- Code Reviewer: Pablo Alberto Pantaleo Demaldé

-- MODIFIED BY: <Joe Medina>
-- MODIFIED DATE: mm/dd/yyyy
-- Code Reviewer:
-- Note:
-- =============================================

ALTER PROC [dbo].[Users_Select_AuthDataV2]
	@Email nvarchar(255)
AS

/*

	DECLARE @Email nvarchar(255) = 'immersedsysadmin@dispostable.com'

	EXECUTE dbo.Users_Select_AuthDataV2 @Email

*/

BEGIN

	SELECT	u.Id
			,u.[Email]
			,u.[Password]
			,Organizations =
				(
				SELECT DISTINCT
						o.Id
						,Roles =
							(
							SELECT	r.Name
							FROM	dbo.Roles as r
									INNER JOIN dbo.UserOrgRoles as uor
										ON r.Id = uor.RoleId
							WHERE	UserId = u.Id
									AND o.Id = uor.OrgId
							FOR JSON AUTO
							)
				FROM	dbo.Organizations as o
						INNER JOIN dbo.UserOrgRoles as uor
							ON o.Id = uor.OrgId
				WHERE	UserId = u.Id
				FOR JSON AUTO
				)
	FROM	[dbo].[Users] as u
	WHERE	u.Email = @Email

END


