using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    public AuctionsController(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(CancellationToken cancellationToken)
    {
        List<Auction> auctions = await _context.Auctions
                        .Include(x => x.Item)
                        .OrderBy(x => x.Item.Make)
                        .ToListAsync(cancellationToken);
        return _mapper.Map<List<AuctionDto>>(auctions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id, CancellationToken cancellationToken)
    {
        Auction auction = await _context.Auctions
                            .Include(x => x.Item)
                            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (auction == null) return NotFound();

        return _mapper.Map<AuctionDto>(auction);
    }

    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto, CancellationToken cancellationToken)
    {
        var auction = _mapper.Map<Auction>(auctionDto);

        auction.Seller = "Test Seller";

        _context.Auctions.Add(auction);

        var newAuction = _mapper.Map<AuctionDto>(auction);

        var result = await _context.SaveChangesAsync(cancellationToken) > 0;

        if (!result) return BadRequest("Could not save changes to the DB");

        // The nameof(GetAuctionById) and new is to auto add the response header so that the user can get the api to get the created auction
        return CreatedAtAction(nameof(GetAuctionById),
            new { auction.Id }, newAuction);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto, CancellationToken cancellationToken)
    {
        var auction = await _context.Auctions
                        .Include(x => x.Item)
                        .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (auction == null) return NotFound();

        // Todo: Authenticate
        // if (auction.Seller != User.Identity.Name) return Forbid();

        auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;


        var result = await _context.SaveChangesAsync(cancellationToken) > 0;

        if (result) return Ok();

        return BadRequest("Problem saving changes");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id, CancellationToken cancellationToken)
    {
        var auction = await _context.Auctions
                        .Include(x => x.Item)
                        .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (auction == null) return NotFound();

        // Todo: Authenticate
        // if (auction.Seller != User.Identity.Name) return Forbid();

        _context.Auctions.Remove(auction);

        var result = await _context.SaveChangesAsync(cancellationToken) > 0;

        if (!result) return BadRequest("Could not update DB");

        return Ok();
    }
}
