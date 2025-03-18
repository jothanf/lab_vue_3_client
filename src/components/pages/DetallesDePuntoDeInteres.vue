<template>
    <div class="detalles-punto-interes">
      <header class="header">
        <h1>{{ editando ? 'Editar' : 'Detalles de' }} Punto de Interés</h1>
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
  
      <div v-if="puntoDeInteres" class="contenido">
        <!-- Información Básica -->
        <section class="seccion">
          <h2>Información Básica</h2>
          <div class="grid">
            <div class="campo">
              <label>Nombre:</label>
              <input v-if="editando" 
                     v-model="puntoDeInteres.nombre" 
                     type="text" 
                     class="form-control">
              <span v-else>{{ puntoDeInteres.nombre }}</span>
            </div>
            <div class="campo">
              <label>Categoría:</label>
              <select v-if="editando" 
                      v-model="puntoDeInteres.categoria" 
                      class="form-control">
                <option value="parque">Parque</option>
                <option value="museo">Museo</option>
                <option value="restaurante">Restaurante</option>
                <option value="monumento">Monumento</option>
                <option value="plaza">Plaza</option>
              </select>
              <span v-else>{{ puntoDeInteres.categoria }}</span>
            </div>
            <div class="campo">
              <label>Descripción:</label>
              <textarea v-if="editando" 
                        v-model="puntoDeInteres.descripcion" 
                        class="form-control"></textarea>
              <p v-else>{{ puntoDeInteres.descripcion }}</p>
            </div>
            <div class="campo">
              <label>Dirección:</label>
              <input v-if="editando" 
                     v-model="puntoDeInteres.direccion" 
                     type="text" 
                     class="form-control">
              <span v-else>{{ puntoDeInteres.direccion }}</span>
            </div>
          </div>
        </section>
  
        <!-- Icono -->
        <section class="seccion">
          <h2>Icono</h2>
          <div class="icono-container">
            <img v-if="puntoDeInteres.icono_url" 
                 :src="puntoDeInteres.icono_url" 
                 alt="Icono del punto de interés">
            <div v-if="editando" class="icono-opciones">
              <div class="selector-modo">
                <label>
                  <input type="radio" 
                         v-model="modoIcono" 
                         value="subir"> 
                  Subir imagen
                </label>
                <label>
                  <input type="radio" 
                         v-model="modoIcono" 
                         value="generar"> 
                  Generar con IA
                </label>
              </div>

              <input v-if="modoIcono === 'subir'" 
                     type="file" 
                     @change="handleIconoChange" 
                     accept="image/*">

              <ImgGenerator v-if="modoIcono === 'generar'" 
                           @iconGenerated="setGeneratedIcon" />
            </div>

            <div v-if="generatedIcon">
              <img :src="generatedIcon.url" alt="Icono generado" style="width: 100px; height: 100px;" />
            </div>
          </div>
        </section>
  
        <!-- Multimedia -->
        <section class="seccion">
          <h2>Multimedia</h2>
          <div v-if="editando" class="upload-section">
            <div class="selector-modo">
              <label>
                <input type="radio" 
                       v-model="modoMultimedia" 
                       value="subir"> 
                Subir multimedia
              </label>
              <label>
                <input type="radio" 
                       v-model="modoMultimedia" 
                       value="generar"> 
                Generar multimedia con IA
              </label>
            </div>

            <input v-if="modoMultimedia === 'subir'" 
                   type="file" 
                   @change="handleMultimediaChange" 
                   accept="image/*,video/*" 
                   multiple>

            <ImgGenerator v-if="modoMultimedia === 'generar'" 
                         @iconGenerated="setGeneratedMultimedia" />

            <div v-if="generatedMultimedia.length > 0" class="preview-section">
              <h3>Imágenes generadas:</h3>
              <div class="preview-grid">
                <div v-for="(item, index) in generatedMultimedia" 
                     :key="index" 
                     class="preview-item">
                  <img :src="item.url" 
                       alt="Imagen generada" 
                       style="width: 200px; height: 200px; object-fit: cover;">
                  <button @click="removeGeneratedImage(index)" 
                          class="btn btn-danger">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="galeria-multimedia">
            <div v-for="item in puntoDeInteres.multimedia" 
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
  import ImgGenerator from '@/components/molecules/ImgGenerator.vue';
  
  export default {
    name: 'DetallesPuntoDeInteres',
    components: {
      ImgGenerator
    },
    data() {
      return {
        puntoDeInteres: null,
        editando: false,
        nuevoIcono: null,
        nuevaMultimedia: [],
        generatedIcon: null,
        modoIcono: null, // 'subir' o 'generar'
        modoMultimedia: null, // 'subir' o 'generar'
        generatedMultimedia: [], // Array para almacenar las imágenes generadas
      }
    },
    async created() {
      await this.cargarPuntoDeInteres();
    },
    methods: {
      async cargarPuntoDeInteres() {
        try {
          const response = await axios.get(`/crm/puntos-de-interes/${this.$route.params.id}/`);
          this.puntoDeInteres = response.data;
        } catch (error) {
          console.error('Error al cargar los detalles:', error);
        }
      },
      iniciarEdicion() {
        this.editando = true;
        this.modoIcono = null; // Reset del modo de icono
        this.nuevoIcono = null;
        this.generatedIcon = null;
      },
      async guardarCambios() {
        try {
          console.log('4. Iniciando guardarCambios');
          console.log('5. Estado de generatedMultimedia antes de procesar:', this.generatedMultimedia);
          
          const formData = new FormData();
          formData.append('nombre', this.puntoDeInteres.nombre);
          formData.append('categoria', this.puntoDeInteres.categoria);
          formData.append('descripcion', this.puntoDeInteres.descripcion);
          formData.append('direccion', this.puntoDeInteres.direccion || '');

          // Procesar icono si es necesario
          if (this.modoIcono === 'generar' && this.generatedIcon) {
            console.log('6. Procesando icono generado');
            const base64Response = await fetch(`data:image/png;base64,${this.generatedIcon.base64}`);
            const blob = await base64Response.blob();
            formData.append('icono', blob, 'generated-icon.png');
          } else if (this.modoIcono === 'subir' && this.nuevoIcono) {
            formData.append('icono', this.nuevoIcono);
          }

          // Procesar multimedia generada
          if (this.generatedMultimedia.length > 0) {
            console.log('7. Procesando multimedia generada');
            for (const multimedia of this.generatedMultimedia) {
              try {
                console.log('8. Procesando item multimedia:', multimedia);
                const base64Response = await fetch(`data:image/png;base64,${multimedia.base64}`);
                const blob = await base64Response.blob();
                formData.append('multimedia', blob, `generated-multimedia-${Date.now()}.png`);
                console.log('9. Multimedia agregada al FormData');
              } catch (error) {
                console.error('10. Error procesando multimedia:', error);
              }
            }
          }

          // Procesar archivos subidos
          if (this.nuevaMultimedia.length > 0) {
            console.log('11. Procesando archivos subidos');
            for (const file of this.nuevaMultimedia) {
              formData.append('multimedia', file);
            }
          }

          // Verificar contenido del FormData
          console.log('12. Contenido del FormData:');
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }

          console.log('13. Enviando petición al servidor');
          const response = await axios.patch(
            `/crm/puntos-de-interes/${this.puntoDeInteres.id}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          console.log('14. Respuesta del servidor:', response.data);
          this.puntoDeInteres = response.data;
          this.editando = false;
          this.nuevoIcono = null;
          this.generatedIcon = null;
          this.modoIcono = null;
          this.modoMultimedia = null;
          this.generatedMultimedia = [];
          this.nuevaMultimedia = [];
          
        } catch (error) {
          console.error('15. Error al guardar cambios:', error);
          if (error.response) {
            console.error('16. Respuesta de error del servidor:', error.response.data);
          }
        }
      },
      handleIconoChange(event) {
        if (event.target.files.length > 0) {
          this.nuevoIcono = event.target.files[0];
          this.generatedIcon = null; // Limpiar icono generado
        }
      },
      handleMultimediaChange(event) {
        this.nuevaMultimedia = Array.from(event.target.files);
      },
      async eliminarMultimedia(id) {
        try {
          await axios.delete(`/crm/puntos-de-interes/${this.puntoDeInteres.id}/multimedia/${id}/`);
          await this.cargarPuntoDeInteres();
        } catch (error) {
          console.error('Error al eliminar multimedia:', error);
        }
      },
      volver() {
        this.$router.go(-1);
      },
      setGeneratedIcon(iconData) {
        console.log('Icono generado recibido:', iconData);
        this.generatedIcon = iconData; // Almacena la URL generada
        this.nuevoIcono = null; // Limpiar icono subido
      },
      setGeneratedMultimedia(multimediaData) {
        console.log('1. Multimedia generada recibida:', multimediaData);
        console.log('2. Estado actual de generatedMultimedia:', this.generatedMultimedia);
        this.generatedMultimedia.push(multimediaData);
        console.log('3. Estado actualizado de generatedMultimedia:', this.generatedMultimedia);
      },
      removeGeneratedImage(index) {
        this.generatedMultimedia.splice(index, 1);
      },
    }
  }
  </script>
  
  <style scoped>
  .detalles-punto-interes {
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
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .icono-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .icono-container img {
    max-width: 100px;
    height: auto;
    margin-right: 20px;
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
  
  .icono-opciones {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .selector-modo {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .selector-modo label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .preview-section {
    margin-top: 20px;
  }
  
  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 10px;
  }
  
  .preview-item {
    position: relative;
  }
  
  .preview-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .preview-item button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    border-radius: 4px;
  }
  
  .selector-modo {
    margin-bottom: 20px;
    display: flex;
    gap: 20px;
  }
  
  .selector-modo label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  </style>