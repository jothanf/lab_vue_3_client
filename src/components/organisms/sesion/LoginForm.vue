<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <h2>Iniciar Sesión</h2>

    <InputField
      id="username"
      label="Email o Usuario"
      v-model="form.username"
      required
    />

    <div class="password-field">
      <InputField
        id="password"
        label="Contraseña"
        :type="showPassword ? 'text' : 'password'"
        v-model="form.password"
        required
      />
      <button 
        type="button" 
        class="toggle-password"
        @click="showPassword = !showPassword"
      >
        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
      </button>
    </div>

    <div v-if="responseMessage" class="message" :class="{ 
      'success-message': isSuccess, 
      'error-message': !isSuccess 
    }">
      <i :class="isSuccess ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
      {{ formattedResponse }}
    </div>

    <button type="submit" :disabled="loading" class="submit-button">
      {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
    </button>
  </form>
</template>

<script>
import InputField from '@/components/atoms/Input.vue';
import axios from 'axios';

export default {
  name: 'LoginForm',
  components: {
    InputField
  },
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false,
      responseMessage: null,
      isSuccess: false,
      formattedResponse: '',
      error: null
    };
  },
  methods: {
    showSuccess(message) {
      this.error = null;
      this.isSuccess = true;
      this.formattedResponse = message;
      this.responseMessage = true;
    },

    showError(message) {
      this.error = message;
      this.isSuccess = false;
      this.formattedResponse = message;
      this.responseMessage = true;
    },

    async handleLogin() {
      console.log("Iniciando intento de login con:", {
        username: this.form.username,
        password: '********'
      });

      if (!this.validateForm()) return;

      this.loading = true;
      this.responseMessage = false;

      try {
        const response = await axios.post('http://localhost:8000/accounts/login/', {
          username: this.form.username,
          password: this.form.password
        });

        console.log("Respuesta exitosa del servidor:", {
          status: response.status,
          data: response.data
        });

        if (response.data.token) {
          localStorage.setItem('token', `Bearer ${response.data.token}`);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Guardar información adicional según el tipo de usuario
          if (response.data.user_type === 'agente') {
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('user_type', 'agente');
            localStorage.setItem('agente_id', response.data.agente_id);
          } else if (response.data.user_type === 'cliente') {
            localStorage.setItem('user_type', 'cliente');
            localStorage.setItem('cliente_id', response.data.cliente_id);
          }
          
          this.showSuccess('¡Inicio de sesión exitoso!');
          
          // Emitir evento de login exitoso con el tipo de usuario
          this.$emit('login-success', { 
            user: response.data.user, 
            role: response.data.role,
            user_type: response.data.user_type
          });
          
          setTimeout(() => {
            this.$emit('cerrar');
          }, 2000);
        }
      } catch (error) {
        console.error("Error durante el login:", error);
        let errorMessage = 'Error al iniciar sesión';

        if (error.response) {
          console.error("Detalles del error:", error.response.data);
          
          switch (error.response.status) {
            case 400:
              errorMessage = 'Credenciales inválidas';
              break;
            case 401:
              errorMessage = 'Usuario o contraseña incorrectos';
              break;
            case 500:
              errorMessage = 'Error en el servidor';
              break;
            default:
              errorMessage = error.response.data.error || errorMessage;
          }
        }

        this.showError(errorMessage);
      
        this.loading = false;
      }
    },

    validateForm() {
      if (!this.form.username || !this.form.password) {
        this.showError('Por favor complete todos los campos');
        return false;
      }
      return true;
    }
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  font-family: var(--font-league);
}

.password-field {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-loblolly-800);
}

.submit-button {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--color-cobalt-900);
  color: var(--color-white-50);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--font-league);
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-cobalt-700);
}

.submit-button:disabled {
  background-color: var(--color-loblolly-800);
  cursor: not-allowed;
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