import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuoteService } from '../../core/services/quote.service';
import { Quote } from '../../core/models/models';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-container" style="max-width: 720px;">
      <h2 class="mb-4"><i class="fas fa-quote-left me-2"></i>My Quotes</h2>

      @if (errorMessage()) {
        <div class="alert alert-danger">{{ errorMessage() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label" for="text">Quote</label>
            <textarea
              id="text"
              class="form-control"
              rows="2"
              formControlName="text"
              [class.is-invalid]="form.controls.text.invalid && form.controls.text.touched"
            ></textarea>
            <div class="invalid-feedback">Quote text is required.</div>
          </div>
          <div class="mb-3">
            <label class="form-label" for="author">Author (optional)</label>
            <input id="author" type="text" class="form-control" formControlName="author" />
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving()">
            <i class="fas fa-plus me-1"></i>
            {{ saving() ? 'Adding...' : 'Add Quote' }}
          </button>
        </div>
      </form>

      @if (loading()) {
        <p class="text-muted"><i class="fas fa-spinner fa-spin me-2"></i>Loading quotes...</p>
      } @else if (quotes().length === 0) {
        <div class="alert alert-info">No quotes saved yet.</div>
      } @else {
        <div class="list-group">
          @for (quote of quotes(); track quote.id) {
            <div class="list-group-item d-flex justify-content-between align-items-start gap-3">
              <div>
                <p class="mb-1 fst-italic">&ldquo;{{ quote.text }}&rdquo;</p>
                @if (quote.author) {
                  <small class="text-muted">&mdash; {{ quote.author }}</small>
                }
              </div>
              <button class="btn btn-sm btn-outline-danger flex-shrink-0" (click)="deleteQuote(quote)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class QuotesComponent implements OnInit {
  quotes = signal<Quote[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    text: ['', Validators.required],
    author: [''],
  });

  constructor(private fb: FormBuilder, private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading.set(true);
    this.quoteService.getAll().subscribe({
      next: (quotes) => {
        this.quotes.set(quotes);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load quotes.');
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();

    this.quoteService.create({ text: value.text, author: value.author || null }).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset();
        this.loadQuotes();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save quote.');
      },
    });
  }

  deleteQuote(quote: Quote): void {
    if (!confirm('Delete this quote?')) {
      return;
    }

    this.quoteService.delete(quote.id).subscribe({
      next: () => this.loadQuotes(),
      error: () => this.errorMessage.set('Could not delete quote.'),
    });
  }
}
