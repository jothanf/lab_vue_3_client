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
                <div class="info-tarjeta">
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
                        <span class="etiqueta">Estado:</span>
                        <select v-if="isEditing" v-model="edificioEditado.estado" class="input">
                            <option v-for="estado in estados" :key="estado" :value="estado">
                                {{ estado }}
                            </option>
                        </select>
                        <span v-else class="valor">{{ edificio.estado }}</span>
                    </div>

                    <div class="campo">
                        <span class="etiqueta">Tipo de edificio:</span>
                        <select v-if="isEditing" v-model="edificioEditado.tipo_edificio" class="input">
                            <option v-for="tipo in tiposEdificio" :key="tipo" :value="tipo">
                                {{ tipo }}
                            </option>
                        </select>
                        <span v-else class="valor">{{ edificio.tipo_edificio }}</span>
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

                    <div v-if="isEditing" class="campo">
                        <span class="etiqueta">Amenidades:</span>
                        <multiselect
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
                    </div>

                    <div v-if="isEditing" class="campo">
                        <span class="etiqueta">Zonas de Interés:</span>
                        <multiselect
                            v-model="edificioEditado.zonas_de_interes"
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
                </div>
            </div>

            <!-- Relaciones -->
            <div class="relaciones-section">
                <div class="lista-items-amenidades">
                    <h3>Amenidades</h3>
                    <div v-for="amenidad in edificio.amenidades" :key="amenidad.id" class="amenidad-item" @click="abrirPopupAmenidad(amenidad)">
                        <img v-if="amenidad.icono" :src="amenidad.icono" alt="Icono de amenidad" class="icono-amenidad">
                        <span>{{ amenidad.nombre }}</span>
                    </div>
                </div>

                <div class="lista-items">
                    <h3>Zonas de Interés</h3>
                    <div v-for="zona in edificio.zonas_de_interes" :key="zona.id" class="zona-interes-item" @click="abrirPopup(zona)">
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

        <!-- Popup para mostrar información de la zona de interés -->
        <MyPopUp :visible="popupVisible" :titulo="zonaInteresSeleccionada?.nombre" @cerrar="cerrarPopup">
            <div>
                <img v-if="zonaInteresSeleccionada?.icono" :src="zonaInteresSeleccionada.icono" alt="Icono de zona de interés" class="icono-zona-popup">
                <p><strong>Nombre:</strong> {{ zonaInteresSeleccionada?.nombre }}</p>
                <p><strong>Categoría:</strong> {{ zonaInteresSeleccionada?.categoria }}</p>
                <p><strong>Descripción:</strong> {{ zonaInteresSeleccionada?.descripcion }}</p>
                <p><strong>Ubicación:</strong> {{ zonaInteresSeleccionada?.ubicacion }}</p>
                <p><strong>Dirección:</strong> {{ zonaInteresSeleccionada?.direccion }}</p>

                <!-- Mostrar multimedia asociada -->
                <div v-if="zonaInteresSeleccionada?.multimedia && zonaInteresSeleccionada.multimedia.length">
                    <h4>Multimedia:</h4>
                    <div class="galeria-multimedia">
                        <div v-for="item in zonaInteresSeleccionada.multimedia" :key="item.id" class="multimedia-item">
                            <template v-if="item.tipo === 'foto'">
                                <img :src="item.archivo" alt="Multimedia de zona de interés" class="multimedia-imagen">
                            </template>
                            <template v-else-if="item.tipo === 'video'">
                                <video controls class="multimedia-video">
                                    <source :src="item.archivo" type="video/mp4">
                                    Tu navegador no soporta la etiqueta de video.
                                </video>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </MyPopUp>

        <!-- Popup para mostrar información de la amenidad -->
        <MyPopUp :visible="popupAmenidadVisible" :titulo="amenidadSeleccionada?.nombre" @cerrar="cerrarPopupAmenidad">
            <div>
                <img v-if="amenidadSeleccionada?.icono" :src="amenidadSeleccionada.icono" alt="Icono de amenidad" class="icono-amenidad-popup">
                <p><strong>Nombre:</strong> {{ amenidadSeleccionada?.nombre }}</p>
                <p><strong>Categoría:</strong> {{ amenidadSeleccionada?.categoria }}</p>
                <p><strong>Descripción:</strong> {{ amenidadSeleccionada?.descripcion }}</p>
            </div>
        </MyPopUp>
    </div>
</template>

<script>
import axios from '@/utils/axios';
import eventBus from '@/utils/eventBus';
import Multiselect from 'vue-multiselect';
import MyPopUp from '@/components/molecules/MyPopUp.vue';
import { useAppStore } from '@/store';

