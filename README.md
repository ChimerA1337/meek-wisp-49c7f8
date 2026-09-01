# Book Library

A full CRUD "book library" app with JWT-based authentication and a personal quotes feature.

- **Frontend:** Angular 20 (standalone components, signals, functional guards/interceptors), Bootstrap 5, Font Awesome.
- **Backend:** .NET 9 ASP.NET Core Web API, Entity Framework Core with SQLite, JWT bearer authentication.

## Project structure

```
/frontend   Angular 20 app (deployed to Netlify as a static site)
/backend    .NET 9 Web API (NOT deployed by Netlify — run it separately)
/public     Minimal static placeholder page published by the Netlify build
```

## Important: what Netlify actually deploys

Netlify only builds and serves static sites or Node.js serverless functions — it cannot host a
.NET runtime. Because of that:

- `netlify.toml` points its `publish` directory at `/public`, a tiny static placeholder page.
- The **real** Angular frontend in `/frontend` and the .NET backend in `/backend` are **not**
  built or run by Netlify at all in this scaffold.
- To actually deploy the Angular frontend to Netlify for real, you would change the Netlify build
  command to build the Angular app (`cd frontend && npm install && npm run build`) and point
  `publish` at `frontend/dist/book-library-frontend/browser`. This was intentionally left as a
  placeholder here per the task requirements.
- The .NET backend needs separate hosting (e.g. Azure App Service, Fly.io, Render, a VM, etc.) —
  there is no way to run it "on Netlify."

## Running the frontend locally

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200` and expects the API at
`http://localhost:5000/api` (see `src/environments/environment.ts`).

## Running the backend locally

```bash
cd backend
dotnet restore
dotnet run
```

This starts the Web API (by default around `http://localhost:5000`, confirm the actual port from
the console output / `Properties/launchSettings.json` if you add one). On first run it creates a
local SQLite database file `app.db` via `Database.EnsureCreated()` (no EF Core migrations are
used, for simplicity).

### JWT secret

`backend/appsettings.json` contains a `Jwt:Key` placeholder value:

```
REPLACE_THIS_WITH_A_REAL_RANDOM_SECRET_MIN_32_CHARS_LONG_0987654321
```

This is **not** a real secret — it's a random-looking placeholder committed to the repo for local
development convenience only. Before running this anywhere other than your own machine, replace
it with a securely generated secret (e.g. via user secrets, environment variables, or a secrets
manager), and never commit the real value to source control.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login` — return `{ token, username }`.
- `GET/POST/PUT/DELETE /api/books[/:id]` — CRUD for books (requires `Authorization: Bearer <token>`).
- `GET/POST/DELETE /api/quotes[/:id]` — CRUD for the current user's favorite quotes (requires auth).

CORS is configured to allow `http://localhost:4200` for local development.
