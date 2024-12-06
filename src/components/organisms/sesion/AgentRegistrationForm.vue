<template>
  <form @submit.prevent="registerAgent">
    <h2>Registro de Agente</h2>
    <!-- Datos de Usuario -->
    <InputField
      id="email"
      label="Email"
      type="email"
      v-model="form.email"
      required
      @input="updateUsername"
    />
  
    <InputField
      id="password"
      label="Contraseña"
      type="password"
      v-model="form.password"
      required
    />
    <InputField
      id="first_name"
      label="Nombre"
      v-model="form.first_name"
      required
    />
    <InputField
      id="last_name"
      label="Apellido"
      v-model="form.last_name"
      required
    />
    
    <!-- Datos de Agente -->
    <InputField
      id="telefono"
      label="Teléfono"
      v-model="form.telefono"
      required
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
  name: 'AgentRegistrationForm',
  components: {
    InputField
  },
  data() {
    return {
      form: {
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        telefono: ''
      },
      loading: false,
      error: null,
      responseMessage: null,
      isSuccess: false,
      formattedResponse: ''
    };
  },
  methods: {
    updateUsername() {
      this.form.username = this.form.email;
    },
    validateForm() {
      if (!this.form.email) {
        this.showError('Por favor, ingrese un correo electrónico válido');
        return false;
      }
      if (!this.form.password || this.form.password.length < 6) {
        this.showError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      if (!this.form.first_name) {
        this.showError('Por favor, ingrese su nombre');
        return false;
      }
      if (!this.form.last_name) {
        this.showError('Por favor, ingrese su apellido');
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
    async registerAgent() {
      console.log("Iniciando registro de agente:", this.form);

      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.responseMessage = false;
      
      try {
        const response = await axios.post('http://localhost:8000/accounts/agentes/', {
          user: {
            username: this.form.email,
            email: this.form.email,
            password: this.form.password,
            first_name: this.form.first_name,
            last_name: this.form.last_name
          },
          telefono: this.form.telefono
        });

        console.log("Respuesta exitosa:", response.data);
        
        this.showSuccess(`¡Registro exitoso! El agente ${this.form.first_name} ${this.form.last_name} ha sido registrado.`);
        
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
          
          if (error.response.data.user?.email) {
            errorMessage = 'Este correo electrónico ya está registrado';
          } else if (error.response.data.user?.username) {
            errorMessage = 'Este nombre de usuario ya está en uso';
          } else if (error.response.data.user?.password) {
            errorMessage = 'La contraseña no cumple con los requisitos';
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
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        telefono: ''
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

