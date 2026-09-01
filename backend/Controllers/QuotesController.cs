using System.Security.Claims;
using BookLibrary.Api.Data;
using BookLibrary.Api.DTOs;
using BookLibrary.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/quotes")]
public class QuotesController : ControllerBase
{
    private readonly AppDbContext _db;

    public QuotesController(AppDbContext db)
    {
        _db = db;
    }

    private static QuoteDto ToDto(Quote q) => new(q.Id, q.Text, q.Author);

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuoteDto>>> GetAll()
    {
        var quotes = await _db.Quotes
            .Where(q => q.UserId == CurrentUserId)
            .OrderByDescending(q => q.Id)
            .ToListAsync();

        return Ok(quotes.Select(ToDto));
    }

    [HttpPost]
    public async Task<ActionResult<QuoteDto>> Create(QuoteInputDto input)
    {
        var quote = new Quote
        {
            UserId = CurrentUserId,
            Text = input.Text,
            Author = input.Author,
        };

        _db.Quotes.Add(quote);
        await _db.SaveChangesAsync();

        return Ok(ToDto(quote));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var quote = await _db.Quotes.FirstOrDefaultAsync(q => q.Id == id && q.UserId == CurrentUserId);
        if (quote is null)
        {
            return NotFound();
        }

        _db.Quotes.Remove(quote);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
