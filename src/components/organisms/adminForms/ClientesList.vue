<template>
    <div>
        <h1>Clientes</h1>
        <input type="text" v-model="searchQuery" placeholder="Buscar cliente..." />
        <div v-if="filtrados.length > 0" class="clientes-grid">
            <div v-for="cliente in paginados" :key="cliente.id" class="cliente-card">
                <div class="cliente-info">
                    <h3>{{ cliente.nombre }} {{ cliente.apellidos }}</h3>
                    <p><strong>ID:</strong> {{ cliente.id }}</p>
                    <p><strong>Email:</strong> {{ cliente.email }}</p>
                    <p><strong>Teléfono:</strong> {{ cliente.telefono }}</p>
                </div>
                <div class="cliente-actions">
                    <button @click="verDetalles(cliente.id)" class="btn btn-secondary">Detalles</button>
                </div>
            </div>
        </div>
        <p v-else>No hay clientes disponibles.</p>
        <div class="pagination" v-if="filtrados.length > limite">
            <button @click="cargarMas" v-if="pagina < totalPaginas">Cargar más</button>
        </div>
    </div>
</template>

<style scoped>
.clientes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.cliente-card {
    background-color: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-md);
}

.cliente-info {
    margin-bottom: var(--spacing-md);
}

.cliente-actions {
    display: flex;
    justify-content: space-between;
}
</style>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            clientes: [],
            errorMessage: null,
            searchQuery: '',
            pagina: 1,
            limite: 10,
        };
    },
    computed: {
        filtrados() {
            return this.clientes.filter(cliente => 
                `${cliente.nombre} ${cliente.apellidos}`.toLowerCase().includes(this.searchQuery.toLowerCase())
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
        this.obtenerClientes();
    },
    methods: {
        async obtenerClientes() {
            try {
                const response = await axios.get('/accounts/cliente/');
                this.clientes = response.data;
            } catch (error) {
                console.error('Error al obtener los clientes:', error);
                this.errorMessage = 'Error al cargar los clientes. Intente nuevamente.';
            }
        },
        cargarMas() {
            this.pagina++;
        },
        editarCliente(id) {
            console.log('Editar cliente con ID:', id);
        },
        eliminarCliente(id) {
            console.log('Eliminar cliente con ID:', id);
        },
        verDetalles(id) {
            this.$router.push(`/cliente-detail/${id}`);
        }
    }
}
</script>