<template>
  <div class="admin-home">
    <div class="admin-content">
      <h1>Panel de Administración</h1>
      <h3>Caracteristicas</h3>
      <div class="buttons-container">
        <div class="buttons-sub-container">
          <button @click="showAmenidadesForm = true" class="btn btn-primary">
            Agregar Amenidad
          </button>
          <button @click="showAmenidadesList = true" class="btn btn-primary">
            Ver Amenidades
          </button>
        </div>
        <div class="buttons-sub-container">
          <button @click="showCaracteristicasInterioresForm = true" class="btn btn-primary">
            Agregar Característica Interior
          </button>
          <button @click="showCaracteristicasInterioresList = true" class="btn btn-primary">
            Ver Características Interiores
          </button>
        </div>
        <div class="buttons-sub-container">
          <button @click="showZonasDeInteresForm = true" class="btn btn-primary">
            Agregar Zona de Interés
          </button>
          <button @click="showZonasDeInteresList = true" class="btn btn-primary">
            Ver Zonas de Interés
          </button>
        </div>
      </div>
      <h3>Localizaciones</h3>
      <div class="buttons-container">
        <div class="buttons-sub-container">
          <button @click="showLocalidadesForm = true" class="btn btn-primary">
            Crear Localidad
          </button>
          <button @click="showLocalidadesList = true" class="btn btn-primary">
            Ver Localidades
          </button>
        </div>
        <div class="buttons-sub-container">
          <button @click="showBarriosForm = true" class="btn btn-primary">
            Crear Barrio
          </button>
          <button @click="showBarriosList = true" class="btn btn-primary">
            Ver Barrios
          </button>
        </div>
        <div class="buttons-sub-container">
          <button @click="showZonasForm = true" class="btn btn-primary">
            Crear Zona
          </button>
          <button @click="showZonasList = true" class="btn btn-primary">
            Ver Zonas
          </button>
        </div>
        <div class="buttons-sub-container">
          <button @click="showEdificiosForm = true" class="btn btn-primary">
            Crear Edificio
          </button>
          <button @click="showEdificiosList = true" class="btn btn-primary">
            Ver Edificios
          </button>
        </div>
      </div>
      <h3>Business </h3>
      <div class="buttons-container">
        <div class="buttons-sub-container">
          <button @click="showClientesForm = true" class="btn btn-primary">
            Crear Cliente
          </button>
          <button @click="showClientesList = true" class="btn btn-primary">
            Ver Clientes
          </button>
        </div>
        <div class="buttons-sub-container">
          <button @click="showPropiedadForm = true" class="btn btn-primary">
            Crear Propiedad
          </button>
          <button @click="showPropiedadList = true" class="btn btn-primary">
            Ver Propiedades
          </button>
        </div>
        <div class="buttons-sub-container">
          <button @click="showPedidosForm = true" class="btn btn-primary">
            Crear Pedido
          </button>
          <button @click="showPedidosList = true" class="btn btn-primary">
            Ver Pedidos
          </button>
        </div>
        <div class="buttons-sub-container">
          <button @click="showTareaForm = true" class="btn btn-primary">
            Crear Tarea
          </button>
          <button @click="showTareasList = true" class="btn btn-primary">
            Ver Tareas
          </button>
        </div>
      </div>

      <MyPopUp :visible="showAmenidadesForm" @cerrar="showAmenidadesForm = false" titulo="Agregar Amenidad">
        <AmenidadesForm @amenidad-created="handleAmenidadCreated" />
      </MyPopUp>

      <MyPopUp :visible="showAmenidadesList" @cerrar="showAmenidadesList = false" titulo="Ver Amenidades" class="popup-large">
        <AmenidadesList @amenidad-list="handleAmenidadList" />
      </MyPopUp>

      <MyPopUp :visible="showCaracteristicasInterioresForm" @cerrar="showCaracteristicasInterioresForm = false" titulo="Agregar Característica Interior">
        <CaracteristicasInterioresForm @caracteristica-interior-created="handleCaracteristicaInteriorCreated" />
      </MyPopUp>

      <MyPopUp :visible="showCaracteristicasInterioresList" @cerrar="showCaracteristicasInterioresList = false" titulo="Ver Características Interiores" class="popup-large">
        <CaracteristicasInterioresList @caracteristica-interior-list="handleCaracteristicaInteriorList" />
      </MyPopUp>

      <MyPopUp :visible="showZonasDeInteresForm" @cerrar="showZonasDeInteresForm = false" titulo="Agregar Zona de Interés">
        <ZonasDeInteresForm @zona-de-interes-created="handleZonaDeInteresCreated" />
      </MyPopUp>

      <MyPopUp :visible="showZonasDeInteresList" @cerrar="showZonasDeInteresList = false" titulo="Ver Zonas de Interés" class="popup-large">
        <ZonasDeInteresList @zona-de-interes-list="handleZonaDeInteresList" />
      </MyPopUp>

      <MyPopUp :visible="showLocalidadesForm" @cerrar="showLocalidadesForm = false" titulo="Crear Localidad">
        <LocalidadesForm @localidad-created="handleLocalidadCreated" />
      </MyPopUp>

      <MyPopUp :visible="showLocalidadesList" @cerrar="showLocalidadesList = false" titulo="Ver Localidades" class="popup-large">
        <LocalidadesList @localidad-list="handleLocalidadList" />
      </MyPopUp>

      <MyPopUp :visible="showBarriosForm" @cerrar="showBarriosForm = false" titulo="Crear Barrio">
        <BarriosForm @barrio-created="handleBarrioCreated" />
      </MyPopUp>

      <MyPopUp :visible="showBarriosList" @cerrar="showBarriosList = false" titulo="Ver Barrios" class="popup-large">
        <BarriosList @barrio-list="handleBarrioList" />
      </MyPopUp>

      <MyPopUp :visible="showZonasForm" @cerrar="showZonasForm = false" titulo="Crear Zona">
        <ZonasForm @zona-created="handleZonaCreated" />
      </MyPopUp>

      <MyPopUp :visible="showZonasList" @cerrar="showZonasList = false" titulo="Ver Zonas" class="popup-large">
        <ZonasList @zona-list="handleZonaList" />
      </MyPopUp>

      <MyPopUp :visible="showEdificiosForm" @cerrar="showEdificiosForm = false" titulo="Crear Edificio">
        <EdificiosForm @edificio-created="handleEdificioCreated" />
      </MyPopUp>

      <MyPopUp :visible="showEdificiosList" @cerrar="showEdificiosList = false" titulo="Ver Edificios" class="popup-large"> 
        <EdificiosList @edificio-list="handleEdificiosList" />
      </MyPopUp>

      <MyPopUp :visible="showClientesForm" @cerrar="showClientesForm = false" titulo="Crear Cliente">
        <ClientesForm @cliente-created="handleClienteCreated" />
      </MyPopUp>

      <MyPopUp :visible="showClientesList" @cerrar="showClientesList = false" titulo="Ver Clientes" class="popup-large">
        <ClientesList @cliente-list="handleClienteList" />
      </MyPopUp>

      <MyPopUp :visible="showPropiedadForm" @cerrar="showPropiedadForm = false" titulo="Crear Propiedad">
        <PropiedadForm @propiedad-created="handlePropiedadCreated" />
      </MyPopUp>

      <MyPopUp :visible="showPropiedadList" @cerrar="showPropiedadList = false" titulo="Ver Propiedades" class="popup-large">
        <PropiedadesList @propiedad-list="handlePropiedadList" />
      </MyPopUp>

      <MyPopUp :visible="showPedidosForm" @cerrar="showPedidosForm = false" titulo="Crear Pedido">
        <PedidosForm @pedido-created="handlePedidoCreated" />
      </MyPopUp>

      <MyPopUp :visible="showPedidosList" @cerrar="showPedidosList = false" titulo="Ver Pedidos" class="popup-large"> 
        <PedidosList @pedido-list="handlePedidoList" />
      </MyPopUp>

      <MyPopUp :visible="showTareaForm" @cerrar="showTareaForm = false" titulo="Crear Tarea">
        <TareaForm @tarea-created="handleTareaCreated" />
      </MyPopUp>

      <MyPopUp :visible="showTareasList" @cerrar="showTareasList = false" titulo="Ver Tareas" class="popup-large">
        <TareaList @tarea-list="handleTareaList" />
      </MyPopUp>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MyPopUp from '@/components/molecules/MyPopUp.vue';
