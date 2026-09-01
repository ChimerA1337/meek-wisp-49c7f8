# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Architecture

This repo contains two independent projects plus a Netlify placeholder:

### `/frontend` — Angular 20 standalone app

- `src/app/app.config.ts` — root providers: `provideRouter`, `provideHttpClient` with the
  `authInterceptor` registered via `withInterceptors`.
- `src/app/app.routes.ts` — route table, all feature routes are lazy-loaded via `loadComponent`.
- `src/app/core/` — cross-cutting concerns:
  - `services/auth.service.ts` — signal-based auth state (`token`, `currentUser`, `isLoggedIn`
    computed signals), persists the JWT to `localStorage`.
  - `services/book.service.ts`, `services/quote.service.ts` — thin HTTP wrappers over the API,
    base URL comes from `src/environments/environment*.ts`.
  - `interceptors/auth.interceptor.ts` — functional `HttpInterceptorFn` that attaches
    `Authorization: Bearer <token>` to every outgoing request when a token exists.
  - `guards/auth.guard.ts` — functional `CanActivateFn`, redirects to `/login` when logged out.
  - `models/models.ts` — shared TypeScript interfaces mirroring the backend DTOs.
- `src/app/features/` — one folder per route: `auth/login`, `auth/register`, `books/book-list`,
  `books/book-form` (shared between create and edit), `quotes`.
- `src/app/shared/navbar/` — the responsive Bootstrap navbar shown on every page.

Conventions: standalone components everywhere (no NgModules), `signal()`/`computed()` for local
and service state, reactive forms (`FormBuilder.nonNullable.group`) with Bootstrap validation
classes, new `@if`/`@for` control-flow syntax in templates instead of `*ngIf`/`*ngFor`.

### `/backend` — .NET 9 Web API

- `Program.cs` — composition root: EF Core + SQLite, JWT bearer auth, CORS for
  `http://localhost:4200`, `Database.EnsureCreated()` at startup instead of migrations.
- `Models/` — EF entities (`User`, `Book`, `Quote`).
- `DTOs/Dtos.cs` — request/response records used by controllers instead of exposing entities
  directly.
- `Data/AppDbContext.cs` — the single `DbContext`, with a unique index on `User.Username`.
- `Services/JwtService.cs` — issues signed JWTs from the `Jwt` config section.
- `Controllers/` — `AuthController` (register/login, BCrypt password hashing), `BooksController`
  and `QuotesController` (both `[Authorize]`; quotes are scoped to the current user via the
  `NameIdentifier` claim).

Conventions: controller-based (not minimal API) for readability, DTOs never expose the
`PasswordHash` field, all mutating endpoints require the JWT bearer token.

## Non-obvious decision: the backend is intentionally excluded from the Netlify deploy

Netlify's build/deploy pipeline supports static sites and Node.js serverless functions — it does
not run arbitrary language runtimes like .NET. This project still needed a real relational
backend with EF Core, so the two halves are deliberately decoupled:

- `netlify.toml` builds nothing real and publishes `/public`, a static placeholder page, purely
  so the Netlify site has a valid publish directory and a green build.
- `/frontend` is written as a normal deployable Angular app (it's just not wired into
  `netlify.toml` yet) — if someone wants to actually deploy it to Netlify, update the build
  command to `cd frontend && npm install && npm run build` and `publish` to
  `frontend/dist/book-library-frontend/browser`.
- `/backend` must be hosted elsewhere (Azure, Fly.io, Render, a VM, etc.); nothing in this repo
  attempts to deploy it anywhere.

Do not try to "fix" this by adding Netlify Functions or Netlify DB — that was an explicit
out-of-scope request from the project owner, not an oversight. Do not run `dotnet build`/`dotnet
run`/`ng serve`/`npm install` as part of any Netlify build step.
