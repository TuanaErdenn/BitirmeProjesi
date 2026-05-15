using System.Reflection;
using System.Security.Claims;
using DbUp;
using DotNetEnv;
using EcaOrderApi.Consumer;
using EcaOrderApi.Common;
using EcaOrderApi.Config;
using EcaOrderApi.Contract;
using EcaOrderApi.Data;
using EcaOrderApi.External;
using EcaOrderApi.Middleware;
using EcaOrderApi.Model;
using EcaOrderApi.Repository;
using EcaOrderApi.Service;
using FS.Keycloak.RestApiClient.Api;
using FS.Keycloak.RestApiClient.Authentication.ClientFactory;
using FS.Keycloak.RestApiClient.Authentication.Flow;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Globalization;

CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
var keycloakUrl = Environment.GetEnvironmentVariable("KEYCLOAK_URL")
                       ?? throw new Exception("KEYCLOAK_URL not set in .env");
var orderSecret = Environment.GetEnvironmentVariable("ORDER_SECRET")
                       ?? throw new Exception("ORDER_SECRET not set in .env");
var orderClientId = Environment.GetEnvironmentVariable("ORDER_CLIENT_ID")
                       ?? throw new Exception("ORDER_CLIENT_ID not set in .env");
var keycloakRealm = Environment.GetEnvironmentVariable("KEYCLOAK_REALM")
                       ?? throw new Exception("KEYCLOAK_REALM not set in .env");
var uiClientId = Environment.GetEnvironmentVariable("UI_CLIENT_ID")
                       ?? throw new Exception("UI_CLIENT_ID not set in .env");
var uiClientSecret = Environment.GetEnvironmentVariable("UI_CLIENT_SECRET")
                       ?? throw new Exception("UI_CLIENT_SECRET not set in .env");
var productApiUrl = Environment.GetEnvironmentVariable("PRODUCT_API_URL")
                       ?? throw new Exception("PRODUCT_API_URL not set in .env");

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddRabbitMq(builder.Configuration);
builder.Services.AddRabbitMqConsumer<OrderStockReservedEvent, OrderStockReservedHandler>("inventory.order.stock.reserved");
builder.Services.AddRabbitMqConsumer<OrderStockRejectedEvent, OrderStockRejectedHandler>("inventory.order.stock.rejected");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.Authority = $"{keycloakUrl}/realms/{keycloakRealm}";
        options.Audience = orderClientId;
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

builder.Services.AddSingleton<ClientCredentialsFlow>(sp =>
{
    return new ClientCredentialsFlow
    {
        KeycloakUrl = keycloakUrl,
        Realm = keycloakRealm,
        ClientId = orderClientId,
        ClientSecret = orderSecret
    };
});

builder.Services.AddHttpClient("KeycloakAuthClient", client =>
{
    client.BaseAddress = new Uri(keycloakUrl.TrimEnd('/') + "/");
});

builder.Services.AddSingleton<UsersApi>(sp =>
{
    var creds = sp.GetRequiredService<ClientCredentialsFlow>();
    var authClient = AuthenticationHttpClientFactory.Create(creds);
    var usersApi = FS.Keycloak.RestApiClient.ClientFactory.ApiClientFactory.Create<UsersApi>(authClient);
    return usersApi;
});

var connectionString = Environment.GetEnvironmentVariable("DATASTORE_URL")
                       ?? throw new Exception("DATASTORE_URL not set in .env");

EnsureDatabaseMigration(connectionString);

builder.Services.AddAuthorization();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddHttpClient<IProductServiceClient, ProductServiceClient>(client =>
{
    client.BaseAddress = new Uri(productApiUrl);
});
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();


builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(
    connectionString,
    o => o.MapEnum<OrderStatus>("order_status")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");

        options.OAuthClientId(uiClientId);
        options.OAuthClientSecret(uiClientSecret);
        options.OAuthUsePkce();
        options.OAuthScopes("openid", "profile");
        options.OAuthAppName("Keycloak + Swagger Demo");
    });

}

app.UseMiddleware<ErrorHandlingMiddleware>();

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