import AmenidadesForm from '@/components/organisms/adminForms/AmenidadesForm.vue';
import AmenidadesList from '@/components/organisms/adminForms/AmenidadesList.vue';
import CaracteristicasInterioresForm from '@/components/organisms/adminForms/CaracteristicasInterioresForm.vue';
import CaracteristicasInterioresList from '@/components/organisms/adminForms/CaracteristicasInterioresList.vue';
import ZonasDeInteresForm from '@/components/organisms/adminForms/ZonasDeInteresForm.vue';
import ZonasDeInteresList from '@/components/organisms/adminForms/ZonasDeInteresList.vue';
import LocalidadesForm from '@/components/organisms/adminForms/LocalidadesForm.vue';
import LocalidadesList from '@/components/organisms/adminForms/LocalidadesList.vue';
import BarriosForm from '@/components/organisms/adminForms/BarriosForm.vue';
import BarriosList from '@/components/organisms/adminForms/BarriosList.vue';
import ZonasForm from '@/components/organisms/adminForms/ZonasForm.vue';
import ZonasList from '@/components/organisms/adminForms/ZonasList.vue';
import EdificiosForm from '@/components/organisms/adminForms/EdificiosForm.vue';
import EdificiosList from '@/components/organisms/adminForms/EdificiosList.vue';
import ClientesForm from '@/components/organisms/adminForms/ClientesForm.vue';
import ClientesList from '@/components/organisms/adminForms/ClientesList.vue';
import PropiedadForm from '@/components/organisms/adminForms/PropiedadForm.vue';
import PropiedadesList from '@/components/organisms/adminForms/PropiedadesList.vue';
import PedidosForm from '@/components/organisms/adminForms/PedidosForm.vue';
import PedidosList from '@/components/organisms/adminForms/PedidosList.vue';
import TareaForm from '@/components/organisms/adminForms/TareaForm.vue';
import TareaList from '@/components/organisms/adminForms/TareasList.vue';

