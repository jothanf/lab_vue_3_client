<template>
    <div class="tarea-form">
        <h1>Crear Nueva Tarea</h1>
        <form @submit.prevent="submitForm">
            <!-- Mensajes de error o éxito -->
            <div v-if="responseMessage" class="alert" :class="['alert', isSuccess ? 'alert-success' : 'alert-error']">
                <i :class="isSuccess ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ formattedResponse }}
            </div>

            <!-- Tipo de Tarea -->
            <div class="form-group">
                <label for="tipo_tarea">Tipo de Tarea:</label>
                <select v-model="form.tipo_tarea" required class="form-control">
                    <option value="llamada_seguimiento">Llamada de Seguimiento</option>
                    <option value="visita_inmueble">Visita a Inmueble</option>
                    <option value="documentacion">Documentación</option>
                    <option value="verificacion_datos">Verificación de Datos</option>
                    <option value="cierre">Cierre</option>
                </select>
            </div>

            <!-- Fecha de Vencimiento -->
            <div class="form-group">
                <label for="fecha_vencimiento">Fecha de Vencimiento:</label>
                <input type="date" v-model="form.fecha_vencimiento" required class="form-control" />
            </div>

            <!-- Prioridad -->
            <div class="form-group">
                <label for="prioridad">Prioridad:</label>
                <select v-model="form.prioridad" required class="form-control">
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                </select>
            </div>

            <!-- Estado -->
            <div class="form-group">
                <label for="estado">Estado:</label>
                <select v-model="form.estado" required class="form-control">
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                </select>
            </div>

            <!-- Descripción -->
            <div class="form-group">
                <label for="descripcion">Descripción:</label>
                <textarea v-model="form.descripcion" required class="form-control"></textarea>
            </div>

            <!-- Cliente -->
            <div class="form-group">
                <label for="cliente">Cliente:</label>
                <select v-model="form.cliente" required class="form-control">
                    <option value="">Seleccione un cliente</option>
                    <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                        {{ cliente.nombre }} {{ cliente.apellidos }}
                    </option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">Crear Tarea</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';

// Estados reactivos
const form = ref({
    tipo_tarea: '',
    fecha_vencimiento: '',
    prioridad: '',
    estado: 'pendiente',
    descripcion: '',
    agente: null,
    cliente: ''
});

// Estados para listas desplegables
const clientes = ref([]);

// Estado para mensajes y loading
const loading = ref(false);
const responseMessage = ref(false);
const isSuccess = ref(false);
const formattedResponse = ref('');

// Función para obtener el ID del agente desde el token
const obtenerIdAgente = () => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
        try {
            const parsedUser = JSON.parse(userInfo);
            return parsedUser.agente_id || parsedUser.agente?.id || parsedUser.id;
        } catch (error) {
            console.error('Error al parsear información del usuario:', error);
            return null;
        }
    }
    return null;
};

// Función para mostrar mensaje de éxito
const showSuccess = (message) => {
    isSuccess.value = true;
    formattedResponse.value = message;
    responseMessage.value = true;
    setTimeout(() => {
        if (isSuccess.value) {
            resetForm();
        }
    }, 3000);
};

// Función para mostrar mensaje de error
const showError = (message) => {
    isSuccess.value = false;
    formattedResponse.value = message;
    responseMessage.value = true;
};

// Función para resetear el formulario
const resetForm = () => {
    form.value = {
        tipo_tarea: '',
        fecha_vencimiento: '',
        prioridad: '',
        estado: 'pendiente',
        descripcion: '',
        agente: null,
        cliente: ''
    };
};

// Función para registrar la tarea
const submitForm = async () => {
    loading.value = true;
    responseMessage.value = false;

    try {
        const agenteId = obtenerIdAgente();
        if (!agenteId) {
            showError('No se encontró información del agente');
            return;
        }

        const dataToSend = {
            ...form.value,
            agente: parseInt(agenteId)
        };

        // Agregar logs para depuración
        console.log('Datos a enviar:', dataToSend);

        // Corregir la URL
        const response = await axios.post('/crm/tareas/', dataToSend);
        
        // Agregar log de respuesta exitosa
        console.log('Respuesta del servidor:', response.data);
        
        showSuccess('¡Tarea creada exitosamente!');

    } catch (error) {
        console.error('Error al crear tarea:', error);
        console.error('Detalles del error:', error.response?.data);
        
        let errorMessage = 'Error al crear la tarea';
        if (error.response) {
            errorMessage = error.response.data.message || errorMessage;
        }
        showError(errorMessage);
    } finally {
        loading.value = false;
    }
};

// Función para obtener clientes
const fetchClientes = async () => {
    try {
        const response = await axios.get('/accounts/cliente/');
        clientes.value = response.data;
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        showError('Error al cargar los clientes');
    }
};

// Cargar información al montar el componente
onMounted(() => {
    fetchClientes();
    const agenteId = obtenerIdAgente();
    if (agenteId) {
        form.value.agente = agenteId; // Asignar el agente al formulario
    }
});
</script>

<style>
.tarea-form {
    max-width: 600px;
    margin: 0 auto;
    padding: var(--spacing-lg);
}

.form-group {
    margin-bottom: var(--spacing-md);
}

.form-control {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--color-mine-shaft-100);
    border-radius: var(--border-radius-sm);
    font-family: var(--font-league);
    transition: border-color var(--transition-normal);
}

.form-control:focus {
    outline: none;
    border-color: var(--color-primary);
}

.alert {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    border-radius: var(--border-radius-sm);
}

.alert-success {
    background-color: var(--color-success);
    color: var(--color-white);
}

.alert-error {
    background-color: var(--color-error);
    color: var(--color-white);
}

.btn-primary {
    width: 100%;
    padding: var(--spacing-sm);
    background-color: var(--color-primary);
    color: var(--color-white);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: background-color var(--transition-normal);
}

.btn-primary:hover {
    background-color: var(--color-primary-light);
}
</style>