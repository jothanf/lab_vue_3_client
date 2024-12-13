import { createRouter, createWebHistory } from 'vue-router'
import AdminHome from '@/components/pages/AdminHome.vue'
import DetallesDePropiedad from '@/components/pages/DetallesDePropiedad.vue'
import ClienteDetail from '@/components/pages/ClienteDetail.vue'

const routes = [
  { path: '/admin-home', component: AdminHome },
  { path: '/cliente-detail/:id', component: ClienteDetail },
  { path: '/detalles-de-propiedad/:id', component: DetallesDePropiedad }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
