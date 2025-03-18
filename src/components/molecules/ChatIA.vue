<template>
  <div class="chat-container">
    <div v-if="!chatInitialized" class="context-selector">
      <h3>¿Cómo puedo ayudarte hoy?</h3>
      <select v-model="selectedContextType" class="context-select">
        <option value="">Selecciona un tipo de consulta</option>
        <option value="edificio">Consultar sobre un Edificio</option>
        <option value="propiedad">Consultar sobre una Propiedad</option>
        <option value="localidad">Consultar sobre una Localidad</option>
      </select>
      <input 
        v-if="selectedContextType"
        v-model="selectedItemId"
        type="number" 
        placeholder="Ingresa el ID"
        class="id-input"
      >
      <button 
        @click="initializeChat" 
        :disabled="!selectedContextType || !selectedItemId"
        class="start-chat-button"
      >
        Comenzar Chat
      </button>
    </div>

    <template v-else>
      <div class="chat-log" ref="chatLog">
        <div v-for="(message, index) in messages" 
             :key="index" 
             class="message"
             :class="message.isUser ? 'user-message' : 'ai-message'">
          {{ message.isUser ? 'Tú: ' : 'Asistente: ' }}{{ message.text }}
        </div>
      </div>
      <div class="input-container">
        <input 
          type="text" 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          placeholder="Escribe tu mensaje..."
          class="chat-input"
        >
        <button @click="sendMessage" class="send-button">
          Enviar
        </button>
      </div>
      <div class="connection-status" :class="{ 'connected': isConnected }">
        Estado: {{ connectionStatus }}
      </div>
    </template>
  </div>
</template>

<script>
import { useAppStore } from '@/store';

