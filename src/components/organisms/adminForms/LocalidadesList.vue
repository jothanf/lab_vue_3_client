<template>
    <div class="localidades-list">
        <div class="search-section">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar por nombre..." 
                class="search-input"
            />
        </div>

        <div v-if="filtradas.length > 0" class="localidades-grid">
            <div v-for="localidad in paginadas" 
                 :key="localidad.id" 
                 class="localidad-card">
                <div class="localidad-header">
                    <h3>{{ localidad.nombre }}</h3>
                    <span class="sigla">Sigla: {{ localidad.sigla || 'N/A' }}</span>
                </div>
                <div class="localidad-info">
                    <p>{{ localidad.descripcion }}</p>
                </div>
                <div class="localidad-footer">
                    <button @click="verDetalles(localidad.id)" class="btn-detalles">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="no-results">No se encontraron localidades que coincidan con tu búsqueda.</p>

        <div class="pagination" v-if="filtradas.length > limite">
            <button 
                @click="cargarMas" 
                v-if="pagina < totalPaginas"
                class="btn-cargar-mas"
            >
                Cargar más localidades
            </button>
        </div>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            localidades: [],
            searchQuery: '',
            pagina: 1,
            limite: 10, // Número de localidades por página
        };
    },
    computed: {
        filtradas() {
            return this.localidades.filter(localidad => 
                localidad.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        totalPaginas() {
            return Math.ceil(this.filtradas.length / this.limite);
        },
        paginadas() {
            const inicio = (this.pagina - 1) * this.limite;
            return this.filtradas.slice(inicio, inicio + this.limite);
        }
    },
    created() {
        this.obtenerLocalidades();
    },
    methods: {
        async obtenerLocalidades() {
            try {
                const response = await axios.get('/crm/localidades/');
                this.localidades = response.data;
            } catch (error) {
                console.error('Error al obtener las localidades:', error);
            }
        },
        cargarMas() {
            this.pagina++;
        },
        verDetalles(id) {
            this.$router.push(`/detalles-de-localidad/${id}`);
        }
    }
}
</script>

<style scoped>
.localidades-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.localidad-card {
    background-color: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-md);
}

.localidad-header {
    margin-bottom: var(--spacing-sm);
}

.no-results {
    text-align: center;
    color: var(--color-gray);
}

.btn-detalles {
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: var(--spacing-sm);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-detalles:hover {
    background-color: var(--color-primary-light);
}
</style>