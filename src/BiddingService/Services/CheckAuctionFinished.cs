
using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Services
{
    public class CheckAuctionFinished : BackgroundService
    {
        private readonly ILogger<CheckAuctionFinished> _logger;
        private readonly IServiceProvider _serviceProvider;
        public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }
        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting check for finished auctions");
            cancellationToken.Register(() => _logger.LogInformation("===> Auction check is topping"));

            while (!cancellationToken.IsCancellationRequested)
            {
                await CheckAuctions(cancellationToken);
                await Task.Delay(5000, cancellationToken);
            }
        }

        private async Task CheckAuctions(CancellationToken cancellationToken)
        {
            var finishedAuctions = await DB.Find<Auction>()
                .Match(x => x.AuctionEnd <= DateTime.Now)
                .Match(x => !x.Finished)
                .ExecuteAsync(cancellationToken);

            if (finishedAuctions.Count == 0) return;

            _logger.LogInformation("====> Found {count} auctions that have completed", finishedAuctions.Count);

            using var scope = _serviceProvider.CreateScope();
            var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

            foreach (var auction in finishedAuctions)
            {
                auction.Finished = true;
                await auction.SaveAsync(null, cancellationToken);

                var winningBid = await DB.Find<Bid>()
                    .Match(a => a.AuctionId == auction.ID)
                    .Match(b => b.BidStatus == BidStatus.Accepted)
                    .Sort(x => x.Descending(s => s.Amount))
                    .ExecuteFirstAsync(cancellationToken);

                await endpoint.Publish(new AuctionFinished()
                {
                    ItemSold = winningBid != null,
                    AuctionId = auction.ID,
                    Winner = winningBid?.Bidder,
                    Amount = winningBid?.Amount,
                    Seller = auction.Seller
                }, cancellationToken);
            }
        }
    }
}