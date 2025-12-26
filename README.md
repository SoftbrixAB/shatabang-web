# Shatabang Client

A modern media gallery application for managing and viewing photos and videos with an intuitive interface.

## Features

- **Gallery View**: Infinite scroll gallery with date-based organization
- **Calendar Timeline**: Interactive SVG timeline showing media by year and date
- **Fullscreen Viewer**: Keyboard navigation (←/→/ESC/Delete), image preloading, smooth transitions
- **File Upload**: Drag-and-drop interface with file examination before uploading
- **Admin Panel**: Cache management and background job monitoring
- **Authentication**: Secure Google OAuth with session management

## Tech Stack

- **Framework**: Vue 3.4 with Composition API
- **Build Tool**: Vite 5.4 (fast HMR, optimized builds)
- **Language**: TypeScript 5.3 (strict mode, full type safety)
- **Router**: Vue Router 4.2 with hash-based routing
- **State Management**: Pinia 2.1 stores + composables pattern
- **Styling**: Tailwind CSS 3.4 utility-first approach
- **Testing**: Vitest 1.6 + @vue/test-utils (73 passing tests)
- **HTTP Client**: Axios with interceptors

## Project Structure

```
src/
├── components/
│   ├── common/              # NavigationBar, UserInfo
│   ├── gallery/             # SimpleGallery, MediaGalleryItem
│   ├── fullsize/            # FullsizeMedia, FullsizeImage, FullsizeVideo
│   ├── calendar/            # CalendarGallery, CalendarDateAxis, CalendarYearRow
│   └── upload/              # FileDropzone, FileList
├── composables/             # Reusable logic hooks
│   ├── useInfiniteScroll.ts
│   ├── useKeyboardNav.ts
│   ├── useFullscreen.ts
│   └── ...
├── stores/                  # Pinia state management
│   ├── mediaStore.ts        # Media data with dibba-tree integration
│   ├── authStore.ts         # Authentication & user session
│   └── uploadStore.ts       # Upload progress tracking
├── router/                  # Vue Router configuration
│   ├── index.ts
│   └── guards.ts            # Authentication guards
├── services/                # API & external integrations
│   ├── api.ts               # Axios HTTP client
│   └── dibba-tree.ts        # Date hierarchy wrapper
├── utils/                   # Helper utilities
│   ├── dateUtils.ts         # Date/calendar calculations
│   └── mediaUtils.ts        # File parsing
├── types/                   # TypeScript type definitions
├── views/                   # Route components
└── assets/styles/           # Tailwind + custom CSS
```

## Development

### Prerequisites

- **Node.js** 18 or higher
- **Backend API** (real or mock server)

### Setup

```bash
# Install dependencies
npm install
```

### Option 1: With Mock Server (Easiest)

Start both the mock API server and Vue app together:

```bash
npm run dev:mock
```

This will:
- Start mock API server on `http://localhost:3000`
- Start Vue dev server on `http://localhost:4200`
- Auto-login as demo user
- Provide 4 years of mock media data
- Use placeholder images from Unsplash

Perfect for **frontend development without backend dependencies**.

See [mock-server/README.md](./mock-server/README.md) for details.

### Option 2: With Real Backend

```bash
# Ensure backend is running on port 3000
# Then start Vue app
npm run dev
```

### Dev Server Features

- Hot Module Replacement (HMR) for instant updates
- API proxy to backend (port 3000)
- Source maps for debugging
- TypeScript type checking
- Runs on `http://localhost:4200`

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Coverage**: 73 tests across 9 files
- Components: FileDropzone, FileList, FullsizeImage, FullsizeVideo, MediaGalleryItem
- Stores: authStore, uploadStore
- Composables: useImageWidth

### Type Checking

```bash
# Run TypeScript type checker
npm run type-check
```

### Building for Production

```bash
# Build with type checking
npm run build

# Preview production build locally
npm run preview
```

**Build Output** (`dist/` directory):
- `index.html` - Entry point
- `assets/` - Versioned JS/CSS bundles
- Code splitting: vendor chunk, dibba-tree chunk, route-based chunks

**Bundle Sizes (gzipped)**:
- Main bundle: ~17.65 KB
- Vendor chunk: ~36.18 KB
- dibba-tree: ~1.62 KB
- Route chunks: 1-4 KB each

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Vite Configuration

Key settings in `vite.config.ts`:
- **API Proxy**: Routes `/api`, `/media`, `/images`, `/video` to backend
- **Path Alias**: `@/` maps to `src/` for clean imports
- **Code Splitting**: Vendor and dibba-tree chunks
- **Build Optimizations**: Minification, tree-shaking

### Tailwind Configuration

Custom theme in `tailwind.config.js`:
- **Calendar**: 180px block width
- **Z-Index**: Layered system for overlays
- **Components**: `.btn-primary`, `.btn-secondary`, `.card`
- **Utilities**: `.scrollbar-hide`

## Architecture

### State Management (Pinia)

**mediaStore.ts**
- Loads media from backend folders
- Organizes media in dibba-tree (date hierarchy)
- Provides iterators for navigation
- Progressive loading: first year immediately, rest in background

**authStore.ts**
- User authentication state
- Google OAuth flow management
- Session persistence
- Route guard integration

**uploadStore.ts**
- Track upload progress per file
- Calculate upload speed
- Maintain upload statistics

### Composables (Reusable Logic)

**useInfiniteScroll**
- Pagination with dibba-tree iterator
- Batch loading (64 items)
- Scroll event optimization with RAF

**useKeyboardNav**
- Fullscreen viewer controls
- Arrow keys, ESC, Delete
- Event listener cleanup

**useFullscreen**
- Fullscreen API wrapper
- Cross-browser compatibility
- State management

**useImageWidth**
- Gallery zoom controls
- Responsive image sizing
- Zoom in/out functionality

### Components

19 Vue components using `<script setup>` syntax:
- **Gallery**: SimpleGallery, MediaGalleryItem
- **Calendar**: CalendarGallery, CalendarDateAxis, CalendarYearAxis, CalendarYearRow
- **Fullscreen**: FullsizeMedia, FullsizeImage, FullsizeVideo
- **Upload**: FileDropzone, FileList
- **Common**: NavigationBar, UserInfo

## Performance Optimizations

- **Route-based code splitting**: Lazy load views
- **Image lazy loading**: Native `loading="lazy"` attribute
- **Infinite scroll**: Batch loading prevents UI freezes
- **Image preloading**: Preload next/prev images in fullscreen
- **RequestAnimationFrame**: Optimized scroll handling
- **Vite build**: Tree-shaking, minification, chunk optimization

## Browser Support

- Chrome, Edge, Firefox, Safari (latest versions)
- ES2015+ support required
- Modern browsers with Proxy support

## Known Considerations

### dibba-tree Library

Using v0.9.5 of the untyped dibba-tree library for date-based media organization. A TypeScript wrapper provides type safety in `src/services/dibba-tree.ts`.

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes**: HMR updates instantly
3. **Run tests**: `npm test` (watch mode)
4. **Type check**: `npm run type-check`
5. **Build**: `npm run build`
6. **Preview**: `npm run preview`

## Deployment

1. **Build**: `npm run build` generates optimized `dist/` folder
2. **Server**: Serve static files with SPA fallback to `index.html`
3. **Backend**: No changes needed - uses existing API endpoints
4. **Environment**: Configure `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID`

## License

Private

## Version

v0.5.0
