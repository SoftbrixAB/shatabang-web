<template>
  <div class="login-container">
    <!-- Background image -->
    <div class="background-image"></div>

    <!-- Overlay -->
    <div class="overlay"></div>

    <!-- Login card -->
    <div class="login-content">
      <div class="album-card">
        <!-- Photo album corner decorations -->
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>

        <!-- Album title -->
        <div class="album-header">
          <div class="polaroid-icon">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="album-title">Shatabang</h1>
          <p class="album-subtitle">Your Personal Photo Gallery</p>
        </div>

        <!-- Error message -->
        <div v-if="error" class="error-message">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ error }}
        </div>

        <!-- Sign in button -->
        <button
          @click="loginWithGoogle"
          class="google-signin-btn"
          :disabled="loading"
        >
          <svg v-if="!loading" class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span v-if="loading">Authenticating...</span>
          <span v-else>Sign in with Google</span>
        </button>

        <!-- Description -->
        <p class="album-description">
          Sign in to view and manage your memories
        </p>

        <!-- Decorative photo frame -->
        <div class="photo-frames">
          <div class="frame frame-1"></div>
          <div class="frame frame-2"></div>
          <div class="frame frame-3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref<string | null>(null)

// Check if already authenticated
onMounted(async () => {
  if (authStore.isAuthenticated) {
    // Already logged in, redirect to intended destination or home
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  }
})

function loginWithGoogle() {
  loading.value = true
  error.value = null

  // Redirect to Google OAuth endpoint
  window.location.href = '/api/auth/google'
}
</script>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Background image with photo gallery feel */
.background-image {
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: subtle-zoom 20s ease-in-out infinite alternate;
}

@keyframes subtle-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

/* Dark overlay for readability */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  backdrop-filter: blur(2px);
}

.login-content {
  position: relative;
  z-index: 10;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
}

/* Album-style card */
.album-card {
  position: relative;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(250, 250, 250, 0.95) 100%
  );
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 0 40px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(139, 92, 46, 0.3);
}

/* Photo album corner decorations */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(139, 92, 46, 0.6);
}

.corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

/* Album header */
.album-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.polaroid-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.album-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-family: 'Georgia', serif;
  letter-spacing: -0.5px;
}

.album-subtitle {
  font-size: 1.125rem;
  color: #718096;
  font-weight: 500;
  font-style: italic;
}

/* Error message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #c53030;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

/* Google sign in button */
.google-signin-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: white;
  color: #374151;
  font-weight: 600;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.google-signin-btn:not(:disabled):hover {
  background: #f9fafb;
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.google-signin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Description */
.album-description {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 1.5rem;
  font-style: italic;
}

/* Decorative photo frames */
.photo-frames {
  position: absolute;
  inset: -10px;
  pointer-events: none;
}

.frame {
  position: absolute;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  opacity: 0.15;
}

.frame-1 {
  width: 60px;
  height: 80px;
  top: -20px;
  right: -30px;
  transform: rotate(15deg);
}

.frame-2 {
  width: 70px;
  height: 90px;
  bottom: -25px;
  left: -35px;
  transform: rotate(-12deg);
}

.frame-3 {
  width: 50px;
  height: 70px;
  top: 50%;
  right: -40px;
  transform: translateY(-50%) rotate(8deg);
}

/* Responsive */
@media (max-width: 640px) {
  .login-content {
    padding: 1rem;
  }

  .album-card {
    padding: 2rem 1.5rem;
  }

  .album-title {
    font-size: 2rem;
  }

  .polaroid-icon {
    width: 64px;
    height: 64px;
  }

  .photo-frames {
    display: none;
  }
}
</style>
