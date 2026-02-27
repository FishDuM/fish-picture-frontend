import { createRouter, createWebHistory } from 'vue-router'
import HomePages from '@/pages/HomePages.vue'
import AboutPages from '@/pages/AboutPages.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePages,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPages,
    },
  ],
})

export default router
