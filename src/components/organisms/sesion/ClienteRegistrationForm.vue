<template>
  <form @submit.prevent="registerCliente">
    <h2>Registro de Cliente</h2>
    <!-- Datos de Usuario -->
    <InputField
      id="email"
      label="Email"
      type="email"
      v-model="form.email"
      required
    />
  
    <InputField
      id="password"
      label="Contraseña"
      type="password"
      v-model="form.password"
      required
    />
    
    <!-- Datos de Cliente -->
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
      v-model="form.telefono"
      required
    />
    <InputField
      id="telefono_secundario"
      label="Teléfono Secundario (opcional)"
      v-model="form.telefono_secundario"
    />
    <InputField
      id="cedula"
      label="Cédula (opcional)"
      v-model="form.cedula"
    />

    <div v-if="error" class="message error-message">
      <i class="fas fa-exclamation-circle"></i> {{ error }}
    </div>
    
    <button type="submit" :disabled="loading">
      {{ loading ? 'Registrando...' : 'Registrar' }}
    </button>

    <!-- Mostrar respuesta del servidor -->
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
import axios from 'axios';

export default {
  name: 'ClienteRegistrationForm',
  components: {
    InputField
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        nombre: '',
        apellidos: '',
        telefono: '',
        telefono_secundario: '',
        cedula: '',
        canal_ingreso: 'web', // Por defecto, el canal de ingreso es web
        estado_del_cliente: 'activo' // Por defecto, el estado es activo
      },
      loading: false,
      error: null,
      responseMessage: null,
      isSuccess: false,
      formattedResponse: ''
    };
  },
  methods: {
    validateForm() {
      if (!this.form.email) {
        this.showError('Por favor, ingrese un correo electrónico válido');
        return false;
      }
      if (!this.form.password || this.form.password.length < 6) {
        this.showError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      if (!this.form.nombre) {
        this.showError('Por favor, ingrese su nombre');
        return false;
      }
      if (!this.form.apellidos) {
        this.showError('Por favor, ingrese sus apellidos');
        return false;
      }
      if (!this.form.telefono) {
        this.showError('Por favor, ingrese un número de teléfono');
        return false;
      }
      return true;
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
    async registerCliente() {
      console.log("Iniciando registro de cliente:", this.form);

      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.responseMessage = false;
      
      try {
        console.log("URL de registro:", 'http://localhost:8000/accounts/cliente/register/');
        console.log("Datos a enviar:", {
          email: this.form.email,
          password: this.form.password,
          nombre: this.form.nombre,
          apellidos: this.form.apellidos,
          telefono: this.form.telefono,
          telefono_secundario: this.form.telefono_secundario,
          cedula: this.form.cedula,
          canal_ingreso: this.form.canal_ingreso,
          estado_del_cliente: this.form.estado_del_cliente
        });

        const response = await axios.post('http://localhost:8000/accounts/cliente/register/', {
          email: this.form.email,
          password: this.form.password,
          nombre: this.form.nombre,
          apellidos: this.form.apellidos,
          telefono: this.form.telefono,
          telefono_secundario: this.form.telefono_secundario,
          cedula: this.form.cedula,
          canal_ingreso: this.form.canal_ingreso,
          estado_del_cliente: this.form.estado_del_cliente
        });

        console.log("Respuesta exitosa:", response.data);
        
        this.showSuccess(`¡Registro exitoso! ${this.form.nombre} ${this.form.apellidos} ha sido registrado como cliente.`);
        
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
          
          if (error.response.data.email) {
            errorMessage = 'Este correo electrónico ya está registrado';
          } else if (error.response.data.cedula) {
            errorMessage = 'Esta cédula ya está registrada';
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        }
        
        this.showError(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = {
        email: '',
        password: '',
        nombre: '',
        apellidos: '',
        telefono: '',
        telefono_secundario: '',
        cedula: '',
        canal_ingreso: 'web',
        estado_del_cliente: 'activo'
      };
    }
  }
}
</script>
<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

.message {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  animation: fadeIn 0.3s ease;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
