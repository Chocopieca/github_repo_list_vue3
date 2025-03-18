import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/pages/AuthCallback.vue'),
    },
  ],
})

export default router
