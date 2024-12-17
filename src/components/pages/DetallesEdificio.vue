<template>
    <div class="detalles-edificio" v-if="edificio">
        <div class="header-section">
            <h1>{{ edificio.nombre }}</h1>
            <div class="actions">
                <button v-if="!isEditing" @click="isEditing = true" class="btn btn-primary">
                    Editar
                </button>
                <template v-else>
                    <button @click="guardarCambios" class="btn btn-success">Guardar</button>
                    <button @click="cancelarEdicion" class="btn btn-secondary">Cancelar</button>
                </template>
            </div>
        </div>

        <div class="info-section">
            <div class="main-info">
                <!-- Información básica -->
                <div class="campo">
                    <span class="etiqueta">Nombre:</span>
                    <input v-if="isEditing" v-model="edificioEditado.nombre" class="input" />
                    <span v-else class="valor">{{ edificio.nombre }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Sigla:</span>
                    <input v-if="isEditing" v-model="edificioEditado.sigla" class="input" />
                    <span v-else class="valor">{{ edificio.sigla || 'N/A' }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Desarrollador:</span>
                    <input v-if="isEditing" v-model="edificioEditado.desarrollador" class="input" />
                    <span v-else class="valor">{{ edificio.desarrollador }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Descripción:</span>
                    <textarea v-if="isEditing" v-model="edificioEditado.descripcion" class="input textarea"></textarea>
                    <span v-else class="valor">{{ edificio.descripcion }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Dirección:</span>
                    <input v-if="isEditing" v-model="edificioEditado.direccion" class="input" />
                    <span v-else class="valor">{{ edificio.direccion }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Teléfono:</span>
                    <input v-if="isEditing" v-model="edificioEditado.telefono" class="input" />
                    <span v-else class="valor">{{ edificio.telefono || 'N/A' }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Estrato:</span>
                    <input v-if="isEditing" v-model="edificioEditado.estrato" type="number" class="input" />
                    <span v-else class="valor">{{ edificio.estrato }}</span>
                </div>

                <!-- Información del Barrio -->
                <div class="campo">
                    <span class="etiqueta">Barrio:</span>
                    <select v-if="isEditing" v-model="edificioEditado.barrio" class="input">
                        <option v-for="barrio in barrios" :key="barrio.id" :value="barrio.id">
                            {{ barrio.nombre }}
                        </option>
                    </select>
                    <span v-else class="valor">{{ edificio.barrio ? edificio.barrio.nombre : 'N/A' }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Amenidades:</span>
                    <multiselect
                        v-if="isEditing"
                        v-model="edificioEditado.amenidades"
                        :options="amenidades"
                        :multiple="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :preserve-search="true"
                        placeholder="Seleccione amenidades"
                        label="nombre"
                        track-by="id"
                        :preselect-first="false"
                    >
                        <template v-slot:selection="{ values, isOpen }">
                            <span class="multiselect__single" v-if="values.length && !isOpen">
                                {{ values.length }} amenidad(es) seleccionada(s)
                            </span>
                        </template>
                    </multiselect>
                    <span v-else class="valor">
                        {{ edificio.amenidades.map(a => a.nombre).join(', ') || 'N/A' }}
                    </span>
                </div>
            </div>

            <!-- Relaciones -->
            <div class="relaciones-section">
                <h3>Características Interiores</h3>
                <div class="lista-items">
                    <div v-for="caract in edificio.caracteristicas_interiores" :key="caract.id">
                        {{ caract.nombre }}
                    </div>
                </div>

                <h3>Amenidades</h3>
                <div class="lista-items-amenidades">
                    <div v-for="amenidad in edificio.amenidades" :key="amenidad.id" class="amenidad-item">
                        <img v-if="amenidad.icono" :src="amenidad.icono" alt="Icono de amenidad" class="icono-amenidad">
                        <span>{{ amenidad.nombre }}</span>
                    </div>
                </div>

                <h3>Zonas de Interés</h3>
                <div class="lista-items">
                    <div v-for="zona in edificio.zonas_de_interes" :key="zona.id" class="zona-interes-item">
                        <img v-if="zona.icono" :src="zona.icono" alt="Icono de zona de interés" class="icono-zona-interes">
                        <span>{{ zona.nombre }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sección de Imágenes y Videos -->
        <section class="seccion" v-if="isEditing || (edificio.multimedia && edificio.multimedia.length > 0)">
            <h2>Imágenes y Videos</h2>
            <div class="galeria-imagenes">
                <div 
                    v-for="imagen in edificio.multimedia" 
                    :key="imagen.id" 
                    class="imagen-container"
                >
                    <template v-if="imagen.tipo === 'foto'">
                        <img 
                            :src="imagen.archivo_url" 
                            :alt="imagen.titulo || 'Imagen de edificio'" 
                            class="imagen"
                        >
                    </template>
                    <template v-else-if="imagen.tipo === 'video'">
                        <video controls class="imagen">
                            <source :src="imagen.archivo_url" type="video/mp4">
                            Tu navegador no soporta la etiqueta de video.
                        </video>
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
                                @click="eliminarMultimedia(imagen.id)" 
                                class="btn-eliminar"
                                title="Eliminar multimedia"
                            >
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Formulario para agregar multimedia (visible en modo edición) -->
            <div v-if="isEditing" class="agregar-multimedia">
                <h3>Agregar Nueva Multimedia</h3>
                <form @submit.prevent="agregarMultimedia">
                    <input 
                        type="file" 
                        @change="onFileSelected" 
                        accept="image/*,video/*"
                    >
                    <input 
                        v-model="nuevaMultimedia.titulo" 
                        placeholder="Título de la multimedia"
                    >
                    <textarea 
                        v-model="nuevaMultimedia.descripcion" 
                        placeholder="Descripción"
                    ></textarea>
                    <select v-model="nuevaMultimedia.tipo">
                        <option value="foto">Foto</option>
                        <option value="video">Video</option>
                    </select>
                    <button type="submit">Agregar Multimedia</button>
                </form>
            </div>
        </section>
    </div>
</template>

<script>
import axios from '@/utils/axios';
import eventBus from '@/utils/eventBus';
import Multiselect from 'vue-multiselect';

export default {
    name: 'DetallesEdificio',
    components: {
        Multiselect
    },
    data() {
        return {
            edificio: null,
            edificioEditado: null,
            isEditing: false,
            barrios: [],
            amenidades: [],
            nuevaMultimedia: {
                archivo: null,
                titulo: '',
                descripcion: '',
                tipo: 'foto'
            },
            editandoMultimedia: null,
            imagenEditada: {
                titulo: '',
                descripcion: ''
            }
        }
    },
    async created() {
        await this.cargarEdificio();
        await this.cargarBarrios();
        await this.cargarAmenidades();
    },
    methods: {
        async cargarEdificio() {
            try {
                const id = this.$route.params.id;
                const response = await axios.get(`/crm/edificios/${id}/`);
                this.edificio = response.data;
                this.edificioEditado = { ...response.data };

                // Agregar logs para depuración
                console.log('Edificio cargado:', this.edificio);
                console.log('Barrio asociado:', this.edificio.barrio);

                // Si el barrio es solo un ID, puedes hacer una llamada adicional para obtener los detalles
                if (this.edificio.barrio) {
                    const barrioResponse = await axios.get(`/crm/barrio/${this.edificio.barrio}/`);
                    this.edificio.barrio = barrioResponse.data; // Poblamos el objeto barrio
                    console.log('Detalles del barrio:', this.edificio.barrio);
                }
            } catch (error) {
                console.error('Error al cargar edificio:', error);
                alert('Error al cargar los datos del edificio');
            }
        },
        async cargarBarrios() {
            try {
                const response = await axios.get('/crm/barrio/');
                this.barrios = response.data;
            } catch (error) {
                console.error('Error al cargar barrios:', error);
            }
        },
        async cargarAmenidades() {
            try {
                const response = await axios.get('/crm/amenidades/');
                this.amenidades = response.data;
                console.log('Amenidades cargadas:', this.amenidades);
            } catch (error) {
                console.error('Error al cargar amenidades:', error);
            }
        },
        async guardarCambios() {
            try {
                const datosAEnviar = { ...this.edificioEditado };
                
                console.log('Datos originales:', datosAEnviar);
                console.log('Amenidades antes de procesar:', datosAEnviar.amenidades);
                
                // Asegurarse de que barrio sea un ID
                if (typeof datosAEnviar.barrio === 'object') {
                    datosAEnviar.barrio = datosAEnviar.barrio.id;
                }

                // Asegurarse de que las amenidades sean solo IDs
                if (datosAEnviar.amenidades) {
                    datosAEnviar.amenidades_ids = datosAEnviar.amenidades.map(a => 
                        typeof a === 'object' ? a.id : a
                    );
                    delete datosAEnviar.amenidades;  // Eliminar el campo original
                }

                // Eliminar campos que no deben enviarse
                delete datosAEnviar.barrio_nombre;
                delete datosAEnviar.barrio_data;
                delete datosAEnviar.caracteristicas_interiores;
                delete datosAEnviar.zonas_de_interes;
                delete datosAEnviar.multimedia;

                console.log('Datos a enviar:', datosAEnviar);

                const response = await axios.put(
                    `/crm/edificios/${this.edificio.id}/`,
                    datosAEnviar
                );

                console.log('Respuesta del servidor:', response.data);

                this.edificio = response.data;
                this.edificioEditado = { ...response.data };
                this.isEditing = false;
                
                eventBus.emit('edificio-updated', response.data);
                
                alert("Cambios guardados exitosamente");
            } catch (error) {
                console.error('Error completo:', error);
                console.error('Datos del error:', error.response?.data);
                alert("Error al guardar los cambios: " + (error.response?.data?.error || error.message));
            }
        },
        cancelarEdicion() {
            this.edificioEditado = { ...this.edificio };
            this.isEditing = false;
        },
        onFileSelected(event) {
            this.nuevaMultimedia.archivo = event.target.files[0];
        },
        async agregarMultimedia() {
            try {
                const formData = new FormData();
                formData.append('archivo', this.nuevaMultimedia.archivo);
                formData.append('titulo', this.nuevaMultimedia.titulo);
                formData.append('descripcion', this.nuevaMultimedia.descripcion);
                formData.append('tipo', this.nuevaMultimedia.tipo);

                const response = await axios.post(
                    `/crm/edificios/${this.edificio.id}/agregar-multimedia/`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                // Utiliza la respuesta aquí, por ejemplo, para mostrar un mensaje
                console.log("Respuesta del servidor:", response.data);
                alert('Multimedia agregada exitosamente');

                // Actualiza el edificio con los nuevos datos
                await this.cargarEdificio();

                // Limpiar el formulario
                this.nuevaMultimedia = {
                    archivo: null,
                    titulo: '',
                    descripcion: '',
                    tipo: 'foto'
                };
            } catch (error) {
                console.error('Error al agregar multimedia:', error);
                alert('Error al agregar multimedia: ' + (error.response?.data?.error || error.message));
            }
        },
        async eliminarMultimedia(multimediaId) {
            try {
                if (!confirm('¿Está seguro de eliminar este elemento?')) return;

                await axios.delete(`/crm/edificios/${this.edificio.id}/multimedia/${multimediaId}/`);
                await this.cargarEdificio();
            } catch (error) {
                console.error('Error al eliminar multimedia:', error);
                alert('Error al eliminar multimedia');
            }
        }
    }
}
</script>

<style scoped>
.detalles-edificio {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.actions {
    display: flex;
    gap: var(--spacing-sm);
}

.info-section {
    display: grid;
    gap: var(--spacing-lg);
}

.campo {
    margin-bottom: var(--spacing-md);
}

.etiqueta {
    font-weight: bold;
    margin-right: var(--spacing-sm);
}

.input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
}

.textarea {
    min-height: 100px;
}

.relaciones-section {
    margin-top: var(--spacing-lg);
}

.lista-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-sm);
    margin: var(--spacing-md) 0;
}

.lista-items > div {
    padding: var(--spacing-sm);
    background-color: var(--color-background-light);
    border-radius: var(--border-radius-sm);
}

.lista-items-amenidades img {
    width: 20px;
    height: 20px;
}

.zona-interes-item img {
    width: 20px;
    height: 20px;
}

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

.imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.imagen-info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: var(--spacing-sm);
    background-color: rgba(0, 0, 0, 0.5);
    color: var(--color-white);
    border-radius: var(--border-radius-lg);
    transition: opacity var(--transition-normal);
    opacity: 0;
}

.imagen-info:hover {
    opacity: 1;
}

.titulo {
    font-size: var(--font-size-md);
    font-weight: bold;
    margin-bottom: var(--spacing-sm);
}

.descripcion {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-sm);
}

.multimedia-actions {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    display: flex;
    gap: var(--spacing-sm);
}

.btn-guardar,
.btn-cancelar {
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: background-color var(--transition-normal);
}

.btn-guardar:hover,
.btn-cancelar:hover {
    background-color: var(--color-background-light);
}

.edit-input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    margin-bottom: var(--spacing-sm);
}

.edit-buttons {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
}

.agregar-multimedia {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--color-background-light);
    border-radius: var(--border-radius-lg);
}

.agregar-multimedia h3 {
    font-size: var(--font-size-md);
    font-weight: bold;
    margin-bottom: var(--spacing-sm);
}

.agregar-multimedia form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.agregar-multimedia input,
.agregar-multimedia textarea,
.agregar-multimedia select {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
}

.agregar-multimedia button {
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: background-color var(--transition-normal);
}

.agregar-multimedia button:hover {
    background-color: var(--color-background-light);
}

@import 'vue-multiselect/dist/vue-multiselect.min.css';
</style>