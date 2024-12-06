<template>
  <div class="nav-bar">
    <h2>Bienvenido a la plataforma de IGH</h2>
    
    <!-- Mostrar botones de auth o información del usuario -->
    <div v-if="!currentUser" class="auth-buttons">
      <button @click="showLoginPopup = true" class="login-button">
        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
      </button>
      <button @click="showRegisterPopup = true" class="register-button">
        <i class="fas fa-user-plus"></i> Registrar Agente
      </button>
    </div>
    
    <!-- Información del usuario y botón de logout -->
    <div v-else class="user-info">
      <span class="welcome-text">
        <i class="fas fa-user"></i> 
        Bienvenido, {{ currentUser.first_name }} {{ currentUser.last_name }}
      </span>
      <button @click="handleLogout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>
    </div>
  </div>

  <!-- Popup de Login -->
  <MyPopUp 
    v-if="showLoginPopup" 
    :visible="showLoginPopup" 
    @cerrar="showLoginPopup = false"
    titulo="Iniciar Sesión"
  >
    <LoginForm 
      @cerrar="showLoginPopup = false"
      @login-success="handleLoginSuccess"
    />
  </MyPopUp>

  <!-- Popup de Registro -->
  <MyPopUp 
    v-if="showRegisterPopup" 
    :visible="showRegisterPopup" 
    @cerrar="showRegisterPopup = false"
    titulo="Registro de Agente"
  >
    <AgentRegistrationForm @cerrar="showRegisterPopup = false" />
  </MyPopUp>
</template>

<script>
import MyPopUp from '@/components/molecules/MyPopUp.vue';
import AgentRegistrationForm from '@/components/organisms/sesion/AgentRegistrationForm.vue';
import LoginForm from '@/components/organisms/sesion/LoginForm.vue';

export default {
  name: 'App',
  components: {
    MyPopUp,
    AgentRegistrationForm,
    LoginForm
  },
  data() {
    return {
      showLoginPopup: false,
      showRegisterPopup: false,
      currentUser: null
    };
  },
  methods: {
    handleLoginSuccess(user) {
      this.currentUser = user;
      console.log('Usuario logueado:', user);
    },
    handleLogout() {
      // Limpiar datos de sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.currentUser = null;
    },
    checkAuthStatus() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.currentUser = JSON.parse(user);
      }
    }
  },
  mounted() {
    // Verificar estado de autenticación al cargar la aplicación
    this.checkAuthStatus();
  }
}
</script>

<style>
.nav-bar {
  padding: 1rem;
  background-color: var(--color-white-sand-50);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-buttons, .user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.welcome-text {
  font-family: var(--font-league);
  color: var(--color-cobalt-900);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-button, .register-button, .logout-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-league);
  transition: background-color 0.3s ease;
}

.login-button {
  background-color: var(--color-cobalt-900);
  color: var(--color-white-50);
}

.login-button:hover {
  background-color: var(--color-cobalt-700);
}

.register-button {
  background-color: var(--color-loblolly-700);
  color: var(--color-white-50);
}

.register-button:hover {
  background-color: var(--color-loblolly-800);
}

.logout-button {
  background-color: var(--color-loblolly-700);
  color: var(--color-white-50);
}

.logout-button:hover {
  background-color: var(--color-loblolly-800);
}
</style>
