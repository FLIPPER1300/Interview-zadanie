# ---- Stage 1: build ----
# The SDK image contains the compiler and NuGet; it is large and only used to build.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy only the project file first and restore packages. Docker caches this layer,
# so packages are re-downloaded only when the .csproj changes, not on every code edit.
COPY Phonebook.Api/Phonebook.Api.csproj Phonebook.Api/
RUN dotnet restore Phonebook.Api/Phonebook.Api.csproj

COPY Phonebook.Api/ Phonebook.Api/
RUN dotnet publish Phonebook.Api/Phonebook.Api.csproj -c Release -o /app/publish --no-restore

# ---- Stage 2: runtime ----
# The ASP.NET runtime image is much smaller and contains no build tools.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# The official .NET images ship a non-root "app" user and listen on port 8080 by default.
USER app
EXPOSE 8080

ENTRYPOINT ["dotnet", "Phonebook.Api.dll"]
