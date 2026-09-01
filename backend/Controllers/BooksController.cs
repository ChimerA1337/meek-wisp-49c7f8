using BookLibrary.Api.Data;
using BookLibrary.Api.DTOs;
using BookLibrary.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/books")]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _db;

    public BooksController(AppDbContext db)
    {
        _db = db;
    }

    private static BookDto ToDto(Book b) => new(b.Id, b.Title, b.Author, b.Isbn, b.PublicationDate);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetAll()
    {
        var books = await _db.Books.OrderBy(b => b.Title).ToListAsync();
        return Ok(books.Select(ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookDto>> GetById(int id)
    {
        var book = await _db.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        return Ok(ToDto(book));
    }

    [HttpPost]
    public async Task<ActionResult<BookDto>> Create(BookInputDto input)
    {
        var book = new Book
        {
            Title = input.Title,
            Author = input.Author,
            Isbn = input.Isbn,
            PublicationDate = input.PublicationDate,
        };

        _db.Books.Add(book);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = book.Id }, ToDto(book));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BookInputDto input)
    {
        var book = await _db.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        book.Title = input.Title;
        book.Author = input.Author;
        book.Isbn = input.Isbn;
        book.PublicationDate = input.PublicationDate;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await _db.Books.FindAsync(id);
        if (book is null)
        {
            return NotFound();
        }

        _db.Books.Remove(book);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
