using System.Reflection;
using DbUp;
using EcaProductApi.Data;
using EcaProductApi.Repository;
using EcaProductApi.Service;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using EcaProductApi.Repository.Entity;
using System.Globalization;

CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
var keycloakUrl = Environment.GetEnvironmentVariable("KEYCLOAK_URL")
                       ?? throw new Exception("KEYCLOAK_URL not set in .env");
var productSecret = Environment.GetEnvironmentVariable("PRODUCT_SECRET")
                       ?? throw new Exception("PRODUCT_SECRET not set in .env");
var productClientId = Environment.GetEnvironmentVariable("PRODUCT_CLIENT_ID")
                       ?? throw new Exception("PRODUCT_CLIENT_ID not set in .env");
var keycloakRealm = Environment.GetEnvironmentVariable("KEYCLOAK_REALM")
                       ?? throw new Exception("KEYCLOAK_REALM not set in .env");
var uiClientId = Environment.GetEnvironmentVariable("UI_CLIENT_ID")
                       ?? throw new Exception("UI_CLIENT_ID not set in .env");
var uiClientSecret = Environment.GetEnvironmentVariable("UI_CLIENT_SECRET")
                       ?? throw new Exception("UI_CLIENT_SECRET not set in .env");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.Authority = $"{keycloakUrl}/realms/{keycloakRealm}";
        options.Audience = productClientId;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateLifetime = true
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var realmAccess = context.Principal?.FindFirst("realm_access")?.Value;
                if (!string.IsNullOrEmpty(realmAccess))
                {
                    var roles = System.Text.Json.JsonDocument.Parse(realmAccess)
                        .RootElement.GetProperty("roles")
                        .EnumerateArray()
                        .Select(r => r.GetString());

                    var claimsIdentity = context.Principal?.Identity as ClaimsIdentity;
                    foreach (var role in roles)
                        claimsIdentity?.AddClaim(new Claim(ClaimTypes.Role, role!));
                }
                return Task.CompletedTask;
            }
        };
    });

// Add configuration, for example connection string from appsettings.json
var connectionString = Environment.GetEnvironmentVariable("DATASTORE_URL")
                       ?? throw new Exception("DATASTORE_URL not set in .env");

// Optional: apply DB migrations via DbUp on startup
EnsureDatabaseMigration(connectionString);

builder.Services.AddAuthorization();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Keycloak için OAuth2 yapılandırması
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Description = "Keycloak Login with OAuth2",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Scheme = "Bearer",
        BearerFormat = "JWT",

        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri($"{keycloakUrl}/realms/{keycloakRealm}/protocol/openid-connect/auth"),
                TokenUrl = new Uri($"{keycloakUrl}/realms/{keycloakRealm}/protocol/openid-connect/token"),
                Scopes = new Dictionary<string, string>
                {
                    { "openid", "OpenID Connect scope" },
                    { "profile", "User profile" }
                }
            }
        }
    });

    // Swagger dokümanında auth zorunlu endpointleri otomatik etiketle
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "oauth2"
                }
            },
            new[] { "openid", "profile" }
        }
    });
});

var app = builder.Build();


app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");

        // 👇 Keycloak OAuth config
        options.OAuthClientId(uiClientId);         // Keycloak’ta API client adı
        options.OAuthClientSecret(uiClientSecret);               // (Bearer-only ise boş bırak)
        options.OAuthUsePkce();                      // Güvenli login
        options.OAuthScopes("openid", "profile");
        options.OAuthAppName("Keycloak + Swagger Demo");
    });

}

app.UseHttpsRedirection();
app.MapControllers();


app.Run();

static void EnsureDatabaseMigration(string connectionString)
{
    var upgrader =
        DeployChanges.To
            .PostgresqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
            .LogToConsole()
            .Build();

    var result = upgrader.PerformUpgrade();

    if (!result.Successful)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"Database migration failed: {result.Error}");
        Console.ResetColor();
        throw new Exception("Database migration failed, aborting startup.");
    }

    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("Database migrations applied successfully.");
    Console.ResetColor();
}