import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container" style="max-width: 420px;">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="card-title mb-4 text-center"><i class="fas fa-book me-2"></i>Sign In</h3>

          @if (errorMessage()) {
            <div class="alert alert-danger">{{ errorMessage() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-3">
              <label class="form-label" for="username">Username</label>
              <input
                id="username"
                type="text"
                class="form-control"
                formControlName="username"
                [class.is-invalid]="form.controls.username.invalid && form.controls.username.touched"
              />
              <div class="invalid-feedback">Username is required.</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="password">Password</label>
              <input
                id="password"
                type="password"
                class="form-control"
                formControlName="password"
                [class.is-invalid]="form.controls.password.invalid && form.controls.password.touched"
              />
              <div class="invalid-feedback">Password is required.</div>
            </div>
            <button type="submit" class="btn btn-primary w-100" [disabled]="form.invalid || loading()">
              <i class="fas fa-sign-in-alt me-1"></i>
              {{ loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <p class="text-center mt-3 mb-0">
            Don't have an account? <a routerLink="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Invalid username or password.');
      },
    });
  }
}
