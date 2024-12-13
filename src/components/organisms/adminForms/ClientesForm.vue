<template>
    <form @submit.prevent="registerClient">
        <h2>Registro de Cliente</h2>
        <!-- Datos del Cliente -->
        <InputField
            id="nombre"
            label="Nombre"
            v-model="form.nombre"
            required
        />
        <InputField
            id="apellidos"
            label="Apellidos"
            v-model="form.apellidos"
            required
        />
        <InputField
            id="telefono"
            label="Teléfono"
            v-model.number="form.telefono"
            required
            type="number"
        />
        <InputField
            id="telefono_secundario"
            label="Teléfono Secundario"
            v-model.number="form.telefono_secundario"
            type="number"
        />
        <InputField
            id="correo"
            label="Correo Electrónico"
            type="email"
            v-model="form.correo"
        />
        <InputField
            id="cedula"
            label="Cédula"
            v-model="form.cedula"
            type="number"
        />
        <div class="form-group">
            <label for="canal_ingreso">Canal de Ingreso</label>
            <select 
                id="canal_ingreso" 
                v-model="form.canal_ingreso" 
                required 
                class="form-control"
            >
                <option value="organico">Orgánico</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="referido">Referido</option>
            </select>
        </div>
        <div class="form-group">
            <label for="estado_del_cliente">Estado del Cliente*</label>
            <select 
                id="estado_del_cliente" 
                v-model="form.estado_del_cliente" 
                required 
                class="form-control"
            >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="pendiente">Pendiente</option>
            </select>
        </div>
        <InputField
            id="notas"
            label="Notas"
            v-model="form.notas"
        />

        <div v-if="error" class="message error-message">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
        </div>
        
        <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Registrando...' : 'Registrar' }}
        </button>

        <div v-if="responseMessage" class="message" :class="{ 
            'success-message': isSuccess, 
            'error-message': !isSuccess 
        }">
            <i :class="isSuccess ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
            {{ formattedResponse }}
        </div>
    </form>
</template>

<script>
import InputField from '@/components/atoms/Input.vue';
import axios from '@/utils/axios';

export default {
    name: 'ClientesForm',
    components: {
        InputField
    },
    data() {
        return {
            form: {
                nombre: '',
                apellidos: '',
                telefono: '',
                telefono_secundario: '',
                correo: '',
                cedula: '',
                canal_ingreso: '',
                estado_del_cliente: '',
                notas: '',
                agente: null
            },
            loading: false,
            error: null,
            responseMessage: null,
            isSuccess: false,
            formattedResponse: ''
        };
    },
    created() {
        this.setAgente();
    },
    methods: {
        setAgente() {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    console.error('No hay usuario en localStorage');
                    return;
                }

                const user = JSON.parse(userStr);
                console.log('Usuario recuperado:', user);

                if (user && user.id) {
                    this.form.agente = user.id;
                    console.log('ID del agente establecido:', this.form.agente);
                }
            } catch (error) {
                console.error('Error al establecer el agente:', error);
            }
        },
        async registerClient() {
            console.log("Iniciando registro de cliente con agente:", this.form.agente);

            if (!this.form.agente) {
                this.showError('No se ha establecido un agente válido');
                return;
            }

            this.loading = true;
            this.responseMessage = false;
            
            try {
                const clientData = {
                    ...this.form,
                    agente: this.form.agente
                };

                console.log("Datos a enviar:", clientData);

                const response = await axios.post('/accounts/cliente/', clientData);
                console.log("Respuesta exitosa:", response.data);
                
                this.showSuccess(`¡Registro exitoso! El cliente ${this.form.nombre} ${this.form.apellidos} ha sido registrado.`);
                
                setTimeout(() => {
                    if (this.isSuccess) {
                        this.resetForm();
                        this.$emit('cerrar');
                    }
                }, 3000);

            } catch (error) {
                console.error("Error en el registro:", error);
                let errorMessage = 'Ha ocurrido un error durante el registro';
                
                if (error.response) {
                    console.error("Detalles del error:", error.response.data);
                    errorMessage = error.response.data.error || errorMessage;
                }
                
                this.showError(errorMessage);
            } finally {
                this.loading = false;
            }
        },
        showError(message) {
            this.error = message;
            this.isSuccess = false;
            this.formattedResponse = message;
            this.responseMessage = true;
        },
        showSuccess(message) {
            this.error = null;
            this.isSuccess = true;
            this.formattedResponse = message;
            this.responseMessage = true;
        },
        resetForm() {
            const agenteActual = this.form.agente;
            this.form = {
                nombre: '',
                apellidos: '',
                telefono: '',
                telefono_secundario: '',
                correo: '',
                cedula: '',
                canal_ingreso: '',
                estado_del_cliente: '',
                notas: '',
                agente: agenteActual
            };
        }
    }
}
</script>

<style scoped>
/* Estilos específicos para el formulario de clientes */
</style>