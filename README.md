# Shatabang Client (Vue 3)

A media gallery application for managing photos and videos, rebuilt from Ember to Vue 3.

## Features

- **Gallery View**: Infinite scroll gallery with date-based organization
- **Calendar Timeline**: Visual timeline showing media by year and date
- **Fullscreen Viewer**: Keyboard navigation, image preloading, delete functionality
- **File Upload**: Drag-and-drop with file examination before uploading
- **Admin Panel**: Cache management and server monitoring
- **Authentication**: Google OAuth + session management

## Tech Stack

- **Framework**: Vue 3.4 with Composition API (`<script setup>`)
- **Build Tool**: Vite 5.4
- **Language**: TypeScript 5.3 (strict mode)
- **Router**: Vue Router 4.2 (hash-based routing)
- **State Management**: Pinia 2.1
- **Styling**: Tailwind CSS 3.4
- **Testing**: Vitest 1.6 + @vue/test-utils
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/
│   ├── common/              # NavigationBar, UserInfo
│   ├── gallery/             # SimpleGallery, MediaGalleryItem
│   ├── fullsize/            # FullsizeMedia, FullsizeImage, FullsizeVideo
│   ├── calendar/            # CalendarGallery, CalendarDateAxis, CalendarYearRow
│   └── upload/              # FileDropzone, FileList
├── composables/             # Reusable logic (useInfiniteScroll, useKeyboardNav, etc.)
├── stores/                  # Pinia stores (mediaStore, authStore, uploadStore)
├── router/                  # Vue Router + auth guards
├── services/                # API client, dibba-tree wrapper
├── utils/                   # Date utilities, media utilities
├── types/                   # TypeScript definitions
├── views/                   # Route components
└── assets/styles/           # Tailwind CSS + global styles
```

## Development

### Prerequisites

- Node.js 18+
- Backend API running (for media and authentication)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server will start at `http://localhost:5173` with:
- API proxy to backend at `/api`, `/media`, `/images`, `/video`
- Hot module replacement (HMR)

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Coverage**: 73 tests across 9 test files
- Stores: authStore, uploadStore
- Composables: useImageWidth
- Components: MediaGalleryItem, FileDropzone, FileList, FullsizeImage, FullsizeVideo

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Build output goes to `dist/` directory:
- `dist/index.html` - Entry point
- `dist/assets/` - JS/CSS bundles with content hashing
- Code splitting: vendor chunk, dibba-tree chunk, route-based chunks

## Configuration

### Environment Variables

Create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Vite Config

Key configurations in `vite.config.ts`:
- API proxy configuration
- Path alias (`@/` → `src/`)
- Code splitting strategy
- Build optimizations

### Tailwind Config

Custom theme in `tailwind.config.js`:
- Calendar block width: 180px
- Z-index layers
- Custom components: `.btn-primary`, `.btn-secondary`, `.card`
- Utilities: `.scrollbar-hide`

## Migration from Ember

This application was migrated from Ember 3.10 to Vue 3.4. Key architectural changes:

### State Management
- **Before**: Ember services + controllers
- **After**: Pinia stores + composables

### Component Architecture
- **Before**: Ember components with classic patterns
- **After**: Vue 3 Composition API with `<script setup>`

### Styling
- **Before**: LESS + Bootstrap 3
- **After**: Tailwind CSS utility-first approach

### Data Layer
- **Before**: Ember Data models
- **After**: TypeScript interfaces + dibba-tree library

### Testing
- **Before**: QUnit
- **After**: Vitest + @vue/test-utils

## Known Issues

### vue-tsc Type Checker

The `vue-tsc` type checker has a compatibility issue and is excluded from the default build command. TypeScript type checking still works in the IDE and during development.

To attempt type checking manually:
```bash
npm run type-check
```

### dibba-tree Library

Using v0.9.5 of dibba-tree (untyped library). A TypeScript wrapper is provided in `src/services/dibba-tree.ts`.

## Performance

### Optimization Strategies
- Route-based code splitting
- Image lazy loading with `loading="lazy"`
- Infinite scroll with batch loading (64 items)
- Image preloading for fullscreen viewer
- Virtual scrolling (can be added if needed)

### Bundle Sizes (gzipped)
- Main bundle: ~17.65 KB
- Vendor chunk: ~36.18 KB
- dibba-tree: ~1.62 KB
- Route chunks: 1-4 KB each

## Browser Support

- Modern browsers with ES2015+ support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

Private

## Version

v0.5.0 - Vue 3 Migration Complete
