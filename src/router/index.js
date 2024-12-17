import { createRouter, createWebHistory } from 'vue-router'
import AdminHome from '@/components/pages/AdminHome.vue'
import DetallesDePropiedad from '@/components/pages/DetallesDePropiedad.vue'
import ClienteDetail from '@/components/pages/ClienteDetail.vue'
import DetallesPedido from '@/components/pages/DetallesPedido.vue'
import DetallesTarea from '@/components/pages/DetallesTarea.vue'
import DetallesLocalidad from '@/components/pages/DetallesLocalidad.vue'
import DetallesBarrio from '@/components/pages/DetallesBarrio.vue'
import DetallesEdificio from '@/components/pages/DetallesEdificio.vue'
import DetallesZonaDeInteres from '@/components/pages/DetallesZonaDeInteres.vue'
import DetallesAmenidades from '@/components/pages/DetallesAmenidades.vue'
import DetallesCaracteristicasInteriores from '@/components/pages/DetallesCaracteristicasInteriores.vue'
import DetallesPropiedad from '@/components/pages/DetallesDePropiedad.vue'

const routes = [
  { path: '/admin-home', component: AdminHome },
  { path: '/cliente-detail/:id', component: ClienteDetail },
  { path: '/detalles-de-propiedad/:id', component: DetallesDePropiedad },
  { path: '/detalles-de-pedido/:id', component: DetallesPedido },
  { path: '/detalles-de-tarea/:id', component: DetallesTarea },
  { path: '/detalles-de-localidad/:id', component: DetallesLocalidad },
  { path: '/detalles-de-barrio/:id', component: DetallesBarrio },
  { path: '/detalles-de-edificio/:id', component: DetallesEdificio},
  { path: '/detalles-de-zona/:id', component: DetallesZonaDeInteres },
  { path: '/detalles-de-zona-de-interes/:id', component: DetallesZonaDeInteres },
  { path: '/detalles-de-amenidades/:id', component: DetallesAmenidades },
  { path: '/detalles-de-caracteristicas-interiores/:id', component: DetallesCaracteristicasInteriores },
  { path: '/detalles-de-propiedad/:id', component: DetallesPropiedad },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
