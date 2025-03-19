<template>
    <div class="container">
        <h1>Agenda Abierta</h1>
        <form @submit.prevent="crearAgenda" class="agenda-form">
            <div class="form-group">
                <label for="fecha">Fecha:</label>
                <input type="date" v-model="fecha" required />
            </div>
            <div class="form-group">
                <label for="hora">Hora:</label>
                <input type="time" v-model="hora" required />
            </div>
            <button type="submit" class="submit-button">Crear Agenda</button>
        </form>
        <div v-if="mensaje" class="mensaje">{{ mensaje }}</div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            fecha: '',
            hora: '',
            mensaje: ''
        };
    },
    methods: {
        async crearAgenda() {
            try {
                const response = await axios.post('/crm/agendaAbierta/', {
                    agente: 12,  // Usar el agente ID fijo como solicitaste
                    fecha: this.fecha,
                    hora: this.hora
                });
                this.mensaje = 'Agenda creada exitosamente: ' + JSON.stringify(response.data);
                // Limpiar el formulario
                this.fecha = '';
                this.hora = '';
            } catch (error) {
                console.error('Error al crear la agenda:', error);
                // Manejo de errores mejorado
                if (error.response && error.response.data) {
                    this.mensaje = 'Error al crear la agenda: ' + error.response.data.error;
                } else {
                    this.mensaje = 'Error al crear la agenda: ' + (error.message || 'Desconocido');
                }
            }
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* Ocupa toda la altura de la ventana */
    background-color: #f9f9f9; /* Color de fondo suave */
}

.agenda-form {
    background-color: white; /* Fondo blanco para el formulario */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
    width: 300px; /* Ancho fijo para el formulario */
}

.form-group {
    margin-bottom: 15px; /* Espaciado entre los campos */
}

label {
    display: block; /* Hacer que las etiquetas ocupen toda la línea */
    margin-bottom: 5px; /* Espaciado entre la etiqueta y el campo */
}

input {
    width: 100%; /* Ancho completo del campo */
    padding: 10px; /* Espaciado interno */
    border: 1px solid #ccc; /* Borde gris claro */
    border-radius: 4px; /* Bordes redondeados */
}

.submit-button {
    background-color: #007bff; /* Color de fondo del botón */
    color: white; /* Color del texto del botón */
    border: none; /* Sin borde */
    padding: 10px; /* Espaciado interno */
    border-radius: 4px; /* Bordes redondeados */
    cursor: pointer; /* Cambiar el cursor al pasar sobre el botón */
    transition: background-color 0.3s; /* Transición suave para el color de fondo */
}

.submit-button:hover {
    background-color: #0056b3; /* Color más oscuro al pasar el mouse */
}

.mensaje {
    margin-top: 20px;
    color: green;
}
</style>

