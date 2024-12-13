<template>
  <div class="detalles-propiedad">
    <header class="header">
      <h1>{{ propiedad?.titulo || 'Detalles de Propiedad' }}</h1>
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

    <div v-if="propiedad" class="contenido">
      <!-- Información Básica -->
      <section class="seccion">
        <h2>Información Básica</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Código:</span>
            <span class="valor">{{ propiedad.codigo || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Título:</span>
            <input v-if="isEditing" v-model="propiedadEditada.titulo" class="input" />
            <span v-else class="valor">{{ propiedad.titulo || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Tipo de Propiedad:</span>
            <input v-if="isEditing" v-model="propiedadEditada.tipo_propiedad" class="input" />
            <span v-else class="valor">{{ propiedad.tipo_propiedad || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Modalidad de Negocio:</span>
            <input v-if="isEditing" v-model="propiedadEditada.modalidad_de_negocio" class="input" />
            <span v-else class="valor">{{ propiedad.modalidad_de_negocio || 'No disponible' }}</span>
          </div>
        </div>
      </section>

      <!-- Información del Propietario y Agente -->
      <section class="seccion">
        <h2>Contactos</h2>
        <div class="grid">
          <div class="subseccion">
            <h3>Propietario</h3>
            <div v-if="propiedad.propietario">
              <p>Nombre: {{ propiedad.propietario.nombre }}</p>
              <p>Teléfono: {{ propiedad.propietario.telefono }}</p>
              <p>Email: {{ propiedad.propietario.email }}</p>
            </div>
            <p v-else>No hay información del propietario</p>
          </div>
          <div class="subseccion">
            <h3>Agente</h3>
            <div v-if="propiedad.agente">
              <p>Nombre: {{ propiedad.agente.nombre }}</p>
              <p>Teléfono: {{ propiedad.agente.telefono }}</p>
              <p>Email: {{ propiedad.agente.email }}</p>
            </div>
            <p v-else>No hay información del agente</p>
          </div>
        </div>
      </section>

      <!-- Características -->
      <section class="seccion">
        <h2>Características</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Área Construida:</span>
            <input v-if="isEditing" v-model="propiedadEditada.metro_cuadrado_construido" class="input" />
            <span v-else class="valor">{{ propiedad.metro_cuadrado_construido || 0 }} m²</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Área Total:</span>
            <input v-if="isEditing" v-model="propiedadEditada.metro_cuadrado_propiedad" class="input" />
            <span v-else class="valor">{{ propiedad.metro_cuadrado_propiedad || 0 }} m²</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Habitaciones:</span>
            <input v-if="isEditing" v-model="propiedadEditada.habitaciones" class="input" />
            <span v-else class="valor">{{ propiedad.habitaciones || 0 }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Baños:</span>
            <input v-if="isEditing" v-model="propiedadEditada.banos" class="input" />
            <span v-else class="valor">{{ propiedad.banos || 0 }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Nivel:</span>
            <input v-if="isEditing" v-model="propiedadEditada.nivel" class="input" />
            <span v-else class="valor">{{ propiedad.nivel || 'No disponible' }}</span>
          </div>
        </div>
      </section>

      <!-- Información Adicional -->
      <section class="seccion">
        <h2>Información Adicional</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Estrato:</span>
            <input v-if="isEditing" v-model="propiedadEditada.estrato" class="input" />
            <span v-else class="valor">{{ propiedad.estrato || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Valor Administración:</span>
            <input v-if="isEditing" v-model="propiedadEditada.valor_administracion" class="input" />
            <span v-else class="valor">${{ formatearNumero(propiedad.valor_administracion) }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Valor Predial:</span>
            <input v-if="isEditing" v-model="propiedadEditada.valor_predial" class="input" />
            <span v-else class="valor">${{ formatearNumero(propiedad.valor_predial) }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Fecha de Ingreso:</span>
            <span class="valor">{{ formatFecha(propiedad.fecha_ingreso) }}</span>
            <span class="tiempo-transcurrido">{{ calcularTiempo(propiedad.fecha_ingreso) }}</span>
          </div>
        </div>
      </section>

      <!-- Descripción -->
      <section class="seccion">
        <h2>Descripción</h2>
        <textarea v-if="isEditing" v-model="propiedadEditada.descripcion" class="input descripcion"></textarea>
        <p v-else class="descripcion">{{ propiedad.descripcion || 'Sin descripción disponible' }}</p>
      </section>

      <!-- Amenidades -->
      <section class="seccion">
        <h2>Amenidades</h2>
        <div v-if="propiedad.amenidades">
          <ul>
            <li v-for="amenidad in propiedad.amenidades" :key="amenidad.id">
              {{ amenidad.nombre }} - {{ amenidad.descripcion }}
            </li>
          </ul>
        </div>
        <p v-else>No hay amenidades disponibles</p>
      </section>

      <!-- Sección de Imágenes -->
      <section class="seccion">
        <h2>Imágenes</h2>
        <div class="galeria-imagenes">
          <div v-for="imagen in propiedad.multimedia" :key="imagen.id" class="imagen-container">
            <img :src="getFullImageUrl(imagen.archivo_url)" :alt="imagen.titulo || 'Imagen de propiedad'">
            <div class="imagen-info">
              <p>{{ imagen.titulo || 'Sin título' }}</p>
              <p>{{ imagen.descripcion || 'Sin descripción' }}</p>
            </div>
          </div>
        </div>

        <!-- Formulario para agregar imágenes (visible en modo edición) -->
        <div v-if="isEditing" class="agregar-imagen">
          <h3>Agregar Nueva Imagen</h3>
          <form @submit.prevent="agregarImagen">
            <input 
              type="file" 
              @change="onFileSelected" 
              accept="image/*"
            >
            <input 
              v-model="nuevaImagen.titulo" 
              placeholder="Título de la imagen"
            >
            <textarea 
              v-model="nuevaImagen.descripcion" 
              placeholder="Descripción"
            ></textarea>
            <button type="submit">Agregar Imagen</button>
          </form>
        </div>
      </section>

      <div v-if="isEditing">
        <h3>Amenidades</h3>
        <select v-model="propiedadEditada.amenidades" multiple class="input">
          <option v-for="amenidad in amenidadesDisponibles" :key="amenidad.id" :value="amenidad.id">
            {{ amenidad.nombre }} ({{ amenidad.categoria }})
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detalles-propiedad {
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

.seccion h2 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.5rem;
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

.descripcion {
  line-height: 1.6;
  color: var(--color-loblolly-950);
}

.tiempo-transcurrido {
  font-size: 0.8rem;
  color: var(--color-loblolly-700);
  font-style: italic;
}

.subseccion {
  background-color: var(--color-white-sand-50);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.subseccion h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 1.2rem;
}

.input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-mine-shaft-100);
  border-radius: var(--border-radius-sm);
  font-family: var(--font-league);
  transition: border-color var(--transition-normal);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.galeria-imagenes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.imagen-container {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.imagen-container img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.imagen-info {
  padding: var(--spacing-sm);
}

.agregar-imagen {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius-sm);
}
</style>

<script>
import axios from '@/utils/axios';

export default {
  name: 'DetallesDePropiedad',
  data() {
    return {
      propiedad: null,
      propiedadEditada: {},
      isEditing: false,
      amenidadesDisponibles: [],
      nuevaImagen: {
        archivo: null,
        titulo: '',
        descripcion: ''
      }
    }
  },
  async created() {
    try {
      console.log('ID de la propiedad:', this.$route.params.id);
      const response = await axios.get(`/crm/propiedades/${this.$route.params.id}/`);
      console.log('Respuesta de la API:', response.data);
      this.propiedad = response.data.propiedad;
      this.amenidadesDisponibles = response.data.amenidades_disponibles;
      
      if (this.propiedad?.multimedia) {
        this.propiedad.multimedia.forEach(media => {
          console.log("URL de imagen:", media.archivo_url);
        });
      }
    } catch (error) {
      console.error('Error al cargar los detalles de la propiedad:', error);
    }
  },
  mounted() {
    if (this.propiedad && this.propiedad.multimedia) {
      this.propiedad.multimedia.forEach(media => {
        console.log("URL de imagen:", media.archivo_url);
      });
    }
  },
  methods: {
    activarEdicion() {
      this.propiedadEditada = { ...this.propiedad };
      this.isEditing = true;
    },
    volver() {
      this.$router.go(-1);
    },
    async guardarCambios() {
      try {
        // Crear una copia de los datos a enviar
        const datosActualizados = { ...this.propiedadEditada };
        
        // Asegurarse de que los campos numéricos sean números
        const camposNumericos = [
          'metro_cuadrado_construido',
          'metro_cuadrado_propiedad',
          'habitaciones',
          'banos',
          'valor_administracion',
          'valor_predial',
          'estrato'
        ];

        camposNumericos.forEach(campo => {
          if (datosActualizados[campo]) {
            datosActualizados[campo] = parseInt(datosActualizados[campo], 10);
          }
        });

        // Eliminar campos que no deberían enviarse
        delete datosActualizados.multimedia;
        delete datosActualizados.amenidades;

        const response = await axios.put(
          `/crm/propiedades/${this.$route.params.id}/`,
          datosActualizados
        );

        // Actualizar los datos locales
        this.propiedad = response.data;
        this.isEditing = false;

      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        // Aquí podrías agregar una notificación al usuario
      }
    },
    formatFecha(fecha) {
      if (!fecha) return 'Null';
      const date = new Date(fecha);
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    },
    calcularTiempo(fecha) {
      if (!fecha) return 'Null';
      const fechaIngreso = new Date(fecha);
      const hoy = new Date();
      const diferencia = hoy - fechaIngreso;
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      return `${dias} días desde la fecha de ingreso`;
    },
    formatearNumero(numero) {
      return numero ? numero.toLocaleString('es-CO') : '0';
    },
    onFileSelected(event) {
      console.log("Archivo seleccionado:", event.target.files[0]);
      this.nuevaImagen.archivo = event.target.files[0];
    },
    async agregarImagen() {
      try {
        if (!this.nuevaImagen.archivo) {
          console.error("No se ha seleccionado ningún archivo");
          return;
        }

        const formData = new FormData();
        formData.append('archivo', this.nuevaImagen.archivo);
        formData.append('titulo', this.nuevaImagen.titulo || '');
        formData.append('descripcion', this.nuevaImagen.descripcion || '');

        console.log("Enviando archivo:", {
          nombre: this.nuevaImagen.archivo.name,
          tipo: this.nuevaImagen.archivo.type,
          tamaño: this.nuevaImagen.archivo.size
        });

        const response = await axios.post(
          `/crm/propiedades/${this.$route.params.id}/agregar_imagen/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        console.log("Respuesta del servidor:", response.data);
        
        // Actualizar la lista de multimedia
        if (response.data) {
          if (!this.propiedad.multimedia) {
            this.propiedad.multimedia = [];
          }
          this.propiedad.multimedia.push(response.data);
        }

        // Limpiar el formulario
        this.nuevaImagen = {
          archivo: null,
          titulo: '',
          descripcion: ''
        };

      } catch (error) {
        console.error("Error al subir imagen:", error.response || error);
      }
    },
    getFullImageUrl(url) {
      if (url && !url.startsWith('http')) {
        return `http://localhost:8000${url}`;
      }
      return url;
    }
  }
}
</script>