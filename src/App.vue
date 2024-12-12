<template>
  <div class="nav-bar">
    <MyTitle @click="navigateTo('/')">InteGrowHome</MyTitle>
    
    <!-- Mostrar botones de auth o información del usuario -->
    <div v-if="!currentUser" class="auth-buttons">
      <button @click="showLoginPopup = true" class="btn btn-primary">
        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
      </button>
      <button @click="showRegisterPopup = true" class="btn btn-primary">
        <i class="fas fa-user-plus"></i> Registrar Agente
      </button>
    </div>
    
    <!-- Información del usuario y botón de logout -->
    <div v-else class="user-info">
      <span class="welcome-text">
        <i class="fas fa-user"></i> 
        Bienvenido, {{ currentUser.first_name }} {{ currentUser.last_name }}
      </span>
      <button v-if="currentUser.role === 'admin'" @click="navigateTo('/admin-home')" class="btn btn-primary">
        <i class="fas fa-user-shield"></i> Panel de Administración
      </button>
      <button @click="handleLogout" class="btn btn-secondary">
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

  <router-view></router-view>
</template>

<script>
import MyPopUp from '@/components/molecules/MyPopUp.vue';
import AgentRegistrationForm from '@/components/organisms/sesion/AgentRegistrationForm.vue';
import LoginForm from '@/components/organisms/sesion/LoginForm.vue';
import MyTitle from '@/components/atoms/MyTitle.vue';

export default {
  name: 'App',
  components: {
    MyPopUp,
    AgentRegistrationForm,
    LoginForm,
    MyTitle
  },
  data() {
    return {
      showLoginPopup: false,
      showRegisterPopup: false,
      currentUser: null
    };
  },
  methods: {
    handleLoginSuccess({ user, role }) {
      this.currentUser = { ...user, role };
      console.log('Usuario logueado:', this.currentUser);
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
      const role = localStorage.getItem('role');
      if (token && user) {
        this.currentUser = { ...JSON.parse(user), role };
      }
    },
    navigateTo(path) {
      this.$router.push(path); // Navegar a la nueva ruta
    }
  },
  mounted() {
    // Verificar estado de autenticación al cargar la aplicación
    this.checkAuthStatus();
  }
}
</script>

<style scoped>
  .user-info {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .welcome-text {
    font-family: var(--font-poppins); /* Cambiar a la fuente deseada */
    font-weight: 600;
    color: var(--color-primary); /* Cambiar al color deseado */
    display: flex; /* Usar flexbox para centrar */
    align-items: center; /* Centrar verticalmente */

  }
</style>
