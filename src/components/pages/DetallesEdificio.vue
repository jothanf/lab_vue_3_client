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
                <div class="campo">
                    <span class="etiqueta">Nombre:</span>
                    <input v-if="isEditing" v-model="edificioEditado.nombre" class="input" />
                    <span v-else class="valor">{{ edificio.nombre }}</span>
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
                    <span class="etiqueta">Estrato:</span>
                    <input v-if="isEditing" v-model="edificioEditado.estrato" type="number" class="input" />
                    <span v-else class="valor">{{ edificio.estrato }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Barrio:</span>
                    <select v-if="isEditing" v-model="edificioEditado.barrio" class="input">
                        <option v-for="barrio in barrios" :key="barrio.id" :value="barrio.id">
                            {{ barrio.nombre }}
                        </option>
                    </select>
                    <span v-else class="valor">{{ edificio.barrio_nombre }}</span>
                </div>

                <div class="campo">
                    <span class="etiqueta">Zona:</span>
                    <select v-if="isEditing" v-model="edificioEditado.zona" class="input">
                        <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
                            {{ zona.nombre }}
                        </option>
                    </select>
                    <span v-else class="valor">{{ edificio.zona_nombre }}</span>
                </div>
            </div>

            <!-- Características, Amenidades y Zonas de Interés -->
            <div class="relaciones-section">
                <h3>Características Interiores</h3>
                <div class="lista-items">
                    <div v-for="caract in edificio.caracteristicas_interiores" :key="caract.id">
                        {{ caract.nombre }}
                    </div>
                </div>

                <h3>Amenidades</h3>
                <div class="lista-items">
                    <div v-for="amenidad in edificio.amenidades" :key="amenidad.id">
                        {{ amenidad.nombre }}
                    </div>
                </div>

                <h3>Zonas de Interés</h3>
                <div class="lista-items">
                    <div v-for="zona in edificio.zonas_de_interes" :key="zona.id">
                        {{ zona.nombre }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/utils/axios';
import eventBus from '@/utils/eventBus';

export default {
    name: 'DetallesEdificio',
    data() {
        return {
            edificio: null,
            edificioEditado: null,
            isEditing: false,
            barrios: [],
            zonas: []
        }
    },
    async created() {
        await this.cargarEdificio();
        await this.cargarBarrios();
        await this.cargarZonas();
    },
    methods: {
        async cargarEdificio() {
            try {
                const response = await axios.get(`/crm/edificios/${this.$route.params.id}/`);
                this.edificio = response.data;
                this.edificioEditado = { ...response.data };
            } catch (error) {
                console.error('Error al cargar el edificio:', error);
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
        async cargarZonas() {
            try {
                const response = await axios.get('/crm/zonas/');
                this.zonas = response.data;
            } catch (error) {
                console.error('Error al cargar zonas:', error);
            }
        },
        async guardarCambios() {
            try {
                const datosAEnviar = { ...this.edificioEditado };
                
                // Asegurarse de que barrio y zona sean IDs
                if (typeof datosAEnviar.barrio === 'object') {
                    datosAEnviar.barrio = datosAEnviar.barrio.id;
                }
                if (typeof datosAEnviar.zona === 'object') {
                    datosAEnviar.zona = datosAEnviar.zona.id;
                }

                // Eliminar campos que no deben enviarse
                delete datosAEnviar.barrio_nombre;
                delete datosAEnviar.zona_nombre;
                delete datosAEnviar.caracteristicas_interiores;
                delete datosAEnviar.amenidades;
                delete datosAEnviar.zonas_de_interes;

                const response = await axios.put(
                    `/crm/edificios/${this.edificio.id}/`,
                    datosAEnviar
                );

                this.edificio = response.data;
                this.edificioEditado = { ...response.data };
                this.isEditing = false;
                
                eventBus.emit('edificio-updated', response.data);
                
                alert("Cambios guardados exitosamente");
            } catch (error) {
                console.error('Error:', error);
                alert("Error al guardar los cambios: " + (error.response?.data?.error || error.message));
            }
        },
        cancelarEdicion() {
            this.edificioEditado = { ...this.edificio };
            this.isEditing = false;
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
</style>