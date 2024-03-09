using System.Net;
using System.Net.Http.Json;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.IntegrationTests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.IntegrationTests;

public class AuctionControllerTests : IClassFixture<CustomWebAppFactory>, IAsyncLifetime
{
    private readonly CustomWebAppFactory _factory;
    private readonly HttpClient _httpClient;
    private const string _gT_ID = "afbee524-5972-4075-8800-7d1f9d7b0a0c";
    public AuctionControllerTests(CustomWebAppFactory factory)
    {
        _factory = factory;
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task GetAuctions_ShouldReturn3Auctions()
    {
        // Arrange
        // Action
        var response = await _httpClient.GetFromJsonAsync<List<AuctionDto>>("api/auctions");

        // Assert
        response.Count.Should().Be(3);
    }

    [Fact]
    public async Task GetAuctionById_WithValidId_ShouldReturnAuction()
    {
        // Act
        var response = await _httpClient.GetFromJsonAsync<AuctionDto>($"api/auctions/{_gT_ID}");

        // Assert
        response.Model.Should().Be("GT");
    }

    [Fact]
    public async Task GetAuctionById_WithInvalidId_ShouldReturn404()
    {
        // Act
        var response = await _httpClient.GetAsync($"api/auctions/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateAuction_WithNoAuth_ShouldReturn401()
    {
        // Arrange
        var auction = new CreateAuctionDto()
        {
            Make = "test"
        };

        // Act
        var response = await _httpClient.PostAsJsonAsync($"api/auctions", auction);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateAuction_WithAuth_ShouldReturn201()
    {
        // Arrange
        string SELLER = "bob";
        var auction = GetAuctionForCreate();
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser(SELLER));

        // Act
        var response = await _httpClient.PostAsJsonAsync($"api/auctions", auction);

        // Assert
        response.EnsureSuccessStatusCode();
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var createdAuction = await response.Content.ReadFromJsonAsync<AuctionDto>();
        createdAuction.Seller.Should().Be(SELLER);
    }

    [Fact]
    public async Task CreateAuction_WithInvalidCreateAuctionDto_ShouldReturn400()
    {
        // Arrange
        var auction = GetAuctionForCreate();
        auction.Make = null;
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

        // Act
        var response = await _httpClient.PostAsJsonAsync($"api/auctions", auction);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateAuction_WithValidUpdateDtoAndUser_ShouldReturn200()
    {
        // Arrange
        var updateAuction = new UpdateAuctionDto { Make = "Updated" };
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

        // Act
        var response = await _httpClient.PutAsJsonAsync($"api/auctions/{_gT_ID}", updateAuction);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task UpdateAuction_WithValidUpdateDtoAndInvalidUser_ShouldReturn403()
    {
        // Arrange
        var updateAuction = new UpdateAuctionDto { Make = "Updated" };
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("notbob"));

        // Act
        var response = await _httpClient.PutAsJsonAsync($"api/auctions/{_gT_ID}", updateAuction);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    public Task InitializeAsync() => Task.CompletedTask;
    public Task DisposeAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AuctionDbContext>();
        DbHelper.ReInitDbForTests(db);
        return Task.CompletedTask;
    }

    private static CreateAuctionDto GetAuctionForCreate()
    {
        return new CreateAuctionDto
        {
            Make = "test",
            Model = "testModel",
            ImageUrl = "test",
            Color = "test",
            Mileage = 10,
            Year = 10,
            ReservePrice = 10
        };
    }
}
