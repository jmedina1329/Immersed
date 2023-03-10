USE [Immersed]
GO
/****** Object:  StoredProcedure [dbo].[Blogs_Select_ByAuthorId]    Script Date: 12/26/2022 13:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 --=============================================
 --Author: <Medina, Joe>
 --Create date: <2022-10-26>
 --Description: <Select by AuthorId for Blogs>
 --Code Reviewer:
 

 --MODIFIED BY: <Author>
 --MODIFIED DATE: <2022-10-26>
 --Code Reviewer: 
 --Note: 
 --=============================================
ALTER proc [dbo].[Blogs_Select_ByAuthorId]
	@AuthorId int
	,@PageIndex int
	,@PageSize int
	,@IsApproved bit
	,@IsPublished bit
	,@IsDeleted bit

AS

/*

DECLARE @AuthorId int = 8
		,@PageIndex int = 0
		,@PageSize int = 10
		,@IsApproved bit = 1
		,@IsPublished bit = 1
		,@IsDeleted bit = 0

EXECUTE	dbo.Blogs_Select_ByAuthorId
	@AuthorId
	,@PageIndex
	,@PageSize
	,@IsApproved
	,@IsPublished
	,@IsDeleted

*/

BEGIN

	DECLARE @Offset int = @PageIndex * @PageSize

	SELECT 
		b.[Id]
		,bt.Name AS BlogType
		,u.FirstName AS AuthorFirstName
		,u.Mi AS AuthorMi
		,u.LastName AS AuthorLastName
		,u.AvatarUrl AS AuthorAvatarUrl
		,b.[Title]
		,b.[Subject]
		,b.[Content]
		,b.[ImageUrl]
		,b.[isApproved]
		,u2.FirstName AS ApproverFirstName
		,u2.Mi AS ApproverMi
		,u2.LastName AS ApproverLastName
		,u2.AvatarUrl AS ApproverAvatarUrl
		,b.[IsPublished]
		,b.[DatePublished]
		,b.[DateCreated]
		,b.[DateModified]
		,TotalCount = COUNT(1) OVER ()
	FROM	[dbo].[Blogs] as b
			INNER JOIN dbo.BlogTypes as bt
				ON b.BlogTypeId = bt.Id
			INNER JOIN dbo.Users as u
				ON b.AuthorId = u.Id
			LEFT JOIN dbo.Users as u2
				ON b.ApprovedBy = u2.Id
	WHERE	u.Id = @AuthorId
			AND	b.IsApproved = @IsApproved
			AND b.IsPublished = @IsPublished
			AND b.IsDeleted = @IsDeleted
	ORDER BY b.Id desc
	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

END
