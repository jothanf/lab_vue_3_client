<template>
  <div class="admin-home">
    <div class="admin-content">
      <h1>Panel de Administración</h1>
      <h3>Caracteristicas</h3>
      <div class="buttons-container">
        <button @click="showAmenidadesForm = true" class="btn btn-primary">
          Agregar Amenidad
        </button>
        <button @click="showCaracteristicasInterioresForm = true" class="btn btn-primary">
          Agregar Característica Interior
        </button>
        <button @click="showZonasDeInteresForm = true" class="btn btn-primary">
          Agregar Zona de Interés
        </button>
      </div>
      <h3>Localizaciones</h3>
      <div class="buttons-container">
        <button @click="showLocalidadesForm = true" class="btn btn-primary">
          Crear Localidad
        </button>
        <button @click="showBarriosForm = true" class="btn btn-primary">
          Crear Barrio
        </button>
        <button @click="showZonasForm = true" class="btn btn-primary">
          Crear Zona
        </button>
        <button @click="showEdificiosForm = true" class="btn btn-primary">
          Crear Edificio
        </button>
      </div>
      <h3>Business  </h3>
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
        </div>
      </div>

      <!-- MyPopUp para mostrar el formulario de amenidades -->
      <MyPopUp :visible="showAmenidadesForm" @cerrar="showAmenidadesForm = false" titulo="Agregar Amenidad">
        <AmenidadesForm @amenidad-created="handleAmenidadCreated" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el formulario de características interiores -->
      <MyPopUp :visible="showCaracteristicasInterioresForm" @cerrar="showCaracteristicasInterioresForm = false" titulo="Agregar Característica Interior">
        <CaracteristicasInterioresForm @caracteristica-interior-created="handleCaracteristicaInteriorCreated" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el formulario de zonas de interés -->
      <MyPopUp :visible="showZonasDeInteresForm" @cerrar="showZonasDeInteresForm = false" titulo="Agregar Zona de Interés">
        <ZonasDeInteresForm @zona-de-interes-created="handleZonaDeInteresCreated" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el formulario de localidades -->
      <MyPopUp :visible="showLocalidadesForm" @cerrar="showLocalidadesForm = false" titulo="Crear Localidad">
        <LocalidadesForm @localidad-created="handleLocalidadCreated" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el formulario de barrios -->
      <MyPopUp :visible="showBarriosForm" @cerrar="showBarriosForm = false" titulo="Crear Barrio">
        <BarriosForm @barrio-created="handleBarrioCreated" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el formulario de zonas -->
      <MyPopUp :visible="showZonasForm" @cerrar="showZonasForm = false" titulo="Crear Zona">
        <ZonasForm @zona-created="handleZonaCreated" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el formulario de edificios -->
      <MyPopUp :visible="showEdificiosForm" @cerrar="showEdificiosForm = false" titulo="Crear Edificio">
        <EdificiosForm @edificio-created="handleEdificioCreated" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el formulario de clientes -->
      <MyPopUp :visible="showClientesForm" @cerrar="showClientesForm = false" titulo="Crear Cliente">
        <ClientesForm @cliente-created="handleClienteCreated" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el listado de clientes -->
      <MyPopUp :visible="showClientesList" @cerrar="showClientesList = false" titulo="Ver Clientes">
        <ClientesList @cliente-list="handleClienteList" />
      </MyPopUp>

      <!-- MyPopUp para mostrar el formulario de propiedades -->
      <MyPopUp :visible="showPropiedadForm" @cerrar="showPropiedadForm = false" titulo="Crear Propiedad">
        <PropiedadForm @propiedad-created="handlePropiedadCreated" />
      </MyPopUp>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MyPopUp from '@/components/molecules/MyPopUp.vue';
import AmenidadesForm from '@/components/organisms/adminForms/AmenidadesForm.vue';
import CaracteristicasInterioresForm from '@/components/organisms/adminForms/CaracteristicasInterioresForm.vue';
import ZonasDeInteresForm from '@/components/organisms/adminForms/ZonasDeInteresForm.vue';
import LocalidadesForm from '@/components/organisms/adminForms/LocalidadesForm.vue';
import BarriosForm from '@/components/organisms/adminForms/BarriosForm.vue';
import ZonasForm from '@/components/organisms/adminForms/ZonasForm.vue';
import EdificiosForm from '@/components/organisms/adminForms/EdificiosForm.vue';
import ClientesForm from '@/components/organisms/adminForms/ClientesForm.vue';
import ClientesList from '@/components/organisms/adminForms/ClientesList.vue';
import PropiedadForm from '@/components/organisms/adminForms/PropiedadForm.vue';

const showAmenidadesForm = ref(false);
const showCaracteristicasInterioresForm = ref(false);
const showZonasDeInteresForm = ref(false);
const showLocalidadesForm = ref(false);
const showBarriosForm = ref(false);
const showZonasForm = ref(false);
const showEdificiosForm = ref(false);
const showClientesForm = ref(false);
const showClientesList = ref(false);
const showPropiedadForm = ref(false);

function handleAmenidadCreated(amenidad) {
    console.log('Amenidad creada:', amenidad);
    showAmenidadesForm.value = false; 
}

function handleCaracteristicaInteriorCreated(caracteristica) {
    console.log('Característica interior creada:', caracteristica);
    showCaracteristicasInterioresForm.value = false; 
}

function handleZonaDeInteresCreated(zonaDeInteres) {
    console.log('Zona de interés creada:', zonaDeInteres);
    showZonasDeInteresForm.value = false; 
}

function handleLocalidadCreated(localidad) {
    console.log('Localidad creada:', localidad);
    showLocalidadesForm.value = false; 
}

function handleBarrioCreated(barrio) {
    console.log('Barrio creado:', barrio);
    showBarriosForm.value = false; 
}

function handleZonaCreated(zona) {
    console.log('Zona creada:', zona);
    showZonasForm.value = false; 
}

function handleEdificioCreated(edificio) {
    console.log('Edificio creado:', edificio);
    showEdificiosForm.value = false; 
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
</style>

