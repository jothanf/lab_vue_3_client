<template>
    <div class="zonas-list">
        <h1>Zonas</h1>
        <div class="search-section">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar por nombre o tipo de zona..." 
                class="search-input"
            />
        </div>

        <div v-if="filtrados.length > 0" class="zonas-grid">
            <div v-for="zona in paginados" 
                 :key="zona.id" 
                 class="zona-card">
                
                <div class="zona-header">
                    <h3>{{ zona.nombre }}</h3>
                    <span class="tipo-zona">{{ zona.tipo_zona }}</span>
                </div>
                
                <div class="zona-info">
                    <p><strong>Descripción:</strong> {{ zona.descripcion }}</p>
                    <p><strong>Sigla:</strong> {{ zona.sigla }}</p>
                </div>

                <div class="zona-footer">
                    <button @click="verDetalles(zona.id)" class="btn-detalles">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="no-results">No se encontraron zonas que coincidan con tu búsqueda.</p>

        <div class="pagination" v-if="filtrados.length > limite">
            <button 
                @click="cargarMas" 
                v-if="pagina < totalPaginas"
                class="btn-cargar-mas"
            >
                Cargar más zonas
            </button>
        </div>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            zonas: [],
            searchQuery: '',
            pagina: 1,
            limite: 10,
        };
    },
    computed: {
        filtrados() {
            return this.zonas.filter(zona => {
                const nombre = zona.nombre ? zona.nombre.toLowerCase() : '';
                const tipoZona = zona.tipo_zona ? zona.tipo_zona.toLowerCase() : '';
                return nombre.includes(this.searchQuery.toLowerCase()) || tipoZona.includes(this.searchQuery.toLowerCase());
            });
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
        this.obtenerZonas();
    },
    methods: {
        async obtenerZonas() {
            try {
                const response = await axios.get('/crm/zona/');
                this.zonas = response.data;
            } catch (error) {
                console.error('Error al obtener las zonas:', error);
            }
        },
        cargarMas() {
            this.pagina++;
        },
        verDetalles(id) {
            this.$router.push(`/detalles-de-zona/${id}`);
        }
    }
}
</script>

<style scoped>
.zonas-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.zona-card {
    background-color: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-md);
    transition: transform 0.2s;
}

.zona-card:hover {
    transform: scale(1.02);
}

.zona-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.tipo-zona {
    font-weight: bold;
}

.zona-info {
    margin-bottom: var(--spacing-md);
}

.zona-footer {
    text-align: center;
}

.btn-detalles {
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-detalles:hover {
    background-color: var(--color-primary-light);
}
</style>