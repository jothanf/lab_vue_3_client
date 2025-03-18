<template>
  <div class="nav-bar">
    <MyTitle @click="navigateTo('/')">NORA</MyTitle>
    <div>
      <button @click="navigateTo('/requerimiento-agent')" class="btn btn-primary"> <i class="fas fa-paper-plane"></i> Requerimiento con Agente IA</button>
    </div>

    
    <!-- Mostrar botones de auth o información del usuario -->
    <div v-if="!currentUser" class="auth-buttons">
      <button @click="showLoginPopup = true" class="btn btn-primary">
        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
      </button>
      <button @click="showRegisterPopup = true" class="btn btn-primary">
        <i class="fas fa-user-plus"></i> Registrar Agente
      </button>
      <button @click="showRegisterClientePopup = true" class="btn btn-primary">
        <i class="fas fa-user-plus"></i> Registrar Cliente
      </button>
    </div>
    
    <!-- Información del usuario y botón de logout -->
    <div v-else class="user-info">
      <span class="welcome-text">
        <i class="fas fa-user"></i> 
        Bienvenido, {{ currentUser.first_name }} {{ currentUser.last_name }} ({{ currentUser.user_type }})
      </span>
      <button v-if="currentUser.user_type === 'agente'" @click="navigateTo('/admin-home')" class="btn btn-primary">
        <i class="fas fa-user-shield"></i> Panel de Administración
      </button>
      <button v-if="currentUser.user_type === 'cliente'" @click="navigateTo('/cliente-home')" class="btn btn-primary">
        <i class="fas fa-user"></i> Panel de Cliente
      </button>
      <button v-if="currentUser.user_type === 'cliente'" @click="navigateTo('/calendario-cliente')" class="btn btn-primary">
        <i class="fas fa-calendar"></i> Calendario de Visitas
      </button>
      <button @click="handleLogout" class="btn btn-secondary">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>

      <button @click="showChatPopup = true" class="btn btn-primary">
        <i class="fas fa-comment"></i> Chat
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

  <MyPopUp 
    v-if="showRegisterClientePopup" 
    :visible="showRegisterClientePopup" 
    @cerrar="showRegisterClientePopup = false"
    titulo="Registro de Cliente"
  >
    <ClienteRegistrationForm @cerrar="showRegisterClientePopup = false" />
  </MyPopUp>

  <MyPopUp 
    v-if="showChatPopup" 
    :visible="showChatPopup" 
    @cerrar="showChatPopup = false"
    titulo="Chat"
  >
    <ChatIA />
  </MyPopUp>

  
  <router-view></router-view>

  <!-- Botón flotante para abrir el chat -->
  <div class="chat-button" @click="toggleChat">
    <i class="fas fa-comment"></i>
    <span>Chat con NORA</span>
  </div>

  <!-- Ventana de chat -->
  <div class="chat-window" v-if="showChat">
    <div class="chat-header">
      <h3>Chat con NORA</h3>
      <button class="close-button" @click="toggleChat">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in chatMessages" :key="index" 
           :class="['message', message.sender === 'user' ? 'user-message' : 'agent-message']">
        <div class="message-content">
          <div v-if="message.sender === 'agent'" class="agent-avatar">
            <i class="fas fa-building"></i>
          </div>
          <div class="message-text" v-html="formatMessage(message.content)"></div>
        </div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>
      <div v-if="isLoading" class="message agent-message">
        <div class="message-content">
          <div class="agent-avatar">
            <i class="fas fa-building"></i>
          </div>
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <textarea 
        v-model="userMessage" 
        placeholder="Escribe tu mensaje aquí..." 
        @keydown.enter.prevent="sendMessage"
        :disabled="isLoading"
      ></textarea>
      <button @click="sendMessage" :disabled="isLoading || !userMessage.trim()">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script>
import MyPopUp from '@/components/molecules/MyPopUp.vue';
import AgentRegistrationForm from '@/components/organisms/sesion/AgentRegistrationForm.vue';
import ClienteRegistrationForm from '@/components/organisms/sesion/ClienteRegistrationForm.vue';
import LoginForm from '@/components/organisms/sesion/LoginForm.vue';
import MyTitle from '@/components/atoms/MyTitle.vue';
import ChatIA from '@/components/molecules/ChatIA.vue';
import { useAppStore } from '@/store';
import axios from '@/utils/axios';
import { marked } from 'marked';

