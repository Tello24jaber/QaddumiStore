# QaddumiStore API

## Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:
   - Replace `VITE_SUPABASE_URL` with your Supabase project URL
   - Replace `VITE_SUPABASE_ANON_KEY` with your Supabase anonymous key
   - Replace `SUPABASE_SERVICE_ROLE_KEY` with your Supabase service role key
   - Update other configuration values as needed

## Development

```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
npm run lint   # Run ESLint
```

The API server will start on `http://localhost:3001` by default.

## Health Check

Once the server is running, you can test it:
```bash
curl http://localhost:3001/health
```