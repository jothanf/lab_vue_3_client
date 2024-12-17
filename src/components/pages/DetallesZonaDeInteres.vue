<template>
  <div class="detalles-zona-interes">
    <header class="header">
      <h1>{{ editando ? 'Editar' : 'Detalles de' }} Zona de Interés</h1>
      <div class="header-buttons">
        <button v-if="!editando" @click="iniciarEdicion" class="btn btn-primary">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button v-else @click="guardarCambios" class="btn btn-success">
          <i class="fas fa-save"></i> Guardar
        </button>
        <button @click="volver" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Volver
        </button>
      </div>
    </header>

    <div v-if="zonaDeInteres" class="contenido">
      <!-- Información Básica -->
      <section class="seccion">
        <h2>Información Básica</h2>
        <div class="grid">
          <div class="campo">
            <label>Nombre:</label>
            <input v-if="editando" 
                   v-model="zonaDeInteres.nombre" 
                   type="text" 
                   class="form-control">
            <span v-else>{{ zonaDeInteres.nombre }}</span>
          </div>
          <div class="campo">
            <label>Categoría:</label>
            <select v-if="editando" 
                    v-model="zonaDeInteres.categoria" 
                    class="form-control">
              <option value="parque">Parque</option>
              <option value="museo">Museo</option>
              <option value="restaurante">Restaurante</option>
              <option value="monumento">Monumento</option>
              <option value="plaza">Plaza</option>
            </select>
            <span v-else>{{ zonaDeInteres.categoria }}</span>
          </div>
          <div class="campo">
            <label>Descripción:</label>
            <textarea v-if="editando" 
                      v-model="zonaDeInteres.descripcion" 
                      class="form-control"></textarea>
            <p v-else>{{ zonaDeInteres.descripcion }}</p>
          </div>
        </div>
      </section>

      <!-- Icono -->
      <section class="seccion">
        <h2>Icono</h2>
        <div class="icono-container">
          <img v-if="zonaDeInteres.icono_url" 
               :src="zonaDeInteres.icono_url" 
               alt="Icono de la zona de interés">
          <input v-if="editando" 
                 type="file" 
                 @change="handleIconoChange" 
                 accept="image/*">
        </div>
      </section>

      <!-- Multimedia -->
      <section class="seccion">
        <h2>Multimedia</h2>
        <div v-if="editando" class="upload-section">
          <input type="file" 
                 @change="handleMultimediaChange" 
                 accept="image/*,video/*" 
                 multiple>
        </div>
        <div class="galeria-multimedia">
          <div v-for="item in zonaDeInteres.multimedia" 
               :key="item.id" 
               class="multimedia-item">
            <img v-if="item.tipo === 'foto'" 
                 :src="item.archivo_url" 
                 :alt="item.titulo">
            <video v-else 
                   :src="item.archivo_url" 
                   controls></video>
            <div class="multimedia-info">
              <p>{{ item.titulo || 'Sin título' }}</p>
              <button v-if="editando" 
                      @click="eliminarMultimedia(item.id)" 
                      class="btn btn-danger">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'DetallesZonaDeInteres',
  data() {
    return {
      zonaDeInteres: null,
      editando: false,
      nuevoIcono: null,
      nuevaMultimedia: []
    }
  },
  async created() {
    await this.cargarZonaDeInteres();
  },
  methods: {
    async cargarZonaDeInteres() {
      try {
        const response = await axios.get(`/crm/zonasDeInteres/${this.$route.params.id}/`);
        this.zonaDeInteres = response.data;
      } catch (error) {
        console.error('Error al cargar los detalles:', error);
      }
    },
    iniciarEdicion() {
      this.editando = true;
    },
    async guardarCambios() {
      try {
        const formData = new FormData();
        formData.append('nombre', this.zonaDeInteres.nombre);
        formData.append('categoria', this.zonaDeInteres.categoria);
        formData.append('descripcion', this.zonaDeInteres.descripcion);

        if (this.nuevoIcono) {
          formData.append('icono', this.nuevoIcono);
        }

        const response = await axios.patch(
          `/crm/zonasDeInteres/${this.zonaDeInteres.id}/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Subir nueva multimedia si existe
        if (this.nuevaMultimedia.length > 0) {
          for (const archivo of this.nuevaMultimedia) {
            const multimediaFormData = new FormData();
            multimediaFormData.append('archivo', archivo);
            await axios.post(
              `/crm/zonasDeInteres/${this.zonaDeInteres.id}/agregar_multimedia/`,
              multimediaFormData
            );
          }
        }

        this.zonaDeInteres = response.data;
        this.editando = false;
        this.nuevoIcono = null;
        this.nuevaMultimedia = [];
      } catch (error) {
        console.error('Error al guardar cambios:', error);
      }
    },
    handleIconoChange(event) {
      if (event.target.files.length > 0) {
        this.nuevoIcono = event.target.files[0];
      }
    },
    handleMultimediaChange(event) {
      this.nuevaMultimedia = Array.from(event.target.files);
    },
    async eliminarMultimedia(id) {
      try {
        await axios.delete(`/crm/multimedia/${id}/`);
        await this.cargarZonaDeInteres();
      } catch (error) {
        console.error('Error al eliminar multimedia:', error);
      }
    },
    volver() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.detalles-zona-interes {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.seccion {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.grid {
  display: grid;
  gap: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-control {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.icono-container img {
  max-width: 100px;
  height: auto;
}

.galeria-multimedia {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.multimedia-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.multimedia-item img,
.multimedia-item video {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.multimedia-info {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}
</style>