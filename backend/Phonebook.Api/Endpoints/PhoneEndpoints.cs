using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Phonebook.Api.Data;

namespace Phonebook.Api.Endpoints;

public record CreatePhoneEntryRequest(
    [property: Required, StringLength(100, MinimumLength = 1)]
    string Name,

    // Optional leading "+", then digits with optional spaces, dashes or parentheses.
    [property: Required, RegularExpression(@"^\+?[0-9][0-9 ()\-]{4,30}$",
        ErrorMessage = "Invalid phone number format.")]
    string Number,

    // Nullable so that a missing value fails validation instead of silently defaulting to Personal.
    [property: Required]
    Visibility? Visibility);

public record PhoneEntryResponse(
    Guid Id,
    string Name,
    string Number,
    Visibility Visibility,
    string CreatedBy,
    DateTimeOffset CreatedAt,
    bool IsMine);

public static class PhoneEndpoints
{
    public static void MapPhoneEndpoints(this IEndpointRouteBuilder app)
    {
        // Every endpoint in this group requires a valid Keycloak access token.
        var group = app.MapGroup("/api/phones").RequireAuthorization();

        group.MapGet("/", GetPhones);
        group.MapGet("/{id:guid}", GetPhone);
        group.MapPost("/", CreatePhone);
        // Intentionally no PUT / PATCH / DELETE - entries can only be added and viewed.
    }

    private static async Task<List<PhoneEntryResponse>> GetPhones(
        ClaimsPrincipal user, PhonebookDbContext db, CancellationToken ct)
    {
        var userId = GetUserId(user);

        return await db.PhoneEntries
            .AsNoTracking()
            .Where(e => e.Visibility == Visibility.Shared || e.OwnerId == userId)
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new PhoneEntryResponse(
                e.Id, e.Name, e.Number, e.Visibility, e.OwnerName, e.CreatedAt, e.OwnerId == userId))
            .ToListAsync(ct);
    }

    private static async Task<IResult> GetPhone(
        Guid id, ClaimsPrincipal user, PhonebookDbContext db, CancellationToken ct)
    {
        var userId = GetUserId(user);

        // Someone else's personal entry returns 404, so its existence is not revealed.
        var entry = await db.PhoneEntries
            .AsNoTracking()
            .Where(e => e.Id == id && (e.Visibility == Visibility.Shared || e.OwnerId == userId))
            .Select(e => new PhoneEntryResponse(
                e.Id, e.Name, e.Number, e.Visibility, e.OwnerName, e.CreatedAt, e.OwnerId == userId))
            .FirstOrDefaultAsync(ct);

        return entry is null ? Results.NotFound() : Results.Ok(entry);
    }

    private static async Task<IResult> CreatePhone(
        CreatePhoneEntryRequest request, ClaimsPrincipal user, PhonebookDbContext db, CancellationToken ct)
    {
        var entry = new PhoneEntry
        {
            Id = Guid.CreateVersion7(),
            Name = request.Name.Trim(),
            Number = request.Number.Trim(),
            Visibility = request.Visibility!.Value,
            OwnerId = GetUserId(user),
            OwnerName = user.Identity?.Name ?? "unknown",
            CreatedAt = DateTimeOffset.UtcNow,
        };

        db.PhoneEntries.Add(entry);
        await db.SaveChangesAsync(ct);

        var response = new PhoneEntryResponse(
            entry.Id, entry.Name, entry.Number, entry.Visibility, entry.OwnerName, entry.CreatedAt, IsMine: true);

        return Results.Created($"/api/phones/{entry.Id}", response);
    }

    // "sub" is the stable Keycloak user id; usernames can change, ids cannot.
    private static string GetUserId(ClaimsPrincipal user) =>
        user.FindFirstValue("sub")
        ?? throw new InvalidOperationException("Access token does not contain a 'sub' claim.");
}
