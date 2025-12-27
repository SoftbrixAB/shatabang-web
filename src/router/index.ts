import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authGuard } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/IndexView.vue'),
    beforeEnter: authGuard,
    meta: { title: 'Gallery' }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/CalendarView.vue'),
    beforeEnter: authGuard,
    meta: { title: 'Calendar' }
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../views/UploadView.vue'),
    beforeEnter: authGuard,
    meta: { title: 'Upload' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    beforeEnter: authGuard,
    meta: { title: 'Admin' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Update document title on route change
router.afterEach((to) => {
  const title = to.meta.title as string
  document.title = title ? `${title} - Shatabang` : 'Shatabang'
})

export default router
