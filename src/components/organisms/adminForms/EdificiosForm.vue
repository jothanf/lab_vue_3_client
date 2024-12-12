<template>
  <div class="edificios-form">
    <h2>Crear Edificio</h2>
    
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
        <label for="desarrollador">Desarrollador:</label>
        <input 
          type="text" 
          id="desarrollador" 
          v-model="formData.desarrollador" 
          class="form-control"
          maxlength="100"
        >
      </div>

      <div class="form-group">
        <label for="barrio">Barrio*:</label>
        <select 
          id="barrio" 
          v-model="formData.barrio" 
          required 
          class="form-control"
        >
          <option value="">Seleccione un barrio</option>
          <option v-for="barrio in barrios" :key="barrio.id" :value="barrio.id">
            {{ barrio.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="direccion">Dirección:</label>
        <input 
          type="text" 
          id="direccion" 
          v-model="formData.direccion" 
          class="form-control"
          maxlength="200"
        >
      </div>

      <div class="form-group">
        <label for="estrato">Estrato:</label>
        <input 
          type="number" 
          id="estrato" 
          v-model="formData.estrato" 
          class="form-control"
          min="1" 
          max="6"
        >
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono:</label>
        <input 
          type="text" 
          id="telefono" 
          v-model="formData.telefono" 
          class="form-control"
          maxlength="20"
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

      <button type="submit" class="btn btn-primary btn-submit">Guardar Edificio</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'EdificiosForm',
  data() {
    return {
      formData: {
        nombre: '',
        sigla: '',
        desarrollador: '',
        barrio: '',
        direccion: '',
        estrato: null,
        telefono: '',
        descripcion: '',
      },
      barrios: [],
      notification: null
    }
  },
  created() {
    this.fetchBarrios();
  },
  methods: {
    showNotification(message) {
      alert(message); // Usar alert para mostrar la notificación
    },

    toUpperCase(field) {
      this.formData[field] = this.formData[field].toUpperCase();
    },

    async fetchBarrios() {
      try {
        const response = await axios.get('/crm/barrio/');
        this.barrios = response.data; // Asignar los barrios obtenidos
      } catch (error) {
        console.error('Error al obtener barrios:', error);
        this.showNotification('Error al cargar los barrios');
      }
    },

    async submitForm() {
      try {
        // Validaciones básicas
        if (!this.formData.nombre || !this.formData.barrio) {
          this.showNotification('Por favor complete los campos obligatorios');
          return;
        }

        // Enviar datos al backend usando la ruta correcta
        const response = await axios.post('http://localhost:8000/crm/edificios/', this.formData);
        
        // Mostrar alert de éxito
        this.showNotification('Edificio creado exitosamente');
        
        // Limpiar el formulario
        this.resetForm();
        
        // Emitir evento para actualizar la lista de edificios si es necesario
        this.$emit('edificio-created', response.data);

      } catch (error) {
        console.error('Error al crear edificio:', error);
        let errorMessage = 'Error al guardar el edificio';
        
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
        desarrollador: '',
        barrio: '',
        direccion: '',
        estrato: null,
        telefono: '',
        descripcion: '',
      };
    }
  }
}
</script>

<style scoped>
.edificios-form {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.btn-submit {
  width: 100%;
  margin-top: var(--spacing-md);
}
</style>
