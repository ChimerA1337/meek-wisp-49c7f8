import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/models';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 class="mb-0"><i class="fas fa-book-open me-2"></i>Books</h2>
        <a class="btn btn-primary" routerLink="/books/new">
          <i class="fas fa-plus me-1"></i>Add New Book
        </a>
      </div>

      @if (errorMessage()) {
        <div class="alert alert-danger">{{ errorMessage() }}</div>
      }

      @if (loading()) {
        <p class="text-muted"><i class="fas fa-spinner fa-spin me-2"></i>Loading books...</p>
      } @else if (books().length === 0) {
        <div class="alert alert-info">No books yet. Add your first book to get started.</div>
      } @else {
        <div class="row g-3">
          @for (book of books(); track book.id) {
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{{ book.author }}</h6>
                  <p class="card-text mb-1"><strong>ISBN:</strong> {{ book.isbn }}</p>
                  <p class="card-text text-muted mb-3">
                    <strong>Published:</strong> {{ book.publicationDate | date: 'mediumDate' }}
                  </p>
                  <div class="card-actions mt-auto">
                    <a class="btn btn-sm btn-outline-secondary" [routerLink]="['/books', book.id, 'edit']">
                      <i class="fas fa-pen me-1"></i>Edit
                    </a>
                    <button class="btn btn-sm btn-outline-danger" (click)="deleteBook(book)">
                      <i class="fas fa-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class BookListComponent implements OnInit {
  books = signal<Book[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.bookService.getAll().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load books. Is the API running?');
        this.loading.set(false);
      },
    });
  }

  deleteBook(book: Book): void {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) {
      return;
    }

    this.bookService.delete(book.id).subscribe({
      next: () => this.loadBooks(),
      error: () => this.errorMessage.set('Could not delete book.'),
    });
  }
}
