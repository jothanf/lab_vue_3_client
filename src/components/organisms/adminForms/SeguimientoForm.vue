<template>
  <div class="seguimiento-form">
    <h3>Nuevo Seguimiento</h3>
    
    <div v-if="notification" :class="['alert', `alert-${notification.type}`]">
      {{ notification.message }}
    </div>

    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="descripcion">Descripción*:</label>
        <textarea 
          id="descripcion" 
          v-model="formData.descripcion" 
          required
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="estado">Estado*:</label>
        <select 
          id="estado" 
          v-model="formData.estado" 
          required 
          class="form-control"
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div class="form-group">
        <label for="notas">Notas Internas:</label>
        <textarea 
          id="notas" 
          v-model="formData.notas_internas" 
          class="form-control"
          rows="2"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="resultado">Resultado:</label>
        <textarea 
          id="resultado" 
          v-model="formData.resultado" 
          class="form-control"
          rows="2"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="archivo">Archivo Adjunto:</label>
        <input 
          type="file" 
          id="archivo" 
          @change="handleFileChange"
          class="form-control"
        >
      </div>

      <button type="submit" class="btn btn-primary">Guardar Seguimiento</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'SeguimientoForm',
  props: {
    tareaId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      formData: {
        descripcion: '',
        estado: 'pendiente',
        notas_internas: '',
        resultado: '',
        archivos_adjuntos: null
      },
      notification: null
    }
  },
  methods: {
    handleFileChange(event) {
      this.formData.archivos_adjuntos = event.target.files[0];
    },

    async submitForm() {
      try {
        const formData = new FormData();
        
        // Agregar campos al FormData
        Object.keys(this.formData).forEach(key => {
          if (this.formData[key] !== null) {
            formData.append(key, this.formData[key]);
          }
        });

        const response = await axios.post(
          `/crm/tareas/${this.tareaId}/seguimiento/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        this.showNotification('Seguimiento creado exitosamente');
        this.$emit('seguimiento-created', response.data);
        this.resetForm();
      } catch (error) {
        console.error('Error al crear seguimiento:', error);
        let errorMessage = 'Error al guardar el seguimiento';
        if (error.response?.data) {
          errorMessage = typeof error.response.data === 'object'
            ? Object.values(error.response.data).join('\n')
            : error.response.data;
        }
        this.showNotification(errorMessage, 'danger');
      }
    },

    showNotification(message, type = 'success') {
      this.notification = { message, type };
      setTimeout(() => this.notification = null, 5000);
    },

    resetForm() {
      this.formData = {
        descripcion: '',
        estado: 'pendiente',
        notas_internas: '',
        resultado: '',
        archivos_adjuntos: null
      };
    }
  }
}
</script>

<style scoped>
.seguimiento-form {
  padding: var(--spacing-md);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-control {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-mine-shaft-100);
  border-radius: var(--border-radius-sm);
}

.btn {
  width: 100%;
  margin-top: var(--spacing-md);
}
</style>
