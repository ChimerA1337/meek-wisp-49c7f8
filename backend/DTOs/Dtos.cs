namespace BookLibrary.Api.DTOs;

public record RegisterRequest(string Username, string Password);

public record LoginRequest(string Username, string Password);

public record AuthResponse(string Token, string Username);

public record BookDto(int Id, string Title, string Author, string Isbn, DateTime PublicationDate);

public record BookInputDto(string Title, string Author, string Isbn, DateTime PublicationDate);

public record QuoteDto(int Id, string Text, string? Author);

public record QuoteInputDto(string Text, string? Author);
