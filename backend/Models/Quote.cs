namespace BookLibrary.Api.Models;

public class Quote
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Text { get; set; } = string.Empty;
    public string? Author { get; set; }
}
