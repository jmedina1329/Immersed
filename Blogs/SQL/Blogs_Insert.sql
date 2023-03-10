USE [Immersed]
GO
/****** Object:  StoredProcedure [dbo].[Blogs_Insert]    Script Date: 12/26/2022 13:52:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 --=============================================
 --Author: <Medina, Joe>
 --Create date: <2022-10-26>
 --Description: <Insert for Blogs>
 --Code Reviewer: 
 

 --MODIFIED BY: Author
 --MODIFIED DATE: <2022-10-26>
 --Code Reviewer: 
 --Note: 
 --=============================================
ALTER proc [dbo].[Blogs_Insert]
	@BlogTypeId int
	,@AuthorId int
	,@Title nvarchar(100)
	,@Subject nvarchar(100)
	,@Content nvarchar(MAX)
	,@ImageUrl nvarchar(250)
	,@IsPublished bit
	,@DatePublished datetime2 = null
	,@Id int OUTPUT

AS

/*

DECLARE @Id int = 0
		,@BlogTypeId int = 2
		,@AuthorId int = 8
		,@Title nvarchar(100) = 'Second Blog'
		,@Subject nvarchar(100) = 'Blogs'
		,@Content nvarchar(MAX) = 'Blog content'
		,@ImageUrl nvarchar(250) = 'sabio.la'
		,@IsPublished bit = '0'
		,@DatePublished datetime2 = null

EXECUTE dbo.Blogs_Insert
		@BlogTypeId
		,@AuthorId
		,@Title
		,@Subject
		,@Content
		,@ImageUrl
		,@IsPublished
		,@DatePublished
		,@Id OUTPUT

SELECT TOP 20	*
FROM	dbo.Blogs

*/

BEGIN

	INSERT INTO	[dbo].[Blogs]
		([BlogTypeId]
		,[AuthorId]
		,[Title]
		,[Subject]
		,[Content]
		,[ImageUrl]
		,[IsPublished]
		,[DatePublished])
	VALUES
		(@BlogTypeId
		,@AuthorId
		,@Title
		,@Subject
		,@Content
		,@ImageUrl
		,@IsPublished
		,@DatePublished)

	SET @Id = SCOPE_IDENTITY()

END
