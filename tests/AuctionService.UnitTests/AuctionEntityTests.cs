using AuctionService.Entities;
using FluentAssertions;

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
        result.Should().Be(true);
    }
}