<template>
  <div class="detalles-barrio">
    <header class="header">
      <h1>{{ barrio?.nombre || 'Detalles del Barrio' }}</h1>
      <button @click="volver" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver
      </button>
      <button v-if="!isEditing" @click="activarEdicion" class="btn btn-primary">
        <i class="fas fa-edit"></i> Editar
      </button>
      <button v-if="isEditing" @click="guardarCambios" class="btn btn-success">
        <i class="fas fa-save"></i> Guardar
      </button>
    </header>

    <div v-if="barrio" class="contenido">
      <!-- Información Básica -->
      <section class="seccion">
        <h2>Información Básica</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Nombre:</span>
            <input v-if="isEditing" v-model="barrioEditado.nombre" class="input" />
            <span v-else class="valor">{{ barrio.nombre || 'No disponible' }}</span>
          </div>

          <div class="campo">
            <span class="etiqueta">Sigla:</span>
            <input v-if="isEditing" v-model="barrioEditado.sigla" class="input" />
            <span v-else class="valor">{{ barrio.sigla || 'No disponible' }}</span>
          </div>

          <div class="campo">
            <span class="etiqueta">Localidad:</span>
            <select v-if="isEditing" v-model="barrioEditado.localidad" class="input">
              <option v-for="loc in localidades" :key="loc.id" :value="loc.id">
                {{ loc.nombre }}
              </option>
            </select>
            <span v-else class="valor">{{ barrio.localidad_nombre || 'No disponible' }}</span>
          </div>

          <div class="campo">
            <span class="etiqueta">Estrato Predominante:</span>
            <input 
              v-if="isEditing" 
              v-model="barrioEditado.estrato_predominante" 
              type="number" 
              class="input" 
              min="1" 
              max="6"
            />
            <span v-else class="valor">{{ barrio.estrato_predominante || 'No disponible' }}</span>
          </div>

          <div class="campo">
            <span class="etiqueta">Tipo de Barrio:</span>
            <select v-if="isEditing" v-model="barrioEditado.tipo_barrio" class="input">
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="mixta">Mixta</option>
              <option value="industrial">Industrial</option>
            </select>
            <span v-else class="valor">{{ formatearTipoBarrio(barrio.tipo_barrio) }}</span>
          </div>
        </div>
      </section>

      <!-- Descripción -->
      <section class="seccion">
        <h2>Descripción</h2>
        <div class="campo">
          <textarea 
            v-if="isEditing" 
            v-model="barrioEditado.descripcion" 
            class="input descripcion-textarea"
          ></textarea>
          <p v-else class="valor descripcion-texto">
            {{ barrio.descripcion || 'Sin descripción disponible' }}
          </p>
        </div>
      </section>

      <!-- Multimedia -->
      <section class="seccion">
        <h2>Imágenes y Videos</h2>
        <div class="galeria-imagenes">
          <div 
            v-for="imagen in barrio.multimedia" 
            :key="imagen.id" 
            class="imagen-container"
          >
            <template v-if="imagen.tipo === 'foto'">
              <img 
                :src="imagen.archivo_url" 
                :alt="imagen.titulo" 
                class="imagen"
              >
            </template>
            <template v-else-if="imagen.tipo === 'video'">
              <VideoCard 
                :videoSrc="imagen.archivo_url"
                :titulo="imagen.titulo"
                :descripcion="imagen.descripcion"
              />
            </template>
            <div class="imagen-info">
              <div v-if="editandoMultimedia === imagen.id">
                <input 
                  v-model="imagenEditada.titulo" 
                  placeholder="Título"
                  class="edit-input"
                >
                <textarea 
                  v-model="imagenEditada.descripcion" 
                  placeholder="Descripción"
                  class="edit-input"
                ></textarea>
                <div class="edit-buttons">
                  <button @click="guardarEdicionMultimedia(imagen.id)" class="btn-guardar">
                    <i class="fas fa-save"></i> Guardar
                  </button>
                  <button @click="cancelarEdicionMultimedia" class="btn-cancelar">
                    <i class="fas fa-times"></i> Cancelar
                  </button>
                </div>
              </div>
              <div v-else>
                <h3 class="titulo">{{ imagen.titulo || 'Sin título' }}</h3>
                <p class="descripcion">{{ imagen.descripcion || 'Sin descripción' }}</p>
                <div class="multimedia-actions">
                  <button @click="iniciarEdicionMultimedia(imagen)" class="btn-editar">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="eliminarMultimedia(imagen.id)" class="btn-eliminar">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario para agregar multimedia -->
        <div v-if="isEditing" class="agregar-imagen">
          <h3>Agregar Nueva Multimedia</h3>
          <form @submit.prevent="agregarMultimedia" class="multimedia-form">
            <input 
              type="file" 
              @change="onFileSelected" 
              accept="image/*,video/*"
              class="file-input"
            >
            <input 
              v-model="nuevaImagen.titulo" 
              placeholder="Título"
              class="text-input"
            >
            <textarea 
              v-model="nuevaImagen.descripcion" 
              placeholder="Descripción"
              class="text-input"
            ></textarea>
            <select v-model="nuevaImagen.tipo" class="select-input">
              <option value="foto">Foto</option>
              <option value="video">Video</option>
            </select>
            <button type="submit" class="btn-submit">Agregar Multimedia</button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import VideoCard from '@/components/molecules/VideoCard.vue';
