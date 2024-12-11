import { createRouter, createWebHistory } from 'vue-router'
import AdminHome from '@/components/pages/AdminHome.vue'

const routes = [
  { path: '/admin-home', component: AdminHome }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
