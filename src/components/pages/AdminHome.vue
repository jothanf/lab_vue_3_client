<template>
  <div>
    <h1>Panel de Administración</h1>
    <p>Bienvenido al panel de administración.</p>
    
    <!-- Botón para abrir el formulario de amenidades -->
    <button @click="showAmenidadesForm = true" class="btn btn-primary">Agregar Amenidad</button>

    <!-- Mostrar el formulario de amenidades si está visible -->
    <AmenidadesForm v-if="showAmenidadesForm" @amenidad-created="handleAmenidadCreated" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AmenidadesForm from '@/components/organisms/adminForms/AmenidadesForm.vue';

const showAmenidadesForm = ref(false);

function handleAmenidadCreated(amenidad) {
    // Lógica para manejar la creación de una amenidad
    console.log('Amenidad creada:', amenidad);
    showAmenidadesForm.value = false; // Cerrar el formulario después de crear
}
</script>

<style>
/* Estilos adicionales si es necesario */
</style>

