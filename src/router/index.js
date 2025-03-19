import { createRouter, createWebHistory } from 'vue-router'
import AdminHome from '@/components/pages/AdminHome.vue'
import DetallesDePropiedad from '@/components/pages/DetallesDePropiedad.vue'
import ClienteDetail from '@/components/pages/ClienteDetail.vue'
import DetallesPedido from '@/components/pages/DetallesPedido.vue'
import DetallesTarea from '@/components/pages/DetallesTarea.vue'
import DetallesLocalidad from '@/components/pages/DetallesLocalidad.vue'
import DetallesBarrio from '@/components/pages/DetallesBarrio.vue'
import DetallesEdificio from '@/components/pages/DetallesEdificio.vue'
import DetallesPuntoDeInteres from '@/components/pages/DetallesDePuntoDeInteres.vue'
import DetallesZonaDeInteres from '@/components/pages/DetallesZonaDeInteres.vue'
import DetallesAmenidades from '@/components/pages/DetallesAmenidades.vue'
import DetallesCaracteristicasInteriores from '@/components/pages/DetallesCaracteristicasInteriores.vue'
import DetallesPropiedad from '@/components/pages/DetallesDePropiedad.vue'
import { useAppStore } from '@/store'
import ClienteHome from '@/components/pages/ClienteHome.vue'
import CalendarioCliente from '@/components/pages/CalendarioCliente.vue'
import RequerimientoAgent from '@/components/pages/RequerimientoAgent.vue'
import PropiedadAgent from '@/components/pages/PropiedadAgent.vue'
import AgendaAbierta from '@/components/pages/AgendaAbierta.vue'
import AgenteAgenda from '@/components/pages/AgenteAgenda.vue'
const routes = [
  { path: '/admin-home', component: AdminHome },
  { path: '/cliente-home', component: ClienteHome },
  { path: '/cliente-detail/:id', component: ClienteDetail },
  { path: '/detalles-de-propiedad/:id', component: DetallesDePropiedad },
  { path: '/detalles-de-pedido/:id', component: DetallesPedido },
  { path: '/detalles-de-tarea/:id', component: DetallesTarea },
  { path: '/detalles-de-localidad/:id', component: DetallesLocalidad },
  { path: '/detalles-de-barrio/:id', component: DetallesBarrio },
  { path: '/detalles-de-edificio/:id', component: DetallesEdificio},
  { path: '/detalles-de-zona/:id', component: DetallesZonaDeInteres },
  { path: '/detalles-de-punto-de-interes/:id', component: DetallesPuntoDeInteres },
  { path: '/detalles-de-zona-de-interes/:id', component: DetallesZonaDeInteres },
  { path: '/detalles-de-amenidades/:id', component: DetallesAmenidades },
  { path: '/detalles-de-caracteristicas-interiores/:id', component: DetallesCaracteristicasInteriores },
  { path: '/detalles-de-propiedad/:id', component: DetallesPropiedad },
  { path: '/calendario-cliente', component: CalendarioCliente },
  { path: '/requerimiento-agent', component: RequerimientoAgent },
  { path: '/propiedad-agent', component: PropiedadAgent },
  { path: '/agenda-abierta', component: AgendaAbierta },
  { path: '/agente-agenda', component: AgenteAgenda },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const updateStoreContext = (to, store) => {
  // Determinar la sección basada en la ruta
  let section = '';
  let context = {};

  if (to.path.includes('localidad')) {
    section = 'localidad';
    context = {
      type: 'localidad',
      description: 'Información sobre localidades y sus características',
      capabilities: ['zonas_interes', 'puntos_interes', 'propiedades', 'edificios', 'barrios']
    };
  } else if (to.path.includes('edificio')) {
    section = 'edificio';
    context = {
      type: 'edificio',
      description: 'Información específica del edificio y su entorno',
      capabilities: ['amenidades', 'propiedades', 'barrio', 'zona']
    };
  } else if (to.path.includes('propiedad')) {
    section = 'propiedad';
    context = {
      type: 'propiedad',
      description: 'Información detallada de la propiedad',
      capabilities: ['venta', 'caracteristicas', 'amenidades', 'ubicacion']
    };
  }
  // ... más condiciones según tus rutas

  store.setCurrentSection(section);
  store.setContext(context);
};

router.beforeEach((to, from, next) => {
  const store = useAppStore();
  store.setCurrentRoute(to.path);
  updateStoreContext(to, store);
  store.addToHistory({
    from: from.path,
    to: to.path,
    timestamp: new Date()
  });
  next();
});

export default router
