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

      <button type="submit" class="btn btn-primary">Guardar Amenidad</button>
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

    async submitForm() {
      try {
        // Validaciones básicas
        if (!this.formData.nombre || !this.formData.categoria) {
          this.showNotification('Por favor complete los campos obligatorios', 'warning');
          return;
        }

        // Enviar datos al backend
        const response = await axios.post('/api/amenidades/', this.formData);
        
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
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
}
</style>
