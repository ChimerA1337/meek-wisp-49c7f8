import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/"><i class="fas fa-book"></i>Book Library</a>
        <button
          class="navbar-toggler"
          type="button"
          (click)="collapsed = !collapsed"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" [class.show]="!collapsed">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                <i class="fas fa-book-open me-1"></i>Books
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/quotes" routerLinkActive="active">
                <i class="fas fa-quote-left me-1"></i>My Quotes
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            @if (auth.isLoggedIn()) {
              <li class="nav-item d-flex align-items-center">
                <span class="navbar-text text-light me-3">
                  <i class="fas fa-user me-1"></i>{{ auth.currentUser() }}
                </span>
              </li>
              <li class="nav-item">
                <button class="btn btn-outline-light" (click)="logout()">
                  <i class="fas fa-sign-out-alt me-1"></i>Logout
                </button>
              </li>
            } @else {
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">
                  <i class="fas fa-sign-in-alt me-1"></i>Login
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">
                  <i class="fas fa-user-plus me-1"></i>Register
                </a>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  collapsed = true;

  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