import eventBus from '@/utils/eventBus';

export default {
  name: 'DetallesBarrio',
  components: {
    VideoCard
  },
  data() {
    return {
      barrio: null,
      barrioEditado: {
        nombre: '',
        sigla: '',
        descripcion: '',
        localidad: null,
        estrato_predominante: null,
        tipo_barrio: ''
      },
      isEditing: false,
      localidades: [],
      editandoMultimedia: null,
      imagenEditada: {
        titulo: '',
        descripcion: ''
      },
      nuevaImagen: {
        archivo: null,
        titulo: '',
        descripcion: '',
        tipo: 'foto'
      }
    }
  },
  async created() {
    await this.cargarLocalidades();
    await this.cargarBarrio();
  },
  methods: {
    formatearTipoBarrio(tipo) {
      const tipos = {
        'residencial': 'Residencial',
        'comercial': 'Comercial',
        'mixta': 'Mixta',
        'industrial': 'Industrial'
      };
      return tipos[tipo] || tipo;
    },
    async cargarLocalidades() {
      try {
        const response = await axios.get('/crm/localidades/');
        this.localidades = response.data;
      } catch (error) {
        console.error('Error al cargar localidades:', error);
      }
    },
    async cargarBarrio() {
      try {
        const response = await axios.get(`/crm/barrio/${this.$route.params.id}/`);
        this.barrio = response.data;
        this.barrioEditado = {
          ...response.data,
          localidad: response.data.localidad
        };
      } catch (error) {
        console.error('Error al cargar el barrio:', error);
      }
    },
    activarEdicion() {
      this.isEditing = true;
    },
    async guardarCambios() {
      try {
        const datosAEnviar = { ...this.barrioEditado };
        if (typeof datosAEnviar.localidad === 'object') {
          datosAEnviar.localidad = datosAEnviar.localidad.id;
        }

        const response = await axios.put(
          `/crm/barrio/${this.barrio.id}/`,
          datosAEnviar
        );

        this.barrio = response.data;
        this.isEditing = false;
        
        eventBus.emit('barrio-updated', response.data);
        
        alert("Cambios guardados exitosamente");
      } catch (error) {
        console.error('Error:', error);
        alert("Error al guardar los cambios: " + (error.response?.data?.error || error.message));
      }
    },
    volver() {
      this.$router.go(-1);
    },
    onFileSelected(event) {
      this.nuevaImagen.archivo = event.target.files[0];
    },
    async agregarMultimedia() {
      try {
        const formData = new FormData();
        formData.append('archivo', this.nuevaImagen.archivo);
        formData.append('titulo', this.nuevaImagen.titulo);
        formData.append('descripcion', this.nuevaImagen.descripcion);
        formData.append('tipo', this.nuevaImagen.tipo);

        await axios.post(
          `/crm/barrio/${this.barrio.id}/agregar_multimedia/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Recargar los datos del barrio para obtener la multimedia actualizada
        await this.cargarBarrio();

        // Limpiar el formulario
        this.nuevaImagen = {
          archivo: null,
          titulo: '',
          descripcion: '',
          tipo: 'foto'
        };
      } catch (error) {
        console.error('Error al agregar multimedia:', error);
        alert("Error al agregar multimedia: " + (error.response?.data?.error || error.message));
      }
    },
    async eliminarMultimedia(id) {
      if (confirm('¿Está seguro de eliminar esta multimedia?')) {
        try {
          await axios.delete(`/crm/barrio/${this.barrio.id}/multimedia/${id}/`);
          this.barrio.multimedia = this.barrio.multimedia.filter(item => item.id !== id);
        } catch (error) {
          console.error('Error al eliminar multimedia:', error);
          alert("Error al eliminar multimedia: " + (error.response?.data?.error || error.message));
        }
      }
    },
    iniciarEdicionMultimedia(imagen) {
      this.editandoMultimedia = imagen.id;
      this.imagenEditada = {
        titulo: imagen.titulo || '',
        descripcion: imagen.descripcion || ''
      };
    },
    async guardarEdicionMultimedia(id) {
      try {
        await axios.patch(
          `/crm/multimedia/${id}/`,
          this.imagenEditada
        );

        // Actualizar la multimedia en el estado local
        const index = this.barrio.multimedia.findIndex(m => m.id === id);
        if (index !== -1) {
          this.barrio.multimedia[index] = {
            ...this.barrio.multimedia[index],
            ...this.imagenEditada
          };
        }

        this.editandoMultimedia = null;
        this.imagenEditada = { titulo: '', descripcion: '' };
      } catch (error) {
        console.error('Error al actualizar multimedia:', error);
        alert("Error al actualizar multimedia: " + (error.response?.data?.error || error.message));
      }
    },
    cancelarEdicionMultimedia() {
      this.editandoMultimedia = null;
      this.imagenEditada = {
        titulo: '',
        descripcion: ''
      };
    }
  }
}
</script>

<style scoped>
/* Mantener los mismos estilos que DetallesLocalidad */
.detalles-barrio {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* ... (resto de los estilos igual que en DetallesLocalidad) ... */

/* Estilos para la sección de multimedia */
.galeria-imagenes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.imagen-container {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.imagen {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.imagen-info {
  padding: var(--spacing-sm);
}

.multimedia-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.file-input,
.text-input,
.select-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
}

.btn-submit {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}

.btn-submit:hover {
  background-color: var(--color-primary-dark);
}
</style>