export default {
  name: 'ChatIA',
  setup() {
    const store = useAppStore();
    const context = store.context;
    return { store, context };
  },
  watch: {
    'store.currentSection': {
      handler(newSection) {
        this.updateAssistantContext(newSection);
      },
      immediate: true
    }
  },
  data() {
    return {
      messages: [],
      newMessage: '',
      socket: null,
      isConnected: false,
      connectionStatus: 'Desconectado',
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      chatContext: null,
      selectedContextType: '',
      selectedItemId: '',
      chatInitialized: false,
    }
  },
  mounted() {
    console.group('ChatIA - Mounted');
    console.log('Ruta actual:', this.store.currentRoute);
    console.log('Sección actual:', this.store.currentSection);
    console.log('Contexto inicial:', this.store.context);
    console.groupEnd();
    
    this.initializeContext();
    this.connectWebSocket();
  },
  beforeUnmount() {
    this.closeConnection();
  },
  methods: {
    initializeContext() {
      if (this.role === 'realEstate') {
        const property = this.context.propiedad;
        const interactionType = this.context.tipo_interaccion;
        
        let roleDescription = '';
        switch (interactionType) {
          case 'venta':
            roleDescription = `Como agente inmobiliario, mi objetivo es ayudarte a encontrar la propiedad perfecta para comprar. 
            El precio de venta es $${property.precios.venta?.toLocaleString('es-CO')}. `;
            break;
          case 'renta':
            roleDescription = `Como agente inmobiliario, mi objetivo es ayudarte a encontrar la propiedad perfecta para arrendar. 
            El canon de arrendamiento es $${property.precios.renta?.toLocaleString('es-CO')} mensuales. `;
            break;
          case 'venta_y_renta':
            roleDescription = `Como agente inmobiliario, puedo ayudarte tanto si estás interesado en comprar como en arrendar. 
            El precio de venta es $${property.precios.venta?.toLocaleString('es-CO')} y 
            el canon de arrendamiento es $${property.precios.renta?.toLocaleString('es-CO')} mensuales. `;
            break;
          default:
            roleDescription = 'Como agente inmobiliario, estoy aquí para brindarte toda la información sobre esta propiedad. ';
        }

        this.chatContext = {
          role: "system",
          content: `${roleDescription}

          Soy un agente inmobiliario profesional y experto, especializado en esta propiedad y su zona. 
          Mi objetivo es guiarte de manera proactiva, haciéndote preguntas relevantes para entender tus necesidades 
          y brindarte información detallada sobre:

          1. Características principales:
          - ${property.basico.tipo_propiedad} de ${property.caracteristicas.area_construida}m² 
          - ${property.caracteristicas.habitaciones} habitaciones y ${property.caracteristicas.banos} baños
          - Ubicado en ${property.ubicacion.edificio?.nombre || property.ubicacion.direccion}

          2. Información del edificio/zona:
          - ${property.ubicacion.edificio?.descripcion || 'Información no disponible'}
          - Ubicado en ${property.ubicacion.barrio?.nombre || 'barrio no especificado'}
          - ${property.ubicacion.barrio?.descripcion || ''}

          3. Amenidades destacadas:
          ${property.amenidades?.map(a => `- ${a.nombre}: ${a.descripcion}`).join('\n') || 'No hay amenidades registradas'}

          4. Zonas de interés cercanas:
          ${property.zonas_interes?.map(z => `- ${z.nombre}: ${z.descripcion}`).join('\n') || 'No hay zonas de interés registradas'}

          Instrucciones específicas:
          1. Inicia la conversación presentándote y preguntando en qué puedes ayudar.
          2. Haz preguntas proactivamente para entender las necesidades del cliente.
          3. Proporciona información relevante según las respuestas del cliente.
          4. Mantén un tono profesional pero amigable.
          5. Ofrece detalles específicos sobre la propiedad cuando sea relevante.
          6. Si no tienes información sobre algo específico, indícalo honestamente.
          7. Sugiere aspectos relevantes que el cliente podría no haber considerado.`
        };

        // Enviar mensaje inicial después de establecer el contexto
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          console.log('Contenido completo de context.data:', this.chatContext.data);
          console.log('Contexto al enviar:', this.context);
          this.socket.send(JSON.stringify({
            message: "¡Hola! ¿En qué puedo ayudarte con esta propiedad?",
            context: this.chatContext,
            is_initial: true
          }));
        }
      }
    },

    formatPropertyContext(property) {
      if (!property) return '';
      
      return `
        Código: ${property.codigo || 'No disponible'}
        Título: ${property.titulo || 'No disponible'}
        Tipo: ${property.tipo_propiedad || 'No disponible'}
        Precio Venta: ${property.modalidad_de_negocio?.venta_tradicional?.precio || 'No disponible'}
        Precio Renta: ${property.modalidad_de_negocio?.renta_tradicional?.precio || 'No disponible'}
        Área Construida: ${property.metro_cuadrado_construido || 0} m²
        Habitaciones: ${property.habitaciones || 0}
        Baños: ${property.banos || 0}
        Estrato: ${property.estrato || 'No disponible'}
        Descripción: ${property.descripcion || 'No disponible'}
        Dirección: ${property.direccion?.direccion || 'No disponible'}
        Edificio: ${property.edificio?.nombre || 'No disponible'}
        Amenidades: ${property.amenidades?.map(a => a.nombre).join(', ') || 'No disponible'}
      `;
    },

    connectWebSocket() {
      console.group('ChatIA - WebSocket Connection');
      console.log('Intentando conectar WebSocket...');
      try {
        const roomName = 'default';
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//localhost:8000/ws/chat/${roomName}/1/`;
        
        console.log('URL del WebSocket:', wsUrl);
        
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log('¡Conexión WebSocket establecida!');
          console.log('Enviando contexto inicial:', this.chatContext);
          this.isConnected = true;
          this.connectionStatus = 'Conectado';
          this.reconnectAttempts = 0;
          
          // Enviar el contexto inicial al servidor
          if (this.chatContext) {
            console.log('Contexto antes de enviar:', this.context);
            this.socket.send(JSON.stringify({
              message: '',
              context: this.context
            }));
          }
        };

        this.socket.onmessage = (event) => {
          console.log('Mensaje recibido:', event.data);
          try {
            const data = JSON.parse(event.data);
            console.log('Datos parseados:', data);
            this.messages.push({
              text: data.message,
              isUser: data.is_user
            });
            
            this.$nextTick(() => {
              if (this.$refs.chatLog) {
                this.$refs.chatLog.scrollTop = this.$refs.chatLog.scrollHeight;
              }
            });
          } catch (error) {
            console.error('Error al procesar mensaje:', error);
          }
        };

        this.socket.onerror = (error) => {
          console.error('Error en WebSocket:', error);
          this.connectionStatus = 'Error de conexión';
          this.isConnected = false;
        };

        this.socket.onclose = (event) => {
          console.log('Conexión WebSocket cerrada:', event);
          this.isConnected = false;
          this.connectionStatus = 'Desconectado';
          
          // Intento de reconexión
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            console.log(`Intento de reconexión ${this.reconnectAttempts + 1} de ${this.maxReconnectAttempts}`);
            this.reconnectAttempts++;
            setTimeout(() => this.connectWebSocket(), 3000);
          }
        };

      } catch (error) {
        console.error('Error en conexión:', error);
      }
      console.groupEnd();
    },

    sendMessage() {
      if (!this.newMessage.trim()) return;

      try {
        const messageData = JSON.stringify({
          message: this.newMessage,
          context: this.chatContext
        });
        
        this.socket.send(messageData);
        this.messages.push({
          text: this.newMessage,
          isUser: true
        });
        
        this.newMessage = '';
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }
    },

    closeConnection() {
      if (this.socket) {
        console.log('Cerrando conexión WebSocket...');
        this.socket.close();
        this.socket = null;
      }
    },

    updateAssistantContext(section) {
      const context = this.store.context;
      const systemMessage = this.generateSystemMessage(section, context);
      
      // Enviar el nuevo contexto al WebSocket
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          message: '',
          context: {
            role: "system",
            content: systemMessage
          },
          is_context_update: true
        }));
      }
    },

    generateSystemMessage(section, context) {
      let baseMessage = `Estás en la sección de ${section}. `;
      
      // Agregar información del contexto si está disponible
      if (context) {
        baseMessage += `Contexto actual: ${context.description || ''}. `;
        if (context.capabilities) {
          baseMessage += `Capacidades disponibles: ${context.capabilities.join(', ')}. `;
        }
      }
      
      switch (section) {
        case 'localidad':
          baseMessage += `Puedo ayudarte con información sobre:
            - Zonas de interés en la localidad
            - Puntos de interés cercanos
            - Propiedades disponibles
            - Edificios y barrios en la zona`;
          break;
        case 'edificio':
          baseMessage += `Puedo ayudarte con:
            - Amenidades del edificio
            - Propiedades disponibles
            - Información del barrio
            - Características de la zona`;
          break;
        case 'propiedad':
          baseMessage += `Como agente inmobiliario, puedo ayudarte con:
            - Detalles de la propiedad
            - Proceso de compra/venta
            - Características y amenidades
            - Información del entorno`;
          break;
      }
      
      console.group('ChatIA - Generación de Mensaje');
      console.log('Sección:', section);
      console.log('Contexto:', context);
      console.log('Mensaje generado:', baseMessage);
      console.groupEnd();
      
      return baseMessage;
    },

    async initializeChat() {
      try {
        // Obtener el contexto del backend
        const response = await fetch(`/api/get_context_data/${this.selectedContextType}/${this.selectedItemId}/`);
        const contextData = await response.json();
        
        if (response.ok) {
          this.chatContext = {
            type: this.selectedContextType,
            data: contextData
          };
          this.chatInitialized = true;
          this.connectWebSocket();
        } else {
          console.error('Error al obtener contexto:', contextData.error);
        }
      } catch (error) {
        console.error('Error al inicializar chat:', error);
      }
    },
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  max-width: 600px;
  margin: auto;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.chat-log {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message {
  margin: 5px;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.ai-message {
  align-self: flex-start;
  background-color: #e9ecef;
  color: black;
}

.input-container {
  display: flex;
  gap: 10px;
  padding: 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.chat-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.send-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #0056b3;
}

.connection-status {
  text-align: center;
  padding: 5px;
  font-size: 0.8rem;
  background-color: #ff4444;
  color: white;
  margin-top: 10px;
}

.connection-status.connected {
  background-color: #00C851;
}

.context-selector {
  padding: 20px;
  text-align: center;
}

.context-select {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.id-input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.start-chat-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.start-chat-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
