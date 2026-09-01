import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/books/book-list/book-list.component').then((m) => m.BookListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'books/new',
    loadComponent: () => import('./features/books/book-form/book-form.component').then((m) => m.BookFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'books/:id/edit',
    loadComponent: () => import('./features/books/book-form/book-form.component').then((m) => m.BookFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'quotes',
    loadComponent: () => import('./features/quotes/quotes.component').then((m) => m.QuotesComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
