export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
}

export type BookInput = Omit<Book, 'id'>;

export interface Quote {
  id: number;
  text: string;
  author?: string | null;
}

export type QuoteInput = Omit<Quote, 'id'>;

export interface AuthResponse {
  token: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type RegisterRequest = LoginRequest;
