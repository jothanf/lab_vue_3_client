<template>  
    <div class="pedidos-list">
        <div class="search-section">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar por cliente o tipo de negocio..." 
                class="search-input"
            />
        </div>

        <div v-if="filtrados.length > 0" class="pedidos-grid">
            <div v-for="pedido in paginados" 
                 :key="pedido.id" 
                 class="pedido-card">
                
                <div class="pedido-header">
                    <h3>Pedido #{{ pedido.id }}</h3>
                    <span class="estado" :class="pedido.estado">{{ pedido.estado }}</span>
                </div>
                
                <div class="pedido-info">
                    <div class="info-section">
                        <h4>Información del Cliente</h4>
                        <p><i class="fas fa-user"></i> Cliente: {{ pedido.cliente }}</p>
                        <p><i class="fas fa-user-tie"></i> Agente: {{ pedido.agente }}</p>
                        <p><i class="fas fa-calendar"></i> Fecha: {{ formatDate(pedido.fecha_ingreso) }}</p>
                    </div>

                    <div class="info-section">
                        <h4>Detalles del Requerimiento</h4>
                        <p><i class="fas fa-home"></i> Tipo de negocio: {{ pedido.tipo_negocio }}</p>
                        <p><i class="fas fa-users"></i> Habitantes: {{ pedido.habitantes }}</p>
                        <p><i class="fas fa-bed"></i> Habitaciones: {{ pedido.habitaciones }}</p>
                        <p><i class="fas fa-bath"></i> Baños: {{ pedido.banos }}</p>
                    </div>

                    <div class="info-section">
                        <h4>Presupuesto</h4>
                        <p><i class="fas fa-dollar-sign"></i> Mínimo: ${{ formatNumber(pedido.presupuesto_minimo) }}</p>
                        <p><i class="fas fa-dollar-sign"></i> Máximo: ${{ formatNumber(pedido.presupuesto_maximo) }}</p>
                    </div>
                </div>

                <div class="pedido-footer">
                    <button @click="verDetalles(pedido.id)" class="btn-detalles">
                        Ver Detalles Completos
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="no-results">No se encontraron pedidos que coincidan con tu búsqueda.</p>

        <div class="pagination" v-if="filtrados.length > limite">
            <button 
                @click="cargarMas" 
                v-if="pagina < totalPaginas"
                class="btn-cargar-mas"
            >
                Cargar más pedidos
            </button>
        </div>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            pedidos: [],
            errorMessage: null,
            searchQuery: '',
            pagina: 1,
            limite: 10,
        };
    },
    computed: {
        filtrados() {
            return this.pedidos.filter(pedido => {
                const cliente = pedido.cliente ? pedido.cliente.toString().toLowerCase() : '';
                const tipoNegocio = pedido.tipo_negocio ? pedido.tipo_negocio.toString().toLowerCase() : '';
                return cliente.includes(this.searchQuery.toLowerCase()) || tipoNegocio.includes(this.searchQuery.toLowerCase());
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
        this.obtenerPedidos();
    },
    methods: {
        async obtenerPedidos() {
            try {
                const response = await axios.get('/crm/requerimientos/');
                this.pedidos = response.data;
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
                this.errorMessage = 'Error al cargar los pedidos. Intente nuevamente.';
            }
        },
        cargarMas() {
            this.pagina++;
        },
        verDetalles(id) {
            this.$router.push(`/detalles-de-pedido/${id}`);
        },
        formatNumber(number) {
            if (!number) return '0';
            return number.toLocaleString('es-CO');
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('es-CO');
        }
    }
}
</script>

<style scoped>
.pedidos-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.pedido-card {
    background-color: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-md);
    transition: transform 0.2s;
}

.pedido-card:hover {
    transform: scale(1.02);
}

.pedido-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.estado {
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    font-weight: bold;
}

.estado.pendiente { background-color: var(--color-warning-light); }
.estado.en_proceso { background-color: var(--color-info-light); }
.estado.completado { background-color: var(--color-success-light); }

.pedido-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.info-section {
    background-color: var(--color-white-sand-50);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-sm);
}

.info-section h4 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-xs);
}

.pedido-footer {
    margin-top: var(--spacing-md);
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

/* Estilos específicos para el popup de pedidos */
:deep(.pedidos-list-popup .popup-content) {
    width: 95%;
    max-width: 1400px;
    height: 90vh;
}

:deep(.pedidos-list-popup .popup-body) {
    padding: 20px;
    max-height: calc(90vh - 120px);
    overflow-y: auto;
}
</style>