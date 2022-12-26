USE [Immersed]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Insert]    Script Date: 12/26/2022 12:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Joe Medina>
-- Create date: <10/30/2022>
-- Description: <Insert Message>
-- Code Reviewer: Jacob Helton

-- MODIFIED BY: author
-- MODIFIED DATE: <10/30/2022>
-- Code Reviewer: Jacob Helton
-- Note:
-- =============================================
ALTER proc [dbo].[Messages_Insert]
	@Message nvarchar(1000)
	,@Subject nvarchar(100)
	,@RecipientEntityTypeId int
	,@RecipientId int
	,@SenderEntityTypeId int
	,@SenderId int
	,@ZoneId int
	,@DateSent datetime2 = null
	,@DateRead datetime2 = null
	,@Id int OUTPUT

AS

/*

DECLARE	@Id int = 0
		,@Message nvarchar(1000) = 'This is a new user message'
		,@Subject nvarchar(100) = 'User Message Subject'
		,@RecipientEntityTypeId int = 1
		,@RecipientId int = 66
		,@SenderEntityTypeId int = 1
		,@SenderId int = 8
		,@ZoneId int = 1
		,@DateSent datetime2 = '2022-10-30'
		,@DateRead datetime2 = '2022-10-31'

EXECUTE dbo.Messages_Insert
		@Message 
		,@Subject
		,@RecipientEntityTypeId
		,@RecipientId
		,@SenderEntityTypeId
		,@SenderId
		,@ZoneId
		,@DateSent
		,@DateRead
		,@Id OUTPUT

*/

BEGIN

	INSERT INTO [dbo].[Messages]
		([Message]
		,[Subject]
		,[RecipientEntityTypeId]
		,[RecipientId]
		,[SenderEntityTypeId]
		,[SenderId]
		,[ZoneId]
		,[DateSent]
		,[DateRead])
	VALUES
		(@Message 
		,@Subject
		,@RecipientEntityTypeId
		,@RecipientId
		,@SenderEntityTypeId
		,@SenderId
		,@ZoneId
		,@DateSent
		,@DateRead)

	SET @Id = SCOPE_IDENTITY()

END
