<template>
    <div>
        <h1>Clientes</h1>
        <input type="text" v-model="searchQuery" placeholder="Buscar cliente..." />
        <ul v-if="filtrados.length > 0">
            <li v-for="cliente in paginados" :key="cliente.id">
                {{ cliente.nombre }} {{ cliente.apellidos }}
                <button @click="editarCliente(cliente.id)" class="btn btn-secondary">Editar</button>
                <button @click="eliminarCliente(cliente.id)" class="btn btn-secondary">Eliminar</button>
                <button @click="verDetalles(cliente.id)" class="btn btn-secondary">Detalles</button>
            </li>
        </ul>
        <p v-else>No hay clientes disponibles.</p>
        <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
        <button @click="cargarMas" v-if="pagina < totalPaginas">Cargar más</button>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            clientes: [],
            errorMessage: null,
            searchQuery: '',
            pagina: 1,
            limite: 10, // Número de clientes por página
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