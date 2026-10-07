using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Phonebook.Api.Data;
using Phonebook.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// --- Database (PostgreSQL via EF Core) ---
builder.Services.AddDbContext<PhonebookDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Phonebook"),
        npgsql => npgsql.EnableRetryOnFailure()));

// --- Authentication (Keycloak access tokens) ---
var keycloak = builder.Configuration.GetSection("Keycloak");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Where the API downloads Keycloak's signing keys. Inside Docker this is the
        // internal address (http://keycloak:8080/...), which differs from the issuer below.
        options.MetadataAddress = keycloak["MetadataAddress"]!;
        options.RequireHttpsMetadata = keycloak.GetValue<bool>("RequireHttpsMetadata");

        // Keep original JWT claim names ("sub", "preferred_username") instead of
        // the legacy Microsoft XML-namespace claim types.
        options.MapInboundClaims = false;

        options.TokenValidationParameters.ValidIssuer = keycloak["Issuer"];
        options.TokenValidationParameters.ValidAudience = keycloak["Audience"];
        options.TokenValidationParameters.NameClaimType = "preferred_username";
    });

builder.Services.AddAuthorization();

// --- API plumbing ---
builder.Services.AddValidation();
builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();
builder.Services.AddOpenApi();
builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();

// Create or upgrade the database schema on startup, so `docker compose up` needs no manual step.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PhonebookDbContext>();
    await db.Database.MigrateAsync();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");
app.MapPhoneEndpoints();

app.Run();
