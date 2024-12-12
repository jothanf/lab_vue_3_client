<template>
    <div class="caracteristicas-interiores-form">
      <h2>Crear Característica Interior</h2>
  
      <!-- Notificaciones -->
      <div v-if="notification" :class="['alert', `alert-${notification.type}`]">
        {{ notification.message }}
      </div>
  
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="caracteristica">Característica*:</label>
          <input 
            type="text" 
            id="caracteristica" 
            v-model="formData.caracteristica" 
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
            <option value="acabados">Acabados</option>
            <option value="pisos">Pisos</option>
            <option value="cocina">Cocina</option>
            <option value="banos">Baños</option>
            <option value="iluminacion">Iluminación</option>
            <option value="ventilacion">Ventilación</option>
            <option value="seguridad">Seguridad</option>
            <option value="tecnologia">Tecnología</option>
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
  
        <button type="submit" class="btn btn-primary">Guardar Característica</button>
      </form>
    </div>
  </template>
  
<script>
import axios from '@/utils/axios';

export default {
  name: 'CaracteristicasInterioresForm',
  data() {
    return {
      formData: {
        caracteristica: '',
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
        if (!this.formData.caracteristica || !this.formData.categoria) {
          this.showNotification('Por favor complete los campos obligatorios', 'warning');
          return;
        }

        // Enviar datos al backend usando la ruta correcta
        const response = await axios.post('/crm/caracteristicasInteriores/', this.formData);
        
        console.log('Respuesta del servidor:', response.data);
        this.showNotification('Característica interior creada exitosamente');
        
        // Limpiar el formulario
        this.resetForm();
        
        // Emitir evento para actualizar la lista de características interiores si es necesario
        this.$emit('caracteristica-interior-created', response.data);

      } catch (error) {
        console.error('Error al crear característica interior:', error);
        let errorMessage = 'Error al guardar la característica interior';
        
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
        caracteristica: '',
        categoria: '',
        descripcion: '',
      };
    }
  }
}
</script>
  