namespace Phonebook.Api.Data;

public enum Visibility
{
    /// <summary>Visible only to the user who created the entry.</summary>
    Personal,

    /// <summary>Visible to every signed-in user.</summary>
    Shared,
}

public class PhoneEntry
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Number { get; set; }

    public Visibility Visibility { get; set; }

    /// <summary>Keycloak user id (<c>sub</c> claim) of the author.</summary>
    public required string OwnerId { get; set; }

    /// <summary>Keycloak username of the author, kept for display.</summary>
    public required string OwnerName { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
}
