<template>
    <div class="barrios-list">
        <div class="search-section">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar por nombre..." 
                class="search-input"
            />
        </div>

        <div v-if="filtrados.length > 0" class="barrios-grid">
            <div v-for="barrio in paginados" 
                 :key="barrio.id" 
                 class="barrio-card">
                <div class="barrio-header">
                    <h3>{{ barrio.nombre }}</h3>
                    <span class="sigla">Sigla: {{ barrio.sigla || 'N/A' }}</span>
                </div>
                <div class="barrio-info">
                    <p>{{ barrio.descripcion }}</p>
                    <p class="localidad">Localidad: {{ barrio.localidad_nombre }}</p>
                    <p>Estrato: {{ barrio.estrato_predominante }}</p>
                    <p>Tipo: {{ barrio.tipo_barrio }}</p>
                </div>
                <div class="barrio-footer">
                    <button @click="verDetalles(barrio.id)" class="btn-detalles">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="no-results">No se encontraron barrios que coincidan con tu búsqueda.</p>

        <div class="pagination" v-if="filtrados.length > limite">
            <button 
                @click="cargarMas" 
                v-if="pagina < totalPaginas"
                class="btn-cargar-mas"
            >
                Cargar más barrios
            </button>
        </div>
    </div>
</template>

<script>
import axios from '@/utils/axios';
import eventBus from '@/utils/eventBus';

export default {
    data() {
        return {
            barrios: [],
            searchQuery: '',
            pagina: 1,
            limite: 10,
        };
    },
    computed: {
        filtrados() {
            return this.barrios.filter(barrio => 
                barrio.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        totalPaginas() {
            return Math.ceil(this.filtrados.length / this.limite);
        },
        paginados() {
            const inicio = (this.pagina - 1) * this.limite;
            return this.filtrados.slice(inicio, inicio + this.limite);
        }
    },
    created() {
        this.obtenerBarrios();
        eventBus.on('barrio-updated', this.actualizarBarrioEnLista);
    },
    beforeUnmount() {
        eventBus.off('barrio-updated', this.actualizarBarrioEnLista);
    },
    methods: {
        async obtenerBarrios() {
            try {
                const response = await axios.get('/crm/barrio/');
                this.barrios = response.data;
            } catch (error) {
                console.error('Error al obtener los barrios:', error);
            }
        },
        cargarMas() {
            this.pagina++;
        },
        verDetalles(id) {
            this.$router.push(`/detalles-de-barrio/${id}`);
        },
        actualizarBarrioEnLista(barrioActualizado) {
            const index = this.barrios.findIndex(b => b.id === barrioActualizado.id);
            if (index !== -1) {
                this.barrios[index] = barrioActualizado;
            }
        }
    }
}
</script>

<style scoped>
.barrios-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.barrio-card {
    background-color: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-md);
}

.barrio-header {
    margin-bottom: var(--spacing-sm);
}

.barrio-info {
    margin-bottom: var(--spacing-md);
}

.barrio-info p {
    margin: var(--spacing-xs) 0;
}

.localidad {
    color: var(--color-primary);
    font-weight: bold;
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
    width: 100%;
}

.btn-detalles:hover {
    background-color: var(--color-primary-dark);
}

.barrio-footer {
    margin-top: var(--spacing-md);
}
</style>