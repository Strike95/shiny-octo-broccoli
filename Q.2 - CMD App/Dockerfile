# See https://aka.ms/customizecontainer for information on how to customize the debug container and how Visual Studio uses this Dockerfile to build images for faster debugging.

# This stage is used when running from Visual Studio in fast mode (default for debug configuration)
FROM mcr.microsoft.com/dotnet/runtime:8.0 AS base
USER $APP_UID
WORKDIR /app


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["CheckDay.csproj", "."]
RUN dotnet restore "./CheckDay.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "./CheckDay.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied in the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CheckDay.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in the production environment or when running from Visual Studio in normal mode (default when not using debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CheckDay.dll"]