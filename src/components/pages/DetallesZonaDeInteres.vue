<template>
  <div class="detalles-zona-interes" v-if="zonaDeInteres">
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
                   v-model="zonaDeInteresEditada.nombre" 
                   type="text" 
                   class="form-control">
            <span v-else>{{ zonaDeInteres.nombre }}</span>
          </div>
          <div class="campo">
            <label>Categoría:</label>
            <select v-if="editando" 
                    v-model="zonaDeInteresEditada.categoria" 
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
                      v-model="zonaDeInteresEditada.descripcion" 
                      class="form-control"></textarea>
            <p v-else>{{ zonaDeInteres.descripcion }}</p>
          </div>
        </div>
      </section>

      <!-- Icono -->
      <section class="seccion">
        <h2>Icono</h2>
        <div class="icono-container">l
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

      <!-- Puntos de Interés - Asegurarse de que esta sección esté presente -->
      <section class="seccion">
        <h2>Puntos de Interés</h2>
        
        <!-- Selector de puntos de interés (modo edición) -->
        <div v-if="editando" class="campo">
          <label>Seleccionar Puntos de Interés:</label>
          <multiselect
            v-model="zonaDeInteresEditada.puntos_de_interes"
            :options="puntosDeInteresDisponibles"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="Seleccione puntos de interés"
            label="nombre"
            track-by="id"
          >
            <template v-slot:selection="{ values, isOpen }">
              <span class="multiselect__single" v-if="values.length && !isOpen">
                {{ values.length }} punto(s) seleccionado(s)
              </span>
            </template>
          </multiselect>
        </div>

        <!-- Lista de puntos de interés -->
        <div v-if="zonaDeInteres.puntos_de_interes && zonaDeInteres.puntos_de_interes.length > 0" 
             class="lista-puntos">
          <div v-for="punto in zonaDeInteres.puntos_de_interes" 
               :key="punto.id" 
               class="punto-interes-item">
            <img v-if="punto.icono_url" :src="punto.icono_url" alt="Icono del punto" class="icono-punto">
            <div class="punto-info">
              <h3>{{ punto.nombre }}</h3>
              <p>{{ punto.categoria }}</p>
              <p v-if="punto.descripcion">{{ punto.descripcion }}</p>
            </div>
          </div>
        </div>
        <p v-else>No hay puntos de interés asociados</p>
      </section>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import Multiselect from 'vue-multiselect'

export default {
  name: 'DetallesZonaDeInteres',
  components: {
    Multiselect
  },
  data() {
    return {
      zonaDeInteres: null,
      zonaDeInteresEditada: null,
      editando: false,
      nuevoIcono: null,
      nuevaMultimedia: [],
      puntosDeInteresDisponibles: []
    }
  },
  async created() {
    await this.cargarZonaDeInteres();
    await this.cargarPuntosDeInteres();
  },
  methods: {
    async cargarZonaDeInteres() {
      try {
        const response = await axios.get(`/crm/zonasDeInteres/${this.$route.params.id}/`);
        this.zonaDeInteres = response.data;
        this.zonaDeInteresEditada = { ...response.data };
      } catch (error) {
        console.error('Error al cargar zona de interés:', error);
      }
    },
    iniciarEdicion() {
      this.editando = true;
    },
    async guardarCambios() {
      try {
        const datosAEnviar = { ...this.zonaDeInteresEditada };
        const formData = new FormData();
        
        // Agregar campos básicos
        formData.append('nombre', datosAEnviar.nombre);
        formData.append('categoria', datosAEnviar.categoria);
        formData.append('descripcion', datosAEnviar.descripcion);
        
        // Agregar ubicación si existe
        if (datosAEnviar.ubicacion) {
          formData.append('ubicacion', JSON.stringify(datosAEnviar.ubicacion));
        }

        // Agregar nuevo icono si existe
        if (this.nuevoIcono) {
          formData.append('icono', this.nuevoIcono);
        }

        // Procesar puntos de interés - CORREGIDO
        if (datosAEnviar.puntos_de_interes) {
          // Asegurarse de que los IDs se extraen correctamente y se convierten a JSON
          const puntosIds = Array.isArray(datosAEnviar.puntos_de_interes) 
              ? datosAEnviar.puntos_de_interes.map(p => p.id)
              : datosAEnviar.puntos_de_interes;
          formData.append('puntos_de_interes', JSON.stringify(puntosIds));
        }

        // Imprimir logs de la información que se envía
        console.log('Datos a enviar (raw):', datosAEnviar);
        console.log('FormData entries:', Object.fromEntries(formData.entries()));

        const response = await axios.patch(
          `/crm/zonasDeInteres/${this.zonaDeInteres.id}/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        console.log('Respuesta del servidor:', response.data);

        this.zonaDeInteres = response.data;
        this.zonaDeInteresEditada = { ...response.data };
        this.editando = false;
        this.nuevoIcono = null;

      } catch (error) {
        console.error('Error al guardar cambios:', error);
        if (error.response) {
          console.error('Detalles del error:', error.response.data);
        }
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
    },
    async cargarPuntosDeInteres() {
      try {
        console.log('Cargando puntos de interés disponibles...');
        const response = await axios.get('/crm/puntos-de-interes/');
        console.log('Puntos de interés disponibles:', response.data);
        this.puntosDeInteresDisponibles = response.data;
      } catch (error) {
        console.error('Error al cargar puntos de interés:', error);
      }
    },
    cancelarEdicion() {
      this.zonaDeInteresEditada = { ...this.zonaDeInteres };
      this.editando = false;
      this.nuevoIcono = null;
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

@import 'vue-multiselect/dist/vue-multiselect.css';

.multiselect {
  min-height: 40px;
}

/* Agregar estilos para la lista de puntos de interés */
.lista-puntos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.punto-interes-item {
  display: flex;
  align-items: start;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.icono-punto {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 4px;
}

.punto-info {
  flex: 1;
}

.punto-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.1em;
}

.punto-info p {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}
</style>