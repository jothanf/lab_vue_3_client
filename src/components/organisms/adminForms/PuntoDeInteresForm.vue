<template>
  <div class="punto-de-interes-form">
    <h2>Crear Punto de Interés</h2>
    
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
          <option value="restaurante">Restaurante</option>
          <option value="tienda">Tienda</option>
          <option value="servicio">Servicio</option>
          <option value="entretenimiento">Entretenimiento</option>
          <option value="educacion">Educación</option>
          <option value="salud">Salud</option>
          <option value="transporte">Transporte</option>
          <option value="otro">Otro</option>
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

      <button type="submit" class="btn btn-primary">Guardar Punto de Interés</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'PuntoDeInteresForm',
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
        icono: null,
        multimedia: []
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
        this.formData.icono = file;
      }
    },

    handleMultimediaChange(event) {
      this.formData.multimedia = Array.from(event.target.files);
    },

    async submitForm() {
      try {
        if (!this.formData.nombre || !this.formData.categoria) {
          this.showNotification('Por favor complete los campos obligatorios', 'warning');
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('nombre', this.formData.nombre);
        formDataToSend.append('categoria', this.formData.categoria);
        formDataToSend.append('descripcion', this.formData.descripcion);
        formDataToSend.append('direccion', this.formData.direccion || '');

        if (this.formData.ubicacion.longitud || this.formData.ubicacion.latitud) {
          formDataToSend.append('ubicacion', JSON.stringify(this.formData.ubicacion));
        }

        if (this.formData.icono) {
          formDataToSend.append('icono', this.formData.icono);
        }

        this.formData.multimedia.forEach(archivo => {
          formDataToSend.append('multimedia', archivo);
        });

        const response = await axios.post('/crm/puntos-de-interes/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        this.showNotification('Punto de interés creado exitosamente');
        this.resetForm();
        this.$emit('punto-de-interes-created', response.data);

      } catch (error) {
        console.error('Error al crear punto de interés:', error);
        let errorMessage = 'Error al guardar el punto de interés';
        
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
.punto-de-interes-form {
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
