<template>
    <h1>Edificios</h1>
    
    <div v-if="edificios.length === 0">No hay edificios disponibles.</div>
    
    <table v-else class="table">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Desarrollador</th>
                <th>Estrato</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="edificio in edificios" :key="edificio.id">
                <td>{{ edificio.nombre }}</td>
                <td>{{ edificio.desarrollador }}</td>
                <td>{{ edificio.estrato }}</td>
                <td>
                    <button @click="verDetalles(edificio.id)" class="btn btn-info">Detalles</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import axios from '@/utils/axios';

export default {
    name: 'EdificiosList',
    data() {
        return {
            edificios: []
        }
    },
    created() {
        this.fetchEdificios();
    },
    methods: {
        async fetchEdificios() {
            try {
                const response = await axios.get('/crm/edificios/');
                this.edificios = response.data; // Asignar los edificios obtenidos
            } catch (error) {
                console.error('Error al obtener edificios:', error);
            }
        },
        verDetalles(id) {
            // Redirigir a la página de detalles del edificio
            this.$router.push({ path: `/detalles-de-edificio/${id}` });
        }
    }
}
</script>

<style scoped>
.table {
    width: 100%;
    margin-top: 20px;
}
</style>
