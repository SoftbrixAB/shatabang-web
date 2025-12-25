<template>
  <nav class="bg-white shadow-md border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo / Brand -->
        <div class="flex items-center gap-6">
          <router-link to="/" class="text-xl font-bold text-gray-800 hover:text-gray-600">
            Shatabang
          </router-link>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-1">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'active': $route.name === 'index' }"
            >
              Gallery
            </router-link>
            <router-link
              to="/calendar"
              class="nav-link"
              :class="{ 'active': $route.name === 'calendar' }"
            >
              Calendar
            </router-link>
            <router-link
              to="/upload"
              class="nav-link"
              :class="{ 'active': $route.name === 'upload' }"
            >
              Upload
            </router-link>
            <router-link
              to="/admin"
              class="nav-link"
              :class="{ 'active': $route.name === 'admin' }"
            >
              Admin
            </router-link>
          </div>
        </div>

        <!-- User Info -->
        <UserInfo />
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden pb-3 flex gap-2 overflow-x-auto">
        <router-link
          to="/"
          class="nav-link-mobile"
          :class="{ 'active': $route.name === 'index' }"
        >
          Gallery
        </router-link>
        <router-link
          to="/calendar"
          class="nav-link-mobile"
          :class="{ 'active': $route.name === 'calendar' }"
        >
          Calendar
        </router-link>
        <router-link
          to="/upload"
          class="nav-link-mobile"
          :class="{ 'active': $route.name === 'upload' }"
        >
          Upload
        </router-link>
        <router-link
          to="/admin"
          class="nav-link-mobile"
          :class="{ 'active': $route.name === 'admin' }"
        >
          Admin
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import UserInfo from './UserInfo.vue'
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors;
}

.nav-link.active {
  @apply bg-gray-200 text-gray-900;
}

.nav-link-mobile {
  @apply px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors whitespace-nowrap;
}

.nav-link-mobile.active {
  @apply bg-gray-200 text-gray-900;
}
</style>
