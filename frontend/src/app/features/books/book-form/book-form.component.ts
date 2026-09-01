import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container" style="max-width: 560px;">
      <h2 class="mb-4">
        <i class="fas" [class.fa-plus]="!isEditMode()" [class.fa-pen]="isEditMode()"></i>
        {{ isEditMode() ? 'Edit Book' : 'Add New Book' }}
      </h2>

      @if (errorMessage()) {
        <div class="alert alert-danger">{{ errorMessage() }}</div>
      }

      @if (loading()) {
        <p class="text-muted"><i class="fas fa-spinner fa-spin me-2"></i>Loading...</p>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()" class="card shadow-sm">
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label" for="title">Title</label>
              <input
                id="title"
                type="text"
                class="form-control"
                formControlName="title"
                [class.is-invalid]="form.controls.title.invalid && form.controls.title.touched"
              />
              <div class="invalid-feedback">Title is required.</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="author">Author</label>
              <input
                id="author"
                type="text"
                class="form-control"
                formControlName="author"
                [class.is-invalid]="form.controls.author.invalid && form.controls.author.touched"
              />
              <div class="invalid-feedback">Author is required.</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="isbn">ISBN</label>
              <input
                id="isbn"
                type="text"
                class="form-control"
                formControlName="isbn"
                [class.is-invalid]="form.controls.isbn.invalid && form.controls.isbn.touched"
              />
              <div class="invalid-feedback">ISBN is required.</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="publicationDate">Publication Date</label>
              <input
                id="publicationDate"
                type="date"
                class="form-control"
                formControlName="publicationDate"
                [class.is-invalid]="form.controls.publicationDate.invalid && form.controls.publicationDate.touched"
              />
              <div class="invalid-feedback">Publication date is required.</div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving()">
                <i class="fas fa-save me-1"></i>
                {{ saving() ? 'Saving...' : 'Save' }}
              </button>
              <a class="btn btn-outline-secondary" routerLink="/">Cancel</a>
            </div>
          </div>
        </form>
      }
    </div>
  `,
})
export class BookFormComponent implements OnInit {
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  bookId: number | null = null;

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    isbn: ['', Validators.required],
    publicationDate: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  isEditMode = signal(false);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bookId = Number(idParam);
      this.isEditMode.set(true);
      this.loading.set(true);
      this.bookService.getById(this.bookId).subscribe({
        next: (book) => {
          this.form.patchValue({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publicationDate: book.publicationDate?.substring(0, 10) ?? '',
          });
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set('Could not load book.');
          this.loading.set(false);
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const value = this.form.getRawValue();

    const request$ = this.isEditMode() && this.bookId
      ? this.bookService.update(this.bookId, value)
      : this.bookService.create(value);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save book.');
      },
    });
  }
}
