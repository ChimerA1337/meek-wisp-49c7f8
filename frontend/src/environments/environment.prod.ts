export const environment = {
  production: true,
  // Netlify only serves the static Angular build; there is no .NET backend deployed
  // alongside it. This relative path is a placeholder for wherever the API ends up
  // being hosted (e.g. behind a reverse proxy or a separate host you configure).
  apiUrl: '/api',
};
