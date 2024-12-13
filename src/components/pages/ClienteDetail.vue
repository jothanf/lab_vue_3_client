<template>
    <div class="cliente-detail">
        <h1>Detalle del Cliente</h1>
        <button class="btn btn-primary" @click="$router.go(-1)">Regresar</button>
        <p>ID del cliente: {{ $route.params.id }}</p>
        <div v-if="cliente" class="cliente-info">
            <p>Nombre: {{ cliente.nombre || 'Falta nombre' }}</p>
            <p>Apellidos: {{ cliente.apellidos || 'Faltan apellidos' }}</p>
            <p>Teléfono: {{ cliente.telefono || 'Falta teléfono' }}</p>
            <p>Teléfono Secundario: {{ cliente.telefono_secundario || 'Falta teléfono secundario' }}</p>
            <p>Correo: {{ cliente.correo || 'Falta correo' }}</p>
            <p>Cédula: {{ cliente.cedula || 'Falta cédula' }}</p>
            <p>Password: {{ cliente.password || 'Falta password' }}</p>
            <p>Canal de Ingreso: {{ cliente.canal_ingreso || 'Falta canal de ingreso' }}</p>
            <p>Estado del Cliente: {{ cliente.estado_del_cliente || 'Falta estado del cliente' }}</p>
            <p>Notas: {{ cliente.notas || 'Faltan notas' }}</p>
        </div>
        <div v-if="propiedades.length > 0" class="propiedades-container">
            <h2>Propiedades del Cliente</h2>
            <div class="card-container">
                <div class="card" v-for="propiedad in propiedades" :key="propiedad.id">
                    <h3>{{ propiedad.titulo }}</h3>
                    <p><strong>Tipo:</strong> {{ propiedad.tipo_propiedad }}</p>
                    <p><strong>Estado:</strong> {{ propiedad.estado_del_cliente }}</p>
                    <p><strong>Precio:</strong> {{ propiedad.modalidad_de_negocio?.venta_tradicional?.precio || 'No disponible' }}</p>
                    <button class="btn btn-secondary" @click="$router.push(`/detalles-de-propiedad/${propiedad.id}`)">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
        <p v-else>No hay propiedades registradas para este cliente.</p>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            cliente: null,
            propiedades: []
        }
    },
    async created() {
        try {
            // Obtener datos del cliente
            const clienteId = this.$route.params.id;
            const response = await axios.get(`/accounts/cliente/${clienteId}/`);
            this.cliente = response.data;
            console.log('Datos del cliente:', this.cliente);

            // Obtener propiedades del cliente
            const propiedadesResponse = await axios.get(`/crm/propiedades/?propietario=${clienteId}`);
            console.log('Respuesta propiedades:', propiedadesResponse.data);
            this.propiedades = propiedadesResponse.data;
        } catch (error) {
            console.error('Error al cargar los detalles:', error);
        }
    },
    methods: {
        verDetalles(id) {
            this.$router.push({ path: `/propiedad/${id}` });
        }
    }
}
</script>

<style scoped>
.cliente-detail {
    padding: var(--spacing-lg);
    background-color: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-md);
}

.cliente-info {
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    border: 1px solid var(--color-mine-shaft-100);
    border-radius: var(--border-radius-sm);
    background-color: var(--color-white-sand-50);
}

.propiedades-container {
    margin-top: var(--spacing-lg);
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    background-color: var(--color-white);
    border: 1px solid var(--color-mine-shaft-100);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-md);
    flex: 1 1 calc(33% - 20px);
    transition: transform 0.2s;
}

.card:hover {
    transform: scale(1.05);
}

.btn-secondary {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
}

.btn-secondary:hover {
    background-color: var(--color-primary-dark);
}
</style>
