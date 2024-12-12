<template>
  <div class="localidades-form">
    <h2>Crear Localidad</h2>
    
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

      <button type="submit" class="btn btn-primary btn-submit">Guardar Localidad</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'LocalidadesForm',
  data() {
    return {
      formData: {
        nombre: '',
        sigla: '',
        descripcion: '',
      },
      notification: null
    }
  },
  methods: {
    showNotification(message) {
      alert(message); // Usar alert para mostrar la notificación
    },

    toUpperCase(field) {
      this.formData[field] = this.formData[field].toUpperCase();
    },

    async submitForm() {
      try {
        // Validaciones básicas
        if (!this.formData.nombre) {
          this.showNotification('Por favor complete el campo obligatorio');
          return;
        }

        // Enviar datos al backend usando la ruta correcta
        const response = await axios.post('http://localhost:8000/crm/localidades/', this.formData);
        
        // Mostrar alert de éxito
        this.showNotification('Localidad creada exitosamente');
        
        // Limpiar el formulario
        this.resetForm();
        
        // Emitir evento para actualizar la lista de localidades si es necesario
        this.$emit('localidad-created', response.data);

      } catch (error) {
        console.error('Error al crear localidad:', error);
        let errorMessage = 'Error al guardar la localidad';
        
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
      };
    }
  }
}
</script>

<style scoped>
.localidades-form {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.btn-submit {
  width: 100%;
  margin-top: var(--spacing-md);
}
</style>
