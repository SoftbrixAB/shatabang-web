import express from 'express'
import session from 'express-session'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(express.json())
app.use(session({
  secret: 'mock-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

// File upload configuration
const upload = multer({ dest: path.join(__dirname, 'uploads') })

// Mock user data
const mockUser = {
  id: 'user-123',
  username: 'demo',
  displayName: 'Demo User',
  email: 'demo@example.com'
}

// Mock media data - organized by year
const mockMediaYears = ['2024', '2023', '2022', '2021']

const generateMockMedia = (year, count = 20) => {
  const media = []
  for (let i = 0; i < count; i++) {
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    const isVideo = Math.random() > 0.8

    media.push({
      fileName: isVideo ? `video_${year}_${i}.mp4` : `photo_${year}_${i}.jpg`,
      date: `${year}-${month}-${day}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`,
      isVideo: isVideo,
      isImage: !isVideo,
      img: `${year}/${month}/${isVideo ? 'video' : 'photo'}_${year}_${i}_thumb.jpg`,
      bigMedia: isVideo ? `/video/${year}/${month}/video_${year}_${i}.mp4` : `/images/full/${year}/${month}/photo_${year}_${i}.jpg`,
      downloadUrl: `/media/${year}/${month}/${isVideo ? 'video' : 'photo'}_${year}_${i}.${isVideo ? 'mp4' : 'jpg'}`
    })
  }
  return media
}

// ====================
// Authentication Routes
// ====================

// Google OAuth mock
app.get('/api/auth/google', (req, res) => {
  // Mock successful Google authentication
  req.session.user = mockUser
  // Redirect back to app
  res.redirect('http://localhost:4200/#/')
})

// Get current user
app.get('/api/users/me', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user)
  } else {
    res.status(401).json({ error: 'Not authenticated' })
  }
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy()
  res.json({ message: 'Logged out' })
})

// ====================
// Media Routes
// ====================

// Get list of media folders/years
app.get('/api/dirs/list', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  res.json(mockMediaYears)
})

// Get media for a specific year
app.get('/api/dirs/:year', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const { year } = req.params
  if (!mockMediaYears.includes(year)) {
    return res.status(404).json({ error: 'Year not found' })
  }

  const media = generateMockMedia(year)
  res.json(media)
})

// ====================
// Upload Routes
// ====================

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500))

  res.json({
    message: 'File uploaded successfully',
    file: {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  })
})

// ====================
// Admin Routes
// ====================

app.get('/api/version', (req, res) => {
  res.json({ version: 'Mock Server v1.0.0' })
})

app.post('/api/images/rebuild', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Simulate cache rebuild
  setTimeout(() => {
    console.log('Mock cache rebuild completed')
  }, 2000)

  res.json({ message: 'Cache rebuild started' })
})

// ====================
// Media File Routes
// ====================

// Serve placeholder images
app.get('/images/:size/:year/:month/:filename', async (req, res) => {
  const { size, year, month, filename } = req.params

  // Generate a placeholder image URL from a service
  const width = size === 'full' ? 1920 : parseInt(size) || 200
  const height = Math.floor(width * 0.75)
  const seed = `${year}${month}${filename}`

  // Redirect to a placeholder service
  res.redirect(`https://picsum.photos/seed/${seed}/${width}/${height}`)
})

// Serve placeholder videos
app.get('/video/:year/:month/:filename', (req, res) => {
  const { year, month, filename } = req.params

  // For video, we'll return a small sample video URL
  res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
})

// Serve media downloads
app.get('/media/:year/:month/:filename', (req, res) => {
  const { year, month, filename } = req.params

  if (filename.endsWith('.mp4')) {
    res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')
  } else {
    const seed = `${year}${month}${filename}`
    res.redirect(`https://picsum.photos/seed/${seed}/1920/1080`)
  }
})

// Arena queue dashboard (placeholder)
app.get('/arena', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Arena Queue Dashboard (Mock)</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        p { color: #666; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🎯 Arena Queue Dashboard</h1>
        <p>This is a mock queue dashboard. In production, this would show background job queues.</p>
        <p><strong>Current Status:</strong> All systems operational</p>
        <p><strong>Active Jobs:</strong> 0</p>
        <p><strong>Completed Jobs:</strong> 42</p>
      </div>
    </body>
    </html>
  `)
})

// ====================
// Health Check
// ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// ====================
// Start Server
// ====================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  🚀 Mock Server Running                                   ║
║                                                           ║
║  Port:        http://localhost:${PORT}                        ║
║  Health:      http://localhost:${PORT}/health                ║
║  Arena:       http://localhost:${PORT}/arena                 ║
║                                                           ║
║  Mock User:   demo@example.com                            ║
║  Session:     In-memory (resets on restart)               ║
║                                                           ║
║  📸 Media:    ${mockMediaYears.length} years of mock data                    ║
║  🔐 Auth:     Automatic login on /api/auth/google         ║
║                                                           ║
║  ✨ Ready for frontend development!                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)

  console.log('\n📋 Available Endpoints:')
  console.log('   GET  /api/users/me           - Current user')
  console.log('   GET  /api/auth/google        - Login (auto-succeeds)')
  console.log('   POST /api/auth/logout        - Logout')
  console.log('   GET  /api/dirs/list          - Media years')
  console.log('   GET  /api/dirs/:year         - Media for year')
  console.log('   POST /api/upload             - Upload file')
  console.log('   GET  /api/version            - Server version')
  console.log('   POST /api/images/rebuild     - Rebuild cache')
  console.log('   GET  /images/:size/*         - Thumbnail images')
  console.log('   GET  /video/*                - Video files')
  console.log('   GET  /media/*                - Media downloads')
  console.log('   GET  /arena                  - Queue dashboard')
  console.log('\n💡 Tip: Start the Vue app with: npm run dev')
  console.log('')
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})