const showAmenidadesForm = ref(false);
const showAmenidadesList = ref(false);
const showCaracteristicasInterioresForm = ref(false);
const showCaracteristicasInterioresList = ref(false);
const showZonasDeInteresForm = ref(false);
const showZonasDeInteresList = ref(false);
const showLocalidadesForm = ref(false);
const showLocalidadesList = ref(false);
const showBarriosForm = ref(false);
const showBarriosList = ref(false);
const showZonasForm = ref(false);
const showZonasList = ref(false);
const showEdificiosForm = ref(false);
const showEdificiosList = ref(false);
const showClientesForm = ref(false);
const showClientesList = ref(false);
const showPropiedadForm = ref(false);
const showPropiedadList = ref(false);
const showPedidosForm = ref(false);
const showPedidosList = ref(false);
const showTareaForm = ref(false);
const showTareasList = ref(false);
function handleAmenidadCreated(amenidad) {
    console.log('Amenidad creada:', amenidad);
    showAmenidadesForm.value = false; 
}

function handleAmenidadList(amenidadList) {
    console.log('Amenidad creada:', amenidadList);
    showAmenidadesList.value = false; 
}

function handleCaracteristicaInteriorCreated(caracteristica) {
    console.log('Característica interior creada:', caracteristica);
    showCaracteristicasInterioresForm.value = false; 
}

function handleCaracteristicaInteriorList(caracteristicaList) {
    console.log('Característica interior creada:', caracteristicaList);
    showCaracteristicasInterioresList.value = false; 
}

function handleZonaDeInteresCreated(zonaDeInteres) {
    console.log('Zona de interés creada:', zonaDeInteres);
    showZonasDeInteresForm.value = false; 
}

function handleZonaDeInteresList(zonaDeInteresList) {
    console.log('Zona de interés creada:', zonaDeInteresList);
    showZonasDeInteresList.value = false; 
}

function handleLocalidadCreated(localidad) {
    console.log('Localidad creada:', localidad);
    showLocalidadesForm.value = false; 
}

function handleLocalidadList(localidadList) {
    console.log('Localidad creada:', localidadList);
    showLocalidadesList.value = false; 
}

function handleBarrioCreated(barrio) {
    console.log('Barrio creado:', barrio);
    showBarriosForm.value = false; 
}

function handleBarrioList(barrioList) {
    console.log('Barrio creado:', barrioList);
    showBarriosList.value = false; 
}

function handleZonaCreated(zona) {
    console.log('Zona creada:', zona);
    showZonasForm.value = false; 
}

function handleZonaList(zonaList) {
    console.log('Zona creada:', zonaList);
    showZonasList.value = false; 
}

function handleEdificioCreated(edificio) {
    console.log('Edificio creado:', edificio);
    showEdificiosForm.value = false; 
} 

function handleEdificiosList(edificioList) {
    console.log('Edificio creado:', edificioList);
    showEdificiosList.value = false; 
}
function handleClienteCreated(cliente) {
    console.log('Cliente creado:', cliente);
    showClientesForm.value = false; 
}

function handleClienteList(clienteList) {
    console.log('Cliente creado:', clienteList);
    showClientesList.value = false; 
}


function handlePropiedadCreated(propiedad) {
    console.log('Propiedad creada:', propiedad);
    showPropiedadForm.value = false; 
}

function handlePropiedadList(propiedadList) {
    console.log('Propiedad creada:', propiedadList);
    showPropiedadList.value = false; 
}

function handlePedidoCreated(pedido) {
    console.log('Pedido creado:', pedido);
    showPedidosForm.value = false; 
}

function handlePedidoList(pedidoList) {
    console.log('Pedido creado:', pedidoList);
    showPedidosList.value = false; 
}

function handleTareaCreated(tarea) {
    console.log('Tarea creada:', tarea);
    showTareaForm.value = false; 
}

function handleTareaList(tareaList) {
    console.log('Tarea creada:', tareaList);
    showTareasList.value = false; 
}

</script>

<style scoped>
.admin-home {
  min-height: calc(100vh - 60px); 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.admin-content {
  text-align: center;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.buttons-sub-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border: 1px solid var(--color-primary-light);
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}


.btn {
  margin: 0 auto;
  min-width: 250px;
}

/* Estilos específicos para el popup de propiedades */
:deep(.popup-large .popup-content) {
    width: 95%;
    max-width: 1400px;
    height: 90vh;
}

:deep(.popup-large .popup-body) {
    padding: 20px;
    max-height: calc(90vh - 120px);
    overflow-y: auto;
}
</style>

