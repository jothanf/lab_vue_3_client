<template>
  <div class="zonas-de-interes-form">
    <h2>Crear Zona de Interés</h2>
    
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
          <option value="parque">Parque</option>
          <option value="edificio">Bulevar</option>
          <option value="museo">Museo</option>
          <option value="restaurante">Restaurante</option>
          <option value="monumento">Monumento</option>
          <option value="plaza">Plaza</option>
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
        <label for="direccion">Dirección (opcional):</label>
        <input 
          type="text" 
          id="direccion" 
          v-model="formData.direccion" 
          class="form-control"
          maxlength="200"
        >
      </div>

      <div class="form-group">
        <label for="ubicacion">Ubicación (Longitud y Latitud):</label>
        <div class="d-flex">
          <input 
            type="number" 
            placeholder="Longitud (opcional)" 
            v-model="formData.ubicacion.longitud" 
            class="form-control" 
          />
          <input 
            type="number" 
            placeholder="Latitud (opcional)" 
            v-model="formData.ubicacion.latitud" 
            class="form-control" 
          />
        </div>
      </div>

      <div class="form-group">
        <label for="icono">Ícono:</label>
        <input 
          type="file" 
          id="icono" 
          @change="handleIconoChange" 
          class="form-control"
          accept="image/*"
        >
      </div>

      <div class="form-group">
        <label for="multimedia">Multimedia (opcional):</label>
        <input 
          type="file" 
          id="multimedia" 
          @change="handleMultimediaChange" 
          class="form-control"
          accept="image/*,video/*" 
          multiple
        >
      </div>

      <button type="submit" class="btn btn-primary">Guardar Zona de Interés</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'ZonasDeInteresForm',
  data() {
    return {
      formData: {
        nombre: '',
        categoria: '',
        descripcion: '',
        direccion: '',
        ubicacion: {
          longitud: null,
          latitud: null,
        },
        icono: null, // Para el ícono
        multimedia: [] // Para las imágenes multimedia
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

    handleIconoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.icono = file; // Guardar el archivo en formData
      }
    },

    handleMultimediaChange(event) {
      this.formData.multimedia = Array.from(event.target.files); // Guardar los archivos multimedia
    },

    async submitForm() {
      try {
        // Validaciones básicas
        if (!this.formData.nombre || !this.formData.categoria) {
          this.showNotification('Por favor complete los campos obligatorios', 'warning');
          return;
        }

        // Crear un objeto FormData
        const formDataToSend = new FormData();
        formDataToSend.append('nombre', this.formData.nombre);
        formDataToSend.append('categoria', this.formData.categoria);
        formDataToSend.append('descripcion', this.formData.descripcion);
        formDataToSend.append('direccion', this.formData.direccion || null);

        // Agregar ubicación solo si hay valores
        if (this.formData.ubicacion.longitud || this.formData.ubicacion.latitud) {
          formDataToSend.append('ubicacion', JSON.stringify(this.formData.ubicacion));
        }

        // Agregar ícono si existe
        if (this.formData.icono) {
          formDataToSend.append('icono', this.formData.icono);
        }

        // Agregar multimedia si existe
        for (const archivo of this.formData.multimedia) {
          formDataToSend.append('multimedia', archivo);
        }

        // Enviar datos al backend
        const response = await axios.post('/crm/zonasDeInteres/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Respuesta del servidor:', response.data);
        this.showNotification('Zona de interés creada exitosamente');
        
        // Limpiar el formulario
        this.resetForm();
        
        // Emitir evento para actualizar la lista
        this.$emit('zona-de-interes-created', response.data);

      } catch (error) {
        console.error('Error al crear zona de interés:', error);
        let errorMessage = 'Error al guardar la zona de interés';
        
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
        direccion: '',
        ubicacion: {
          longitud: null,
          latitud: null,
        },
        icono: null,
        multimedia: []
      };
    }
  }
}
</script>

<style scoped>
.zonas-de-interes-form {
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
</style>
