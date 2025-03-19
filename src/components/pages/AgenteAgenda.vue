<template>
  <div class="container">
    <div class="chat-container">
      <h1 class="title">Agenda IA</h1>
      
      <div class="messages-container" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message', message.from === 'agent' ? 'agent-message' : 'user-message']">
          <div class="message-content">
            {{ message.text }}
          </div>
        </div>
      </div>
      
      <div class="input-container">
        <input 
          v-model="userInput" 
          @keyup.enter="sendMessage" 
          placeholder="Escribe tu mensaje aquí..." 
          class="user-input"
        />
        <button 
          @click="sendMessage" 
          :disabled="!userInput"
          class="send-button"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInput: '',
      messages: []
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      const userMessage = this.userInput;
      this.messages.push({ from: 'user', text: userMessage });
      this.userInput = '';

      try {
        const response = await fetch('http://localhost:8000/crm/agendaAgent/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'mensaje',
            mensaje: userMessage
          })
        });

        const data = await response.json();
        this.messages.push({ from: 'agent', text: data.mensaje });
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        this.messages.push({ from: 'agent', text: 'Lo siento, ha ocurrido un error.' });
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },
  updated() {
    this.scrollToBottom();
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  background-color: #007bff;
  color: white;
  margin: 0;
  padding: 15px;
  text-align: center;
}

.messages-container {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #f9f9f9;
}

.message {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 10px;
  position: relative;
}

.agent-message {
  align-self: flex-start;
  background-color: #e9ecef;
  border-bottom-left-radius: 0;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 0;
}

.input-container {
  display: flex;
  padding: 15px;
  background-color: white;
  border-top: 1px solid #ddd;
}

.user-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 16px;
}

.send-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0 20px;
  cursor: pointer;
}

.send-button:disabled, .user-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

