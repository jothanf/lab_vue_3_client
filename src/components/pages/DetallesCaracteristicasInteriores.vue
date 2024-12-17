<template>
  <div class="detalles-caracteristica">
    <header class="header">
      <h1 v-if="caracteristica">{{ isEditing ? 'Editar Característica' : caracteristica.caracteristica }}</h1>
      <div class="actions">
        <button v-if="!isEditing" @click="activarEdicion" class="btn btn-primary">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button v-if="isEditing" @click="guardarCambios" class="btn btn-success">
          <i class="fas fa-save"></i> Guardar
        </button>
        <button v-if="isEditing" @click="cancelarEdicion" class="btn btn-secondary">
          <i class="fas fa-times"></i> Cancelar
        </button>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Cargando...
    </div>
    
    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </div>

    <div v-if="caracteristica" class="contenido">
      <div class="grid">
        <!-- Vista de detalles -->
        <div v-if="!isEditing" class="detalles">
          <div class="icon-container">
            <img 
              :src="caracteristica.icono || '/default-icon.png'" 
              :alt="caracteristica.caracteristica"
              class="icon"
              @error="handleImageError"
            />
          </div>
          <div class="info">
            <p class="categoria"><strong>Categoría:</strong> {{ caracteristica.categoria }}</p>
            <p class="descripcion"><strong>Descripción:</strong> {{ caracteristica.descripcion }}</p>
          </div>
        </div>

        <!-- Formulario de edición -->
        <div v-else class="form-edit">
          <div class="form-group">
            <label>Característica:</label>
            <input 
              v-model="caracteristicaEditada.caracteristica" 
              class="form-control"
              placeholder="Nombre de la característica" 
            />
          </div>

          <div class="form-group">
            <label>Categoría:</label>
            <select v-model="caracteristicaEditada.categoria" class="form-control">
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
            <label>Descripción:</label>
            <textarea 
              v-model="caracteristicaEditada.descripcion" 
              class="form-control"
              placeholder="Descripción de la característica"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Ícono:</label>
            <div class="image-upload">
              <input 
                type="file" 
                @change="handleIconoChange" 
                accept="image/*"
                class="form-control" 
              />
              <div class="preview-container" v-if="previewImage || caracteristicaEditada.icono">
                <img 
                  :src="previewImage || caracteristicaEditada.icono" 
                  alt="Vista previa" 
                  class="preview-image"
                />
                <button @click="removeImage" class="btn btn-danger btn-sm">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'DetallesCaracteristicaInteriores',
  data() {
    return {
      caracteristica: null,
      caracteristicaEditada: null,
      loading: true,
      error: null,
      isEditing: false,
      previewImage: null,
      formData: new FormData()
    };
  },
  methods: {
    async fetchCaracteristica() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`/crm/caracteristicasInteriores/${id}/`);
        this.caracteristica = response.data;
        this.caracteristicaEditada = { ...response.data };
      } catch (error) {
        this.error = 'Error al cargar los detalles: ' + (error.response?.data?.error || error.message);
      } finally {
        this.loading = false;
      }
    },
    handleImageError(e) {
      e.target.src = '/default-icon.png';
    },
    activarEdicion() {
      this.caracteristicaEditada = { ...this.caracteristica };
      this.isEditing = true;
    },
    async guardarCambios() {
      try {
        const formData = new FormData();
        formData.append('caracteristica', this.caracteristicaEditada.caracteristica);
        formData.append('categoria', this.caracteristicaEditada.categoria);
        formData.append('descripcion', this.caracteristicaEditada.descripcion);
        
        if (this.formData.get('icono')) {
          formData.append('icono', this.formData.get('icono'));
        }

        await axios.put(
          `/crm/caracteristicasInteriores/${this.caracteristica.id}/`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        this.isEditing = false;
        await this.fetchCaracteristica();
      } catch (error) {
        this.error = 'Error al guardar los cambios: ' + (error.response?.data?.error || error.message);
      }
    },
    cancelarEdicion() {
      this.isEditing = false;
      this.previewImage = null;
      this.caracteristicaEditada = { ...this.caracteristica };
    },
    handleIconoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.set('icono', file);
        this.previewImage = URL.createObjectURL(file);
      }
    },
    removeImage() {
      this.caracteristicaEditada.icono = null;
      this.previewImage = null;
      this.formData.delete('icono');
    },
  },
  created() {
    this.fetchCaracteristica();
  }
};
</script>

<style scoped>
.detalles-caracteristica {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.contenido {
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.icon-container {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: var(--border-radius-md);
  background: var(--color-mine-shaft-50);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.icon {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: bold;
  color: var(--color-mine-shaft-700);
}

.preview-container {
  position: relative;
  display: inline-block;
  margin-top: var(--spacing-sm);
}

.preview-image {
  max-width: 150px;
  max-height: 150px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-mine-shaft-200);
}

.error-message {
  background-color: var(--color-danger-50);
  color: var(--color-danger);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-md);
}

.loading {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-primary);
}
</style> 