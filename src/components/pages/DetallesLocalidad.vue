<template>
  <div class="detalles-localidad">
    <header class="header">
      <h1>{{ localidad?.nombre || 'Detalles de Localidad' }}</h1>
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

    <div v-if="localidad" class="contenido">
      <!-- Información Básica -->
      <section class="seccion">
        <h2>Información Básica</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Nombre:</span>
            <input v-if="isEditing" v-model="localidadEditada.nombre" class="input" />
            <span v-else class="valor">{{ localidad.nombre || 'No disponible' }}</span>
          </div>
          
        </div>
      </section>

      <section class="seccion">
        <h2>Zonas de Interés</h2>
        <div v-if="isEditing" class="form-group">
          <label>Zonas de Interés:</label>
          <multiselect
            v-model="zonaSeleccionada"
            :options="zonasDeInteres"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Seleccione zonas de interés"
            label="nombre"
            track-by="id"
            :preselect-first="false"
          >
            <template v-slot:selection="{ values, isOpen }">
              <span class="multiselect__single" v-if="values.length && !isOpen">
                {{ values.length }} zona(s) seleccionada(s)
              </span>
            </template>
          </multiselect>
        </div>

        <div v-else class="zonas-interes-container">
          <div 
            v-for="zona in localidad.zonas_de_interes"
            :key="zona.id"
            class="zona-interes-card"
          >
            <div class="zona-imagen" v-if="zona.multimedia && zona.multimedia.length">
              <img 
                :src="zona.multimedia[0].archivo_url" 
                :alt="zona.nombre"
                class="zona-imagen"
              />
            </div>
            <h3>{{ zona.nombre }}</h3>
            <p><strong>Descripción:</strong> {{ zona.descripcion }}</p>
            <p><strong>Categoría:</strong> {{ zona.categoria }}</p>
            <p><strong>Ubicación:</strong> {{ zona.ubicacion }}</p>
            
            <!-- Galería de imágenes de la zona -->
            <div class="zona-galeria" v-if="zona.multimedia && zona.multimedia.length > 1">
              <img 
                v-for="(imagen, index) in zona.multimedia.slice(1)" 
                :key="index"
                :src="imagen.archivo_url"
                :alt="imagen.titulo || zona.nombre"
                class="zona-imagen-thumbnail"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Imágenes -->
      <section class="seccion">
        <h2>Imágenes y Videos</h2>
        <div class="galeria-imagenes">
          <div 
            v-for="imagen in localidad.multimedia" 
            :key="imagen.id" 
            class="imagen-container"
          >
            <template v-if="imagen.tipo === 'foto'">
              <img 
                :src="imagen.archivo_url || imagen.archivo" 
                :alt="imagen.titulo || 'Imagen de localidad'" 
                class="imagen"
              >
            </template>
            <template v-else-if="imagen.tipo === 'video'">
              <VideoCard 
                :videoSrc="imagen.archivo_url || imagen.archivo"
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
              </div>
              <div v-if="isEditing" class="multimedia-actions">
                <button 
                  @click="iniciarEdicionMultimedia(imagen)"
                  class="btn-editar"
                  title="Editar multimedia"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="eliminarMultimedia(imagen.id)" 
                  class="btn-eliminar"
                  title="Eliminar multimedia"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <p v-if="!localidad.multimedia?.length">
            No hay imágenes o videos disponibles para esta localidad
          </p>
        </div>

        <!-- Formulario para agregar imágenes (visible en modo edición) -->
        <div v-if="isEditing" class="agregar-imagen">
          <h3>Agregar Nueva Multimedia</h3>
          <form @submit.prevent="agregarMultimedia">
            <input 
              type="file" 
              @change="onFileSelected" 
              accept="image/*,video/*"
            >
            <input 
              v-model="nuevaImagen.titulo" 
              placeholder="Título de la multimedia"
            >
            <textarea 
              v-model="nuevaImagen.descripcion" 
              placeholder="Descripción"
            ></textarea>
            <select v-model="nuevaImagen.tipo">
              <option value="foto">Foto</option>
              <option value="video">Video</option>
            </select>
            <button type="submit">Agregar Multimedia</button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.detalles-localidad {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.seccion {
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.etiqueta {
  font-weight: bold;
  color: var(--color-loblolly-800);
  font-size: 0.9rem;
}

.valor {
  color: var(--color-loblolly-950);
}

/* Estilos para la sección de multimedia */
.galeria-imagenes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.imagen-container {
  position: relative;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background-color: var(--color-white);
  transition: transform var(--transition-normal);
  aspect-ratio: 4/3;
}

.imagen-container:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.imagen-container:hover .imagen {
  transform: scale(1.05);
}

.imagen-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-md);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.imagen-container:hover .imagen-info {
  transform: translateY(0);
}

.titulo, .descripcion { 
  background: rgba(104, 143, 150, 0.8); 
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xs); 
}

.titulo {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: var(--spacing-xs);
}

.descripcion {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Estilos para el formulario de agregar imagen */
.agregar-imagen {
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.agregar-imagen h3 {
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.agregar-imagen form {
  display: grid;
  gap: var(--spacing-md);
}

.agregar-imagen input[type="file"] {
  padding: var(--spacing-sm);
  border: 2px dashed var(--color-mine-shaft-100);
  border-radius: var(--border-radius-md);
  cursor: pointer;
}

.agregar-imagen input[type="text"],
.agregar-imagen textarea {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-mine-shaft-100);
  border-radius: var(--border-radius-sm);
  font-family: var(--font-league);
}

.agregar-imagen button {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-normal);
}

.agregar-imagen button:hover {
  background-color: var(--color-primary-light);
}

/* Mensaje cuando no hay imágenes */
.galeria-imagenes p {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  color: var(--color-loblolly-700);
}

.btn-eliminar {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--color-danger);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.btn-eliminar:hover {
  opacity: 1;
}

.imagen-container:hover .btn-eliminar {
  display: flex;
}

/* Animación para la eliminación */
.imagen-container {
  transition: all 0.3s ease;
}

.imagen-container.eliminando {
  transform: scale(0.8);
  opacity: 0;
}

.edit-input {
  width: 100%;
  padding: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
  border: 1px solid var(--color-white);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-mine-shaft-900);
}