export default {
    name: 'DetallesEdificio',
    components: {
        Multiselect,
        MyPopUp,
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
            },
            zonasDeInteres: [],
            estados: ['Entregado', 'En construcción', 'Pre-construccion'],
            tiposEdificio: ['Edificio Residencial', 'Conjunto Residencial', 'Club House'],
            popupVisible: false,
            zonaInteresSeleccionada: null,
            popupAmenidadVisible: false,
            amenidadSeleccionada: null,
        }
    },
    async created() {
        await this.cargarEdificio();
        await this.cargarBarrios();
        await this.cargarAmenidades();
        await this.cargarZonasDeInteres();
    },
    methods: {
        async cargarEdificio() {
            try {
                const id = this.$route.params.id;
                const response = await axios.get(`/crm/edificios/${id}/`);
                this.edificio = response.data;
                this.edificioEditado = { ...response.data };

                // Asegúrate de que el store esté definido antes de llamar a updateContext
                if (this.store) {
                    this.store.updateContext(this.edificio);
                    console.log('Contexto actualizado con el edificio:', this.edificio);
                } else {
                    console.error('El store no está definido.');
                }

                console.log('Respuesta de la API:', response.data);
            } catch (error) {
                console.error('Error al cargar edificio:', error);
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
        async cargarZonasDeInteres() {
            try {
                const response = await axios.get('/crm/zonasDeInteres/');
                this.zonasDeInteres = response.data;
                console.log('Zonas de interés cargadas:', this.zonasDeInteres);
            } catch (error) {
                console.error('Error al cargar zonas de interés:', error);
            }
        },
        async guardarCambios() {
            try {
                const datosAEnviar = { ...this.edificioEditado };
                
                console.log('Datos originales:', datosAEnviar);
                
                // Asegurarse de que barrio sea un ID
                if (typeof datosAEnviar.barrio === 'object') {
                    datosAEnviar.barrio = datosAEnviar.barrio.id;
                }

                // Procesar amenidades
                if (datosAEnviar.amenidades) {
                    datosAEnviar.amenidades_ids = datosAEnviar.amenidades.map(a => 
                        typeof a === 'object' ? a.id : a
                    );
                    delete datosAEnviar.amenidades;
                }

                // Procesar zonas de interés
                if (datosAEnviar.zonas_de_interes) {
                    datosAEnviar.zonas_de_interes_ids = datosAEnviar.zonas_de_interes.map(z => 
                        typeof z === 'object' ? z.id : z
                    );
                    delete datosAEnviar.zonas_de_interes;
                }

                // Eliminar campos que no deben enviarse
                delete datosAEnviar.barrio_nombre;
                delete datosAEnviar.barrio_data;
                delete datosAEnviar.caracteristicas_interiores;
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

                console.log('Intentando eliminar multimedia:', multimediaId);
                
                await axios.delete(`/crm/edificios/${this.edificio.id}/multimedia/${multimediaId}/`);
                console.log('Multimedia eliminada exitosamente');
                
                // Recargar el edificio para actualizar la lista de multimedia
                await this.cargarEdificio();
            } catch (error) {
                console.error('Error al eliminar multimedia:', error);
                alert('Error al eliminar multimedia: ' + (error.response?.data?.error || error.message));
            }
        },
        abrirPopup(zona) {
            this.zonaInteresSeleccionada = zona;
            this.popupVisible = true;
        },
        cerrarPopup() {
            this.popupVisible = false;
            this.zonaInteresSeleccionada = null;
        },
        abrirPopupAmenidad(amenidad) {
            this.amenidadSeleccionada = amenidad;
            this.popupAmenidadVisible = true;
        },
        cerrarPopupAmenidad() {
            this.popupAmenidadVisible = false;
            this.amenidadSeleccionada = null;
        }
    },
    setup() {
        const store = useAppStore();
        console.log('Store:', store);
        return { store };
    }
}
</script>

<style scoped>
@import 'vue-multiselect/dist/vue-multiselect.min.css';
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
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-md);
}

.lista-items-amenidades,
.lista-items {
    flex: 1;
    padding: var(--spacing-md);
    margin-right: var(--spacing-md);
    border: 1px solid var(--color-mine-shaft-100);
    border-radius: var(--border-radius-lg);
    background-color: var(--color-white);
}

.lista-items:last-child {
    margin-right: 0;
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


.info-tarjeta {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.campo {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.lista-items-amenidades {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-sm);
    margin: var(--spacing-md) 0;
}

.lista-items-amenidades > div {
    padding: var(--spacing-sm);
    background-color: var(--color-background-light);
    border-radius: var(--border-radius-sm);
}

/* Efecto hover para amenidades y zonas de interés */
.amenidad-item,
.zona-interes-item {
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
}

.amenidad-item:hover,
.zona-interes-item:hover {
    background-color: #f0f0f0; /* Cambia el color de fondo al hacer hover */
    transform: scale(1.05); /* Aumenta ligeramente el tamaño */
}

.icono-amenidad-popup {
    max-width: 100px; /* Ajusta el tamaño máximo de la imagen */
    height: auto; /* Mantiene la proporción de la imagen */
    margin-bottom: 10px; /* Espacio inferior para separar de los textos */
}

.icono-zona-popup {
    max-width: 100px; /* Ajusta el tamaño máximo de la imagen */
    height: auto; /* Mantiene la proporción de la imagen */
    margin-bottom: 10px; /* Espacio inferior para separar de los textos */
}

.galeria-multimedia {
    display: flex;
    flex-wrap: wrap;
    gap: 10px; /* Espacio entre elementos multimedia */
}

.multimedia-item {
    max-width: 150px; /* Ajusta el tamaño máximo de las imágenes */
}

.multimedia-imagen {
    width: 100%; /* Asegura que la imagen ocupe el contenedor */
    height: auto; /* Mantiene la proporción de la imagen */
}

.multimedia-video {
    width: 100%; /* Asegura que el video ocupe el contenedor */
    height: auto; /* Mantiene la proporción del video */
}
</style>