export default {
  name: 'App',
  components: {
    MyPopUp,
    AgentRegistrationForm,
    ClienteRegistrationForm,
    LoginForm,
    MyTitle,
    ChatIA,
  },
  data() {
    return {
      showLoginPopup: false,
      showRegisterPopup: false,
      showRegisterClientePopup: false,
      showChatPopup: false,
      currentUser: null,
      showChat: false,
      userMessage: '',
      chatMessages: [],
      isLoading: false,
      chatHistory: [],
    };
  },
  methods: {
    handleLoginSuccess({ user, role, user_type }) {
      this.currentUser = { ...user, role, user_type };
      console.log('Usuario logueado:', this.currentUser);
    },
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('user_type');
      localStorage.removeItem('agente_id');
      localStorage.removeItem('cliente_id');
      this.currentUser = null;
    },
    checkAuthStatus() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const role = localStorage.getItem('role');
      const user_type = localStorage.getItem('user_type');
      if (token && user) {
        this.currentUser = { 
          ...JSON.parse(user), 
          role,
          user_type
        };
      }
    },
    navigateTo(path) {
      this.$router.push(path);
      const appStore = useAppStore();
      appStore.setCurrentRoute(path);
    },
    updateChatContext(context) {
      const appStore = useAppStore();
      appStore.setContext(context);
    },
    toggleChat() {
      this.showChat = !this.showChat;
      if (this.showChat) {
        // Esperar a que el DOM se actualice y hacer scroll al final
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    async sendMessage() {
      if (!this.userMessage.trim()) return;
      
      // Añadir el mensaje del usuario al chat
      this.chatMessages.push({
        content: this.userMessage,
        sender: 'user',
        timestamp: new Date()
      });
      
      const userMessage = this.userMessage;
      this.userMessage = '';
      this.isLoading = true;
      
      try {
        // Obtener el cliente_id del localStorage
        const clienteId = localStorage.getItem('cliente_id');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const clienteIdFromUser = userData.cliente_id;
        
        console.log('Cliente ID del localStorage:', clienteId);
        console.log('Cliente ID del usuario:', clienteIdFromUser);
        
        // Enviar el mensaje al backend
        const response = await axios.post('/chat/api/chat_with_agent/', {
          message: userMessage,
          history: [], // Enviamos un array vacío para evitar problemas
          cliente_id: clienteId || clienteIdFromUser // Enviar el cliente_id
        });
        
        // Añadir la respuesta del agente al chat
        this.chatMessages.push({
          content: response.data.response,
          sender: 'agent',
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        this.chatMessages.push({
          content: 'Lo siento, ha ocurrido un error al procesar tu mensaje.',
          sender: 'agent',
          timestamp: new Date()
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      if (this.$refs.chatMessages) {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    formatMessage(message) {
      // Convertir markdown a HTML
      return marked(message);
    }
  },
  mounted() {
    this.checkAuthStatus();
    const appStore = useAppStore();
    appStore.setCurrentRoute(this.$route.path);

    // Inicializar con un mensaje de bienvenida
    this.chatMessages.push({
      content: `# ¡Hola! Soy NORA 👋

Soy tu Navegador de Operaciones Real Estate Automatizado. Estoy aquí para ayudarte a:

- Encontrar propiedades que se ajusten a tus necesidades
- Responder preguntas sobre el mercado inmobiliario
- Proporcionar información sobre el proceso de compra/venta
- Asesorarte en tu inversión inmobiliaria

¿En qué puedo ayudarte hoy?`,
      sender: 'agent',
      timestamp: new Date()
    });
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

  .chat-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--color-primary);
    color: white;
    border-radius: 50px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transition: all 0.3s ease;
  }

  .chat-button:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-2px);
  }

  .chat-button i {
    font-size: 1.2rem;
  }

  .chat-window {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    z-index: 1001;
    overflow: hidden;
  }

  .chat-header {
    background-color: var(--color-primary);
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
  }

  .chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .message {
    max-width: 80%;
    padding: 10px 15px;
    border-radius: 15px;
    margin-bottom: 5px;
  }

  .user-message {
    align-self: flex-end;
    background-color: #e3f2fd;
    border-bottom-right-radius: 5px;
  }

  .agent-message {
    align-self: flex-start;
    background-color: #f5f5f5;
    border-bottom-left-radius: 5px;
  }

  .message-content {
    display: flex;
    gap: 10px;
  }

  .agent-avatar {
    width: 30px;
    height: 30px;
    background-color: var(--color-primary);
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }

  .message-text {
    word-break: break-word;
  }

  .message-text :deep(h1) {
    font-size: 1.2rem;
    margin-top: 0;
  }

  .message-text :deep(h2) {
    font-size: 1.1rem;
  }

  .message-text :deep(ul), .message-text :deep(ol) {
    padding-left: 20px;
    margin: 5px 0;
  }

  .message-time {
    font-size: 0.7rem;
    color: #888;
    text-align: right;
    margin-top: 5px;
  }

  .chat-input {
    padding: 10px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
  }

  .chat-input textarea {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 10px 15px;
    resize: none;
    height: 40px;
    font-family: inherit;
  }

  .chat-input button {
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .chat-input button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background-color: #888;
    border-radius: 50%;
    display: inline-block;
    animation: typing 1.4s infinite ease-in-out both;
  }

  .typing-indicator span:nth-child(1) {
    animation-delay: 0s;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }


  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.6;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
