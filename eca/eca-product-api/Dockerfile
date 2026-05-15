FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["EcaProductApi.csproj", "."]
RUN dotnet restore "EcaProductApi.csproj"
COPY . .
RUN dotnet build "EcaProductApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "EcaProductApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EcaProductApi.dll"]