.edit-buttons {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.multimedia-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.btn-editar,
.btn-eliminar,
.btn-guardar,
.btn-cancelar {
  padding: 8px;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-editar {
  background-color: var(--color-primary);
  color: white;
}

.btn-guardar {
  background-color: var(--color-success);
  color: white;
}

.btn-cancelar {
  background-color: var(--color-warning);
  color: white;
}

.btn-eliminar {
  background-color: var(--color-danger);
  color: white;
}

.btn-editar:hover,
.btn-eliminar:hover,
.btn-guardar:hover,
.btn-cancelar:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.imagen-info {
  background: rgba(0, 0, 0, 0.8);
  padding: var(--spacing-md);
}

.imagen-container:hover .multimedia-actions {
  opacity: 1;
}

@import '~vue-multiselect/dist/vue-multiselect.min.css';

.zonas-interes-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zona-interes-card {
  border: 1px solid var(--color-mine-shaft-100);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin: var(--spacing-sm) 0;
  background-color: var(--color-white);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.zona-interes-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.zona-interes-card h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.zona-interes-card p {
  margin-bottom: var(--spacing-xs);
  color: var(--color-mine-shaft-700);
}

.zona-interes-card button {
  margin-right: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.zona-imagen {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-sm);
}

.zona-galeria {
  display: flex;
  gap: var(--spacing-xs);
  overflow-x: auto;
  padding: var(--spacing-xs);
}

.zona-imagen-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}
</style>

<script>
import axios from '@/utils/axios';
import VideoCard from '@/components/molecules/VideoCard.vue';
import Multiselect from 'vue-multiselect';

export default {
  name: 'DetallesLocalidad',
  components: {
    VideoCard,
    Multiselect
  },
  data() {
    return {
      localidad: null,
      localidadEditada: {},
      isEditing: false,
      nuevaImagen: {
        archivo: null,
        titulo: '',
        descripcion: '',
        tipo: 'foto'
      },
      zonasDeInteres: [],
      zonaSeleccionada: [],
      editandoMultimedia: null,
      imagenEditada: {
        titulo: '',
        descripcion: ''
      }
    }
  },
  async created() {
    await this.cargarZonasDeInteres();
    await this.cargarLocalidad();
  },
  methods: {
    async cargarLocalidad() {
      try {
        const response = await axios.get(`/crm/localidades/${this.$route.params.id}/`);
        this.localidad = response.data;
        this.localidadEditada = { ...this.localidad };
        
        if (this.localidad.zonas_de_interes) {
          this.zonaSeleccionada = this.localidad.zonas_de_interes.map(zona => 
            typeof zona === 'object' ? zona : this.zonasDeInteres.find(z => z.id === zona)
          );
        }
        
        console.log('Localidad cargada:', this.localidad);
      } catch (error) {
        console.error('Error al cargar la localidad:', error);
      }
    },
    async cargarZonasDeInteres() {
      try {
        const response = await axios.get('/crm/zonasDeInteres/');
        this.zonasDeInteres = response.data;
        console.log("Zonas de interés disponibles:", this.zonasDeInteres);
      } catch (error) {
        console.error('Error al cargar zonas de interés:', error);
      }
    },
    activarEdicion() {
      this.isEditing = true;
      
      if (this.localidad.zonas_de_interes) {
        this.zonaSeleccionada = this.localidad.zonas_de_interes.map(zonaId => {
          if (typeof zonaId === 'object') return zonaId;
          const zonaCompleta = this.zonasDeInteres.find(z => z.id === zonaId);
          console.log(`Buscando zona ${zonaId}:`, zonaCompleta);
          return zonaCompleta;
        }).filter(Boolean);
      }
      
      console.log("Zonas seleccionadas al activar edición:", this.zonaSeleccionada);
    },
    async guardarCambios() {
      try {
        const zonasIds = this.zonaSeleccionada.map(zona => 
          typeof zona === 'object' ? zona.id : zona
        );

        const datosActualizados = {
          ...this.localidadEditada,
          zonas_de_interes: zonasIds
        };

        console.log("Datos a enviar:", datosActualizados);
        console.log("IDs de zonas a enviar:", zonasIds);

        const response = await axios.put(
          `/crm/localidades/${this.localidad.id}/`, 
          datosActualizados
        );

        this.localidad = response.data;
        this.isEditing = false;
        
        console.log("Respuesta del servidor:", response.data);
        alert("Cambios guardados exitosamente");

      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert("Error al guardar los cambios: " + error.message);
      }
    },
    volver() {
      this.$router.go(-1);
    },
    getFullImageUrl(url) {
      if (url && !url.startsWith('http')) {
        console.log("URL de imagen generada:", `http://localhost:8000${url}`);
        return `http://localhost:8000${url}`;
      }
      console.log("URL de imagen:", url);
      return url;
    },
    onFileSelected(event) {
      this.nuevaImagen.archivo = event.target.files[0];
    },
    async agregarMultimedia() {
      try {
        if (!this.nuevaImagen.archivo) {
          console.error("No se ha seleccionado ningún archivo");
          return;
        }

        const formData = new FormData();
        formData.append('archivo', this.nuevaImagen.archivo);
        formData.append('titulo', this.nuevaImagen.titulo || '');
        formData.append('descripcion', this.nuevaImagen.descripcion || '');
        formData.append('tipo', this.nuevaImagen.tipo || 'foto');

        console.log("Enviando multimedia:", this.nuevaImagen); // Log para verificar los datos enviados

        const response = await axios.post(`/crm/localidades/${this.localidad.id}/agregar_multimedia/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log("Respuesta del servidor al agregar multimedia:", response.data); // Log para verificar la respuesta del servidor

        // Actualizar la lista de multimedia
        if (response.data) {
          if (!this.localidad.multimedia) {
            this.localidad.multimedia = [];
          }
          this.localidad.multimedia.push(response.data);
          console.log("Multimedia actualizadas:", this.localidad.multimedia); // Log para verificar las multimedia actualizadas
        }

        // Limpiar el formulario
        this.nuevaImagen = {
          archivo: null,
          titulo: '',
          descripcion: '',
          tipo: 'foto'
        };

      } catch (error) {
        console.error("Error al subir multimedia:", error.response || error);
        alert("Error al subir multimedia: " + error.message); // Muestra el error en un alert
      }
    },
    async eliminarMultimedia(multimediaId) {
      try {
        if (!confirm('¿Está seguro de que desea eliminar este elemento?')) {
          return;
        }

        // Usar la ruta del router por defecto con la acción personalizada
        const response = await axios.delete(`/crm/localidades/${this.localidad.id}/multimedia/${multimediaId}/`);
        
        if (response.status === 204 || response.status === 200) {
          // Actualizar la lista de multimedia localmente
          this.localidad.multimedia = this.localidad.multimedia.filter(
            item => item.id !== multimediaId
          );
          
          alert('Multimedia eliminada exitosamente');
        }

      } catch (error) {
        console.error('Error al eliminar multimedia:', error);
        alert('Error al eliminar la multimedia: ' + (error.response?.data?.message || error.message));
      }
    },
    iniciarEdicionMultimedia(imagen) {
      this.editandoMultimedia = imagen.id;
      this.imagenEditada = {
        titulo: imagen.titulo || '',
        descripcion: imagen.descripcion || ''
      };
    },

    cancelarEdicionMultimedia() {
      this.editandoMultimedia = null;
      this.imagenEditada = {
        titulo: '',
        descripcion: ''
      };
    },

    async guardarEdicionMultimedia(id) {
      try {
        const response = await axios.patch(
          `/crm/multimedia/${id}/`,
          this.imagenEditada
        );

        if (response.status === 200) {
          // Actualizar la multimedia en el estado local
          const index = this.localidad.multimedia.findIndex(m => m.id === id);
          if (index !== -1) {
            this.localidad.multimedia[index] = {
              ...this.localidad.multimedia[index],
              ...this.imagenEditada
            };
          }

          this.editandoMultimedia = null;
          this.imagenEditada = { titulo: '', descripcion: '' };
          alert('Multimedia actualizada exitosamente');
        }

      } catch (error) {
        console.error('Error al actualizar multimedia:', error);
        alert('Error al actualizar la multimedia: ' + (error.response?.data?.message || error.message));
      }
    },
    editarZona(zona) {
      // Lógica para editar la zona de interés
      console.log('Editar zona:', zona);
      // Aquí puedes abrir un modal o redirigir a otra página
    },
    async eliminarZonas(zonasIds) {
      try {
        if (!confirm('¿Está seguro de que desea eliminar estas zonas de interés?')) {
          return;
        }

        // Hacer una solicitud DELETE para cada ID
        const deletePromises = zonasIds.map(zonaId => {
          return axios.delete(`/crm/localidades/${this.localidad.id}/zonasDeInteres/${zonaId}/`);
        });

        // Esperar a que todas las eliminaciones se completen
        await Promise.all(deletePromises);

        // Actualizar la lista de zonas de interés
        this.localidad.zonas_de_interes = this.localidad.zonas_de_interes.filter(zona => 
          !zonasIds.includes(zona.id)
        );

        alert('Zonas de interés eliminadas exitosamente');
      } catch (error) {
        console.error('Error al eliminar zonas de interés:', error);
        alert('Error al eliminar zonas de interés: ' + (error.response?.data?.message || error.message));
      }
    }
  }
}
</script>