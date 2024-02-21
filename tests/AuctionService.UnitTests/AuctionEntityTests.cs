using AuctionService.Entities;

namespace AuctionService.UnitTests;

public class AuctionEntityTests
{
    [Fact]
    // Method_Scenario_ExpectedResult
    public void HasReservePrice_ReservePriceGreaterThanZero_True()
    {
        // Arrange
        var auction = new Auction()
        {
            Id = Guid.NewGuid(),
            ReservePrice = 10
        };

        // Act
        var result = auction.HasReservePrice();

        // Assert
        Assert.True(result);
    }
}