<template>
    <div class="tareas-list">
        <div class="search-section">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar por tipo, estado o descripción..." 
                class="search-input"
            />
        </div>

        <div v-if="filtradas.length > 0" class="tareas-grid">
            <div v-for="tarea in paginadas" 
                 :key="tarea.id" 
                 class="tarea-card">
                <div class="tarea-header">
                    <h3>{{ tarea.tipo_tarea }}</h3>
                    <span class="estado" :class="getEstadoClass(tarea.estado)">Estado: {{ tarea.estado }}</span>
                </div>
                
                <div class="tarea-info">
                    <p><strong>Descripción:</strong> {{ tarea.descripcion }}</p>
                    <p><strong>Fecha de Vencimiento:</strong> {{ tarea.fecha_vencimiento }}</p>
                    <p><strong>Prioridad:</strong> <span :class="getPrioridadClass(tarea.prioridad)">{{ tarea.prioridad }}</span></p>
                </div>

                <div class="tarea-footer">
                    <button @click="verDetalles(tarea.id)" class="btn-detalles">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="no-results">No se encontraron tareas que coincidan con tu búsqueda.</p>

        <div class="pagination" v-if="filtradas.length > limite">
            <button 
                @click="cargarMas" 
                v-if="pagina < totalPaginas"
                class="btn-cargar-mas"
            >
                Cargar más tareas
            </button>
        </div>
    </div>
</template>

<style scoped>
.tareas-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.tarea-card {
    background-color: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-md);
    transition: transform 0.2s;
    border: 2px solid transparent;
}

.tarea-card:hover {
    transform: scale(1.05);
    border-color: var(--color-primary);
    background-color: var(--color-light);
}

.tarea-header {
    display: flex;
    justify-content: space-between;
}

.tarea-info {
    margin-top: var(--spacing-sm);
}

.tarea-footer {
    margin-top: var(--spacing-md);
    text-align: center;
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

.estado-completo {
    color: green;
}

.estado-en-progreso {
    color: orange;
}

.estado-pendiente {
    color: red;
}

.prioridad-alta {
    color: red;
}

.prioridad-media {
    color: orange;
}

.prioridad-baja {
    color: green;
}
</style>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            tareas: [],
            searchQuery: '',
            pagina: 1,
            limite: 10, // Número de tareas por página
        };
    },
    computed: {
        filtradas() {
            return this.tareas.filter(tarea => 
                tarea.tipo_tarea.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                tarea.estado.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                tarea.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase())
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
        this.obtenerTareas();
    },
    methods: {
        async obtenerTareas() {
            try {
                const response = await axios.get('/crm/tareas/');
                this.tareas = response.data;
            } catch (error) {
                console.error('Error al obtener las tareas:', error);
            }
        },
        cargarMas() {
            this.pagina++;
        },
        verDetalles(id) {
            this.$router.push(`/detalles-de-tarea/${id}`);
        },
        getEstadoClass(estado) {
            switch (estado) {
                case 'Completo':
                    return 'estado-completo';
                case 'En Progreso':
                    return 'estado-en-progreso';
                case 'Pendiente':
                    return 'estado-pendiente';
                default:
                    return '';
            }
        },
        getPrioridadClass(prioridad) {
            switch (prioridad) {
                case 'Alta':
                    return 'prioridad-alta';
                case 'Media':
                    return 'prioridad-media';
                case 'Baja':
                    return 'prioridad-baja';
                default:
                    return '';
            }
        }
    }
}
</script>