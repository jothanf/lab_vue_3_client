<template>
    <h1>{{ amenidad?.nombre || 'Detalles de Amenidad' }}</h1>
    <button @click="volver" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver
    </button>
    <button v-if="!isEditing" @click="activarEdicion" class="btn btn-primary">
        <i class="fas fa-edit"></i> Editar
    </button>
    <button v-if="isEditing" @click="guardarCambios" class="btn btn-success">
        <i class="fas fa-save"></i> Guardar
    </button>

    <div v-if="amenidad" class="contenido">
        <section class="seccion">
            <h2>Información Básica</h2>
            <div class="grid">
                <div class="campo">
                    <span class="etiqueta">Nombre:</span>
                    <input v-if="isEditing" v-model="amenidadEditada.nombre" class="input" />
                    <span v-else class="valor">{{ amenidad.nombre || 'No disponible' }}</span>
                </div>
                <div class="campo">
                    <span class="etiqueta">Categoría:</span>
                    <select v-if="isEditing" v-model="amenidadEditada.categoria" class="input" required>
                        <option value="">Seleccione una categoría</option>
                        <option value="recreacion">Recreación</option>
                        <option value="deportes">Deportes</option>
                        <option value="social">Social</option>
                        <option value="servicios">Servicios</option>
                        <option value="bienestar">Bienestar</option>
                        <!-- Agrega más opciones según sea necesario -->
                    </select>
                    <span v-else class="valor">{{ amenidad.categoria || 'No disponible' }}</span>
                </div>
                <div class="campo">
                    <span class="etiqueta">Descripción:</span>
                    <textarea v-if="isEditing" v-model="amenidadEditada.descripcion" class="input"></textarea>
                    <span v-else class="valor">{{ amenidad.descripcion || 'No disponible' }}</span>
                </div>
                <div class="campo">
                    <span class="etiqueta">Ícono:</span>
                    <img :src="amenidad.icono_url" alt="Icono de amenidad" v-if="!isEditing" />
                    <input v-if="isEditing" type="file" @change="handleFileUpload" class="input" accept="image/*" />
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    name: 'DetallesAmenidades',
    data() {
        return {
            amenidad: null,
            amenidadEditada: {},
            isEditing: false,
            loading: true,
            error: null
        };
    },
    async created() {
        await this.fetchAmenidad();
    },
    methods: {
        async fetchAmenidad() {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`/crm/amenidades/${id}/`);
                this.amenidad = response.data;
                this.amenidadEditada = { ...this.amenidad }; // Copia para edición
            } catch (error) {
                this.error = 'Error al cargar los detalles de la amenidad';
            } finally {
                this.loading = false;
            }
        },
        activarEdicion() {
            this.isEditing = true;
        },
        async guardarCambios() {
            try {
                const formData = new FormData();
                formData.append('nombre', this.amenidadEditada.nombre);
                formData.append('categoria', this.amenidadEditada.categoria);
                formData.append('descripcion', this.amenidadEditada.descripcion);
                if (this.amenidadEditada.icono) {
                    formData.append('icono', this.amenidadEditada.icono);
                }

                const response = await axios.put(`/crm/amenidades/${this.amenidad.id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                this.amenidad = response.data;
                this.isEditing = false;
                alert("Cambios guardados exitosamente");
            } catch (error) {
                console.error('Error al guardar los cambios:', error);
                alert("Error al guardar los cambios: " + error.message);
            }
        },
        volver() {
            this.$router.go(-1);
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.amenidadEditada.icono = file; // Guardar el archivo en amenidadEditada
            }
        }
    }
}
</script>

<style scoped>
.contenido {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--spacing-lg);
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

.input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-mine-shaft-100);
    border-radius: var(--border-radius-sm);
}
</style>