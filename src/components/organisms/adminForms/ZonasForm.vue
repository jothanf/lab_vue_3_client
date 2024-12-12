<template>
  <div>
    <h1>Crear Zona</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" v-model="zona.nombre" id="nombre" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="sigla">Sigla</label>
        <input type="text" v-model="zona.sigla" id="sigla" class="form-control" />
      </div>
      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea v-model="zona.descripcion" id="descripcion" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label for="tipo_zona">Tipo de Zona</label>
        <input type="text" v-model="zona.tipo_zona" id="tipo_zona" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="barrios">Barrios</label>
        <select v-model="zona.barrios" id="barrios" multiple class="form-control">
          <option v-for="barrio in barrios" :key="barrio.id" :value="barrio.id">{{ barrio.nombre }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Guardar</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  data() {
    return {
      zona: {
        nombre: '',
        sigla: '',
        descripcion: '',
        tipo_zona: '',
        barrios: []
      },
      barrios: [] // Aquí se cargarán los barrios desde la API
    };
  },
  created() {
    this.loadBarrios(); // Cargar los barrios al crear el componente
  },
  methods: {
    async loadBarrios() {
      try {
        const response = await axios.get('/crm/barrio/');
        this.barrios = response.data;
      } catch (error) {
        console.error('Error al obtener barrios:', error);
      }
    },
    async submitForm() {
      try {
        // Validaciones básicas
        if (!this.zona.nombre || !this.zona.tipo_zona || this.zona.barrios.length === 0) {
          alert('Por favor complete todos los campos obligatorios');
          return;
        }

        // Enviar datos al backend
        const response = await axios.post('/crm/zona/', this.zona);
        
        // Mostrar mensaje de éxito
        alert('Zona creada exitosamente');
        
        // Limpiar el formulario
        this.resetForm();
        
        // Emitir evento para actualizar la lista de zonas si es necesario
        this.$emit('zona-created', response.data);
      } catch (error) {
        console.error('Error al crear zona:', error);
        alert('Error al guardar la zona');
      }
    },
    resetForm() {
      this.zona = {
        nombre: '',
        sigla: '',
        descripcion: '',
        tipo_zona: '',
        barrios: [] // Reiniciar la selección de barrios
      };
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para ZonasForm */
</style>
