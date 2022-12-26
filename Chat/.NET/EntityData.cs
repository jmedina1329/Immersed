public class EntityData
{
    public int Id { get; set; }
    public int EntityTypeId { get; set; }
    public string Name { get; set; }
    [AllowNull]
    public string AvatarUrl { get; set; }
    [AllowNull]
    public string ZoneType { get; set; }
}
