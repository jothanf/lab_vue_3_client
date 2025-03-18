<template>
  <div class="container">
    <div class="chat-container">
      <h1 class="title">Asistente Inmobiliario</h1>
      
      <div class="messages-container" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message', message.from === 'agent' ? 'agent-message' : 'user-message']">
          <div class="message-content">
            <div v-if="message.from === 'agent' && message.tipo === 'resumen'" class="resumen">
              <p>{{ message.mensaje }}</p>
              <div class="resumen-content" v-if="!isEditing">
                {{ message.resumen }}
              </div>
              <div class="resumen-editor" v-else>
                <textarea 
                  v-model="editedResumen" 
                  class="resumen-textarea"
                  rows="10"
                ></textarea>
              </div>
              <div class="confirmation-buttons" v-if="message.requiere_confirmacion && !isEditing && !isProcessingConfirmation && !requerimientoEnviado">
                <button @click="confirmarResumen(true)" class="confirm-button">Confirmar</button>
                <button @click="editarResumen(message)" class="edit-button">Editar</button>
              </div>
              <div class="confirmation-buttons" v-if="isEditing && !isProcessingConfirmation && !requerimientoEnviado">
                <button @click="guardarEdicion()" class="confirm-button">Guardar cambios</button>
                <button @click="cancelarEdicion()" class="deny-button">Cancelar</button>
              </div>
              <div class="processing-message" v-if="isProcessingConfirmation">
                <p>Procesando solicitud...</p>
              </div>
              <div class="success-message" v-if="requerimientoEnviado">
                <p>¡Requerimiento registrado con éxito!</p>
              </div>
            </div>
            <div v-else-if="message.from === 'agent' && message.tipo === 'reinicio'">
              <p>{{ message.mensaje }}</p>
              <div class="modification-options" v-if="!requerimientoEnviado">
                <button @click="modificarAspectos('todos')" class="option-button">Reiniciar todos</button>
                <input v-model="aspectosModificar" placeholder="aspecto1, aspecto2, ..." class="aspectos-input" />
                <button @click="modificarAspectos(aspectosModificar)" class="option-button">Modificar seleccionados</button>
              </div>
            </div>
            <div v-else>
              {{ message.mensaje }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-container">
        <input 
          v-model="userInput" 
          @keyup.enter="sendMessage" 
          placeholder="Escribe tu mensaje aquí..." 
          :disabled="isWaitingConfirmation || isTyping || isEditing || isProcessingConfirmation || requerimientoEnviado"
          class="user-input"
        />
        <button 
          @click="sendMessage" 
          :disabled="isWaitingConfirmation || !userInput || isTyping || isEditing || isProcessingConfirmation || requerimientoEnviado"
          class="send-button"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RequerimientoAgent',
  data() {
    return {
      messages: [],
      userInput: '',
      isTyping: false,
      isWaitingConfirmation: false,
      aspectosModificar: '',
      isEditing: false,
      editedResumen: '',
      currentResumenMessage: null,
      isProcessingConfirmation: false,
      requerimientoEnviado: false
    };
  },
  mounted() {
    this.iniciarConversacion();
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    async iniciarConversacion() {
      this.isTyping = true;
      try {
        const response = await axios.post('/crm/requerimientoAgent/', {
          action: 'iniciar'
        });
        
        this.messages.push({
          from: 'agent',
          mensaje: response.data.mensaje,
          tipo: response.data.tipo
        });
      } catch (error) {
        console.error('Error al iniciar conversación:', error);
        this.messages.push({
          from: 'agent',
          mensaje: 'Lo siento, ha ocurrido un error al iniciar la conversación.',
          tipo: 'error'
        });
      } finally {
        this.isTyping = false;
      }
    },
    
    async sendMessage() {
      if (!this.userInput.trim() || this.isTyping || this.requerimientoEnviado) return;
      
      const userMessage = this.userInput;
      this.messages.push({
        from: 'user',
        mensaje: userMessage
      });
      
      this.userInput = '';
      this.isTyping = true;
      
      try {
        const response = await axios.post('/crm/requerimientoAgent/', {
          action: 'mensaje',
          mensaje: userMessage
        });
        
        // Agregar la respuesta del agente
        this.messages.push({
          from: 'agent',
          mensaje: response.data.mensaje,
          tipo: response.data.tipo,
          resumen: response.data.resumen,
          requiere_confirmacion: response.data.requiere_confirmacion
        });
        
        // Si requiere confirmación, bloquear la entrada
        if (response.data.tipo === 'resumen' && response.data.requiere_confirmacion) {
          this.isWaitingConfirmation = true;
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        this.messages.push({
          from: 'agent',
          mensaje: 'Lo siento, ha ocurrido un error al procesar tu mensaje.',
          tipo: 'error'
        });
      } finally {
        this.isTyping = false;
      }
    },
    
    async confirmarResumen(confirmacion) {
      // Bloquear botones inmediatamente
      this.isProcessingConfirmation = true;
      this.isWaitingConfirmation = false;
      this.isTyping = true;
      
      try {
        const response = await axios.post('/crm/requerimientoAgent/', {
          action: 'confirmar',
          confirmacion: confirmacion
        });
        
        this.messages.push({
          from: 'agent',
          mensaje: response.data.mensaje,
          tipo: response.data.tipo
        });
        
        // Si se registró con éxito, mostrar el ID y marcar como enviado
        if (response.data.exito === true) {
          this.messages[this.messages.length - 1].mensaje += ` ID: ${response.data.id}`;
          this.requerimientoEnviado = true;
        }
      } catch (error) {
        console.error('Error al confirmar resumen:', error);
        this.messages.push({
          from: 'agent',
          mensaje: 'Lo siento, ha ocurrido un error al confirmar tu resumen.',
          tipo: 'error'
        });
      } finally {
        this.isTyping = false;
        this.isProcessingConfirmation = false;
      }
    },
    
    async modificarAspectos(aspectos) {
      if (this.requerimientoEnviado) return;
      
      this.isTyping = true;
      this.isWaitingConfirmation = false;
      
      try {
        const response = await axios.post('/crm/requerimientoAgent/', {
          action: 'modificar',
          aspectos: aspectos
        });
        
        this.messages.push({
          from: 'agent',
          mensaje: response.data.mensaje,
          tipo: response.data.tipo
        });
        
        // Después de modificar, permitir continuar la conversación
        this.aspectosModificar = '';
      } catch (error) {
        console.error('Error al modificar aspectos:', error);
        this.messages.push({
          from: 'agent',
          mensaje: 'Lo siento, ha ocurrido un error al modificar los aspectos.',
          tipo: 'error'
        });
      } finally {
        this.isTyping = false;
      }
    },
    
    // Métodos para edición de resumen
    editarResumen(message) {
      if (this.requerimientoEnviado) return;
      
      this.isEditing = true;
      this.editedResumen = message.resumen;
      this.currentResumenMessage = message;
      this.scrollToBottom();
    },
    
    cancelarEdicion() {
      this.isEditing = false;
      this.editedResumen = '';
      this.currentResumenMessage = null;
    },
    
    async guardarEdicion() {
      if (!this.editedResumen.trim() || this.requerimientoEnviado) return;
      
      // Bloquear botones inmediatamente
      this.isProcessingConfirmation = true;
      this.isTyping = true;
      this.isEditing = false;
      
      try {
        // Actualizar el mensaje actual con el resumen editado
        if (this.currentResumenMessage) {
          this.currentResumenMessage.resumen = this.editedResumen;
        }
        
        // Enviar una confirmación con el resumen editado directamente
        const confirmationResponse = await axios.post('/crm/requerimientoAgent/', {
          action: 'confirmar',
          confirmacion: true,
          // El backend no procesará este campo, pero lo incluimos para visualización
          resumen_editado: this.editedResumen
        });
        
        // Agregar mensaje de respuesta
        this.messages.push({
          from: 'agent',
          mensaje: confirmationResponse.data.mensaje,
          tipo: confirmationResponse.data.tipo
        });
        
        // Si se registró con éxito, mostrar el ID y marcar como enviado
        if (confirmationResponse.data.exito === true) {
          this.messages[this.messages.length - 1].mensaje += ` ID: ${confirmationResponse.data.id}`;
          this.requerimientoEnviado = true;
        }
        
      } catch (error) {
        console.error('Error al guardar la edición:', error);
        this.messages.push({
          from: 'agent',
          mensaje: 'Lo siento, ha ocurrido un error al procesar tu edición.',
          tipo: 'error'
        });
      } finally {
        this.isTyping = false;
        this.currentResumenMessage = null;
        this.isProcessingConfirmation = false;
      }
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
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

.resumen {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}

.resumen-content {
  margin-top: 10px;
  padding: 10px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 5px;
  white-space: pre-line;
}

.resumen-editor {
  margin-top: 10px;
}

.resumen-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #007bff;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  background-color: white;
  resize: vertical;
}

.confirmation-buttons, .modification-options {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.confirm-button, .option-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button:hover {
  background-color: #218838;
}

.edit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #0069d9;
}

.deny-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.deny-button:hover {
  background-color: #c82333;
}

.aspectos-input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
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

.processing-message {
  margin-top: 15px;
  color: #6c757d;
  font-style: italic;
}

.success-message {
  margin-top: 15px;
  color: #28a745;
  font-weight: bold;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
}
</style>