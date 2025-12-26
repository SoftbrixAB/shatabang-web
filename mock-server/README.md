# Shatabang Mock Server

A simple Express-based mock API server for local development without needing the real backend.

## Features

- **Authentication**: Auto-login with mock Google OAuth
- **Media API**: Mock media organized by years (2021-2024)
- **File Upload**: Simulated file upload with progress
- **Admin Endpoints**: Version info and cache rebuild
- **Placeholder Images**: Uses Unsplash/Picsum for realistic photos
- **Session Management**: In-memory sessions (resets on restart)

## Quick Start

From the **client directory** (not mock-server):

```bash
# Run both mock server and Vue app together
npm run dev:mock
```

Or run separately:

```bash
# Terminal 1 - Start mock server
npm run mock-server

# Terminal 2 - Start Vue app
npm run dev
```

The mock server runs on `http://localhost:3000` and the Vue app proxies API requests to it.

## Mock Data

### User
- **Email**: demo@example.com
- **Name**: Demo User
- **Auto-login**: Visit `/api/auth/google` to automatically log in

### Media
- **Years**: 2021, 2022, 2023, 2024
- **Total**: 180 items (2024: 20, 2023: 40, 2022: 100, 2021: 20)
- **Mix**: 80% photos, 20% videos
- **Images**: Placeholder images from Picsum Photos
- **Videos**: Sample video (Big Buck Bunny)

## API Endpoints

### Authentication
- `GET /api/auth/google` - Auto-login (redirects back to app)
- `GET /api/users/me` - Get current user (requires session)
- `POST /api/auth/logout` - Clear session

### Media
- `GET /api/dirs/list` - List available years
- `GET /api/dirs/:year` - Get media for specific year
- `GET /images/:size/:year/:month/:filename` - Get image thumbnail
- `GET /video/:year/:month/:filename` - Get video file
- `GET /media/:year/:month/:filename` - Download media

### Upload
- `POST /api/upload` - Upload file (multipart/form-data)

### Admin
- `GET /api/version` - Server version
- `POST /api/images/rebuild` - Trigger cache rebuild (simulated)
- `GET /arena` - Queue dashboard (mock UI)

### Health
- `GET /health` - Server health check

## Configuration

The server is pre-configured with sensible defaults:
- **Port**: 3000
- **Session**: In-memory (resets on restart)
- **CORS**: Disabled (uses Vite proxy)
- **File Upload**: Saves to `mock-server/uploads/`

## Development

The mock server automatically installs its dependencies when you run `npm run dev:mock` or `npm run mock-server`.

### Manual Setup

If you want to work on the mock server itself:

```bash
cd mock-server
npm install
npm start
```

### Adding Mock Data

Edit `mock-server/index.js`:

```javascript
// Add more years
const mockMediaYears = ['2024', '2023', '2022', '2021', '2020']

// Adjust media count per year
const generateMockMedia = (year, count = 50) => {
  // ...
}
```

## Limitations

- **No persistence**: All data resets on server restart
- **No real file storage**: Uploaded files are stored but not served back
- **Simplified auth**: No real OAuth, just instant login
- **No database**: All data is generated in-memory
- **Single user**: Only one mock user account

## Troubleshooting

**Port 3000 already in use:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Session not persisting:**
- Sessions are in-memory only
- Restart the server to clear sessions
- Check browser cookies are enabled

**Images not loading:**
- Mock server uses external placeholder services
- Check internet connection
- Picsum Photos and Google Storage must be accessible

## Production Note

⚠️ **This is a development tool only.** Do not use in production. The mock server has:
- No security measures
- No data validation
- Hardcoded credentials
- In-memory storage only
