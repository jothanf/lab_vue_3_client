<template>
  <div class="barrios-form">
    <h2>Crear Barrio</h2>
    
    <!-- Notificaciones -->
    <div v-if="notification" :class="['alert', `alert-${notification.type}`]">
      {{ notification.message }}
    </div>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="nombre">Nombre*:</label>
        <input 
          type="text" 
          id="nombre" 
          v-model="formData.nombre" 
          required 
          class="form-control"
          maxlength="100"
        >
      </div>

      <div class="form-group">
        <label for="sigla">Sigla:</label>
        <input 
          type="text" 
          id="sigla" 
          v-model="formData.sigla" 
          class="form-control"
          maxlength="10"
          @input="toUpperCase('sigla')"
        >
      </div>

      <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea 
          id="descripcion" 
          v-model="formData.descripcion" 
          class="form-control" 
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="localidad">Localidad*:</label>
        <select 
          id="localidad" 
          v-model="formData.localidad" 
          required 
          class="form-control"
        >
          <option value="">Seleccione una localidad</option>
          <option v-for="localidad in localidades" :key="localidad.id" :value="localidad.id">
            {{ localidad.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="estrato_predominante">Estrato Predominante:</label>
        <input 
          type="number" 
          id="estrato_predominante" 
          v-model="formData.estrato_predominante" 
          class="form-control"
          min="1" 
          max="6"
        >
      </div>

      <div class="form-group">
        <label for="tipo_barrio">Tipo de Barrio*:</label>
        <select 
          id="tipo_barrio" 
          v-model="formData.tipo_barrio" 
          required 
          class="form-control"
        >
          <option value="residencial">Residencial</option>
          <option value="comercial">Comercial</option>
          <option value="mixta">Mixta</option>
          <option value="industrial">Industrial</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary btn-submit">Guardar Barrio</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'BarriosForm',
  data() {
    return {
      formData: {
        nombre: '',
        sigla: '',
        descripcion: '',
        localidad: '',
        estrato_predominante: null,
        tipo_barrio: 'residencial',
      },
      localidades: [],
      notification: null
    }
  },
  created() {
    this.fetchLocalidades();
  },
  methods: {
    showNotification(message) {
      alert(message); // Usar alert para mostrar la notificación
    },

    toUpperCase(field) {
      this.formData[field] = this.formData[field].toUpperCase();
    },

    async fetchLocalidades() {
      try {
        const response = await axios.get('http://localhost:8000/crm/localidades/');
        this.localidades = response.data; // Asignar las localidades obtenidas
      } catch (error) {
        console.error('Error al obtener localidades:', error);
        this.showNotification('Error al cargar las localidades');
      }
    },

    async submitForm() {
      try {
        // Validaciones básicas
        if (!this.formData.nombre || !this.formData.localidad) {
          this.showNotification('Por favor complete los campos obligatorios');
          return;
        }

        // Enviar datos al backend usando la ruta correcta
        const response = await axios.post('http://localhost:8000/crm/barrio/', this.formData);
        
        // Mostrar alert de éxito
        this.showNotification('Barrio creado exitosamente');
        
        // Limpiar el formulario
        this.resetForm();
        
        // Emitir evento para actualizar la lista de barrios si es necesario
        this.$emit('barrio-created', response.data);

      } catch (error) {
        console.error('Error al crear barrio:', error);
        let errorMessage = 'Error al guardar el barrio';
        
        if (error.response?.data) {
          errorMessage = typeof error.response.data === 'object'
            ? Object.values(error.response.data).join('\n')
            : error.response.data;
        }
        
        // Mostrar alert de error
        this.showNotification(errorMessage);
      }
    },

    resetForm() {
      this.formData = {
        nombre: '',
        sigla: '',
        descripcion: '',
        localidad: '',
        estrato_predominante: null,
        tipo_barrio: 'residencial',
      };
    }
  }
}
</script>

<style scoped>
.barrios-form {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.btn-submit {
  width: 100%;
  margin-top: var(--spacing-md);
}
</style> 