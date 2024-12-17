<template>
  <div class="amenidades-form">
    <h2>Crear Amenidad</h2>
    
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
        <label for="categoria">Categoría*:</label>
        <select 
          id="categoria" 
          v-model="formData.categoria" 
          required 
          class="form-control"
        >
          <option value="">Seleccione una categoría</option>
          <option value="recreacion">Recreación</option>
          <option value="deportes">Deportes</option>
          <option value="social">Social</option>
          <option value="servicios">Servicios</option>
          <option value="bienestar">Bienestar</option>
        </select>
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
        <label for="icono">Ícono:</label>
        <input 
          type="file" 
          id="icono" 
          @change="handleFileUpload" 
          class="form-control"
          accept="image/*"
        >
      </div>

      <button type="submit" class="btn btn-primary btn-submit">Guardar Amenidad</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'AmenidadesForm',
  data() {
    return {
      formData: {
        nombre: '',
        categoria: '',
        descripcion: '',
      },
      notification: null
    }
  },
  methods: {
    showNotification(message, type = 'success') {
      this.notification = {
        message,
        type
      };
      setTimeout(() => {
        this.notification = null;
      }, 5000);
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.icono = file; // Guardar el archivo en formData
      }
    },

    async submitForm() {
      const formDataToSend = new FormData();
      for (const key in this.formData) {
        formDataToSend.append(key, this.formData[key]);
      }

      try {
        // Validaciones básicas
        if (!this.formData.nombre || !this.formData.categoria) {
          this.showNotification('Por favor complete los campos obligatorios', 'warning');
          return;
        }

        // Enviar datos al backend usando la ruta correcta
        const response = await axios.post('/crm/amenidades/', formDataToSend);
        
        console.log('Respuesta del servidor:', response.data);
        this.showNotification('Amenidad creada exitosamente');
        
        // Limpiar el formulario
        this.resetForm();
        
        // Emitir evento para actualizar la lista de amenidades si es necesario
        this.$emit('amenidad-created', response.data);

      } catch (error) {
        console.error('Error al crear amenidad:', error);
        let errorMessage = 'Error al guardar la amenidad';
        
        if (error.response?.data) {
          errorMessage = typeof error.response.data === 'object'
            ? Object.values(error.response.data).join('\n')
            : error.response.data;
        }
        
        this.showNotification(errorMessage, 'danger');
      }
    },

    resetForm() {
      this.formData = {
        nombre: '',
        categoria: '',
        descripcion: '',
      };
    }
  }
}
</script>

<style scoped>
.amenidades-form {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.btn-submit {
  width: 100%;
  margin-top: var(--spacing-md);
}


</style>
