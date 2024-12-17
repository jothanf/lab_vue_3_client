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
                    <img v-if="propiedad.multimedia.length > 0" :src="getFullImageUrl(propiedad.multimedia[0].archivo_url)" alt="Imagen de propiedad" class="property-image" />
                    <p><strong>Tipo:</strong> {{ propiedad.tipo_propiedad }}</p>
                    <p><strong>Estado:</strong> {{ propiedad.estado_del_cliente }}</p>
                    <p><strong>Precio:</strong> {{ propiedad.modalidad_de_negocio?.venta_tradicional?.precio || 'No disponible' }}</p>
                    <p><strong>Amenidades:</strong> {{ propiedad.amenidades.map(a => a.nombre).join(', ') || 'No disponibles' }}</p>
                    <button class="btn btn-secondary" @click="$router.push(`/detalles-de-propiedad/${propiedad.id}`)">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
        <p v-else>No hay propiedades registradas para este cliente.</p>
        <div v-if="requerimientos.length > 0" class="requerimientos-container">
            <h2>Requerimientos del Cliente</h2>
            <ul class="requerimientos-list">
                <li v-for="requerimiento in requerimientos" :key="requerimiento.id" class="requerimiento-item">
                    <strong>Tipo de Negocio:</strong> {{ requerimiento.tipo_negocio }}<br />
                    <strong>Presupuesto:</strong> {{ requerimiento.presupuesto_minimo }} - {{ requerimiento.presupuesto_maximo }}<br />
                    <strong>Estado:</strong> {{ requerimiento.estado }}<br />
                </li>
            </ul>
        </div>
        <p v-else>No hay requerimientos registrados para este cliente.</p>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            cliente: null,
            propiedades: [],
            requerimientos: []
        }
    },
    async created() {
        try {
            const clienteId = this.$route.params.id;
            const response = await axios.get(`/accounts/cliente/${clienteId}/`);
            this.cliente = response.data;

            const propiedadesResponse = await axios.get(`/crm/propiedades/?propietario=${clienteId}`);
            this.propiedades = propiedadesResponse.data;

            const requerimientosResponse = await axios.get(`/crm/requerimientos/?cliente=${clienteId}`);
            this.requerimientos = requerimientosResponse.data;
        } catch (error) {
            console.error('Error al cargar los detalles:', error);
        }
    },
    methods: {
        getFullImageUrl(url) {
            if (url && !url.startsWith('http')) {
                return `http://localhost:8000${url}`;
            }
            return url;
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

.property-image {
    width: 200px;
    height: 200px;
    border-radius: var(--border-radius-sm);
    margin-bottom: var(--spacing-sm);
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

.property-image {
    width: 100px;
    height: 100px;
    border-radius: var(--border-radius-sm);
    margin-bottom: var(--spacing-sm);
}

.requerimientos-container {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
    border: 1px solid var(--color-mine-shaft-100);
    border-radius: var(--border-radius-md);
    background-color: var(--color-white);
    box-shadow: var(--shadow-sm);
}

.requerimientos-list {
    list-style-type: none;
    padding: 0;
}

.requerimiento-item {
    padding: var(--spacing-sm);
    border-bottom: 1px solid var(--color-mine-shaft-100);
}

.requerimiento-item:last-child {
    border-bottom: none;
}

.requerimiento-item strong {
    color: var(--color-primary);
}

.requerimiento-item:hover {
    background-color: var(--color-white-sand-50);
}
</style>
