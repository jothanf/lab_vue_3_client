<template>
  <div class="calendario">
    <h2>Calendario Semanal</h2>
    
    <!-- Mensaje de error si no hay cliente -->
    <div v-if="!clienteId" class="mensaje-error">
      <p>Debe iniciar sesión como cliente para ver su calendario y agendar citas.</p>
      <button @click="redirigirLogin" class="btn-login">Iniciar Sesión</button>
    </div>
    
    <template v-else>
      <!-- Botón para abrir el formulario de agenda -->
      <button class="btn-agendar" @click="abrirFormulario">
        Agendar Cita
      </button>
      
      <!-- Mensaje de carga o error -->
      <div v-if="error" class="mensaje-error">{{ error }}</div>
      <div v-if="cargandoAgentes || cargandoAgendas" class="mensaje-carga">Cargando datos...</div>
      
      <div class="semana">
        <div class="dia" v-for="(dia, index) in dias" :key="index">
          <h3>{{ dia }}</h3>
          <div class="horas">
            <div
              class="hora"
              v-for="hora in horas"
              :key="hora"
              @click="seleccionarHorario(index, hora)"
            >
              {{ hora }}:00
              <!-- Mostrar citas agendadas en este horario -->
              <div 
                v-for="cita in citasEnHorario(index, hora)" 
                :key="cita.id" 
                class="cita"
                @click.stop="verDetallesCita(cita)"
              >
                {{ obtenerNombreAgente(cita.agente) }} - {{ cita.notas || 'Sin detalles' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mostrar agendas abiertas -->
      <h3>Agendas Abiertas</h3>
      <div v-if="agendas.length === 0" class="mensaje-error">No hay agendas abiertas disponibles.</div>
      <div v-else>
        <ul>
          <li v-for="agenda in agendas" :key="agenda.id">
            {{ agenda.fecha }} a las {{ agenda.hora }} - Agente ID: {{ agenda.agente }}
          </li>
        </ul>
      </div>
    </template>
    
    <!-- Modal para el formulario de agenda -->
    <div class="modal" v-if="mostrarFormulario">
      <div class="modal-contenido">
        <span class="cerrar" @click="mostrarFormulario = false">&times;</span>
        <h3>Agendar Cita</h3>
        
        <div v-if="cargandoAgentes" class="mensaje-carga">Cargando agentes disponibles...</div>
        
        <form @submit.prevent="crearAgenda" v-else>
          <div class="form-grupo">
            <label>Fecha:</label>
            <input 
              type="date" 
              v-model="nuevaAgenda.fecha" 
              required
              :min="fechaMinima"
            />
          </div>
          
          <div class="form-grupo">
            <label>Hora:</label>
            <select v-model="nuevaAgenda.hora" required>
              <option value="" disabled>Seleccione una hora</option>
              <option v-for="hora in horas" :key="hora" :value="`${hora}:00:00`">
                {{ hora }}:00
              </option>
            </select>
          </div>
          
          <div class="form-grupo">
            <label for="agente">Agente:</label>
            <select id="agente" v-model="nuevaAgenda.agente" required>
              <option value="" disabled>Seleccione un agente</option>
              <option v-for="agente in agentes" :key="agente.id" :value="agente.id">
                {{ obtenerNombreAgente(agente) }}
              </option>
            </select>
            <div v-if="agentes.length === 0" class="mensaje-alerta">
              No hay agentes disponibles. Por favor, intente más tarde.
            </div>
          </div>
          
          <div class="form-grupo">
            <label for="notas">Notas:</label>
            <textarea id="notas" v-model="nuevaAgenda.notas" rows="3" placeholder="Detalles de la cita..."></textarea>
          </div>
          
          <div class="form-acciones">
            <button type="button" @click="mostrarFormulario = false">Cancelar</button>
            <button type="submit" :disabled="agentes.length === 0">Agendar</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal para ver detalles de cita -->
    <div class="modal" v-if="mostrarDetallesCita">
      <div class="modal-contenido">
        <span class="cerrar" @click="mostrarDetallesCita = false">&times;</span>
        <h3>Detalles de la Cita</h3>
        
        <div v-if="citaSeleccionada" class="detalles-cita">
          <div class="detalle-item">
            <strong>Fecha:</strong> {{ formatearFechaCompleta(citaSeleccionada.fecha) }}
          </div>
          <div class="detalle-item">
            <strong>Hora:</strong> {{ formatearHora(citaSeleccionada.hora) }}
          </div>
          <div class="detalle-item">
            <strong>Agente:</strong> {{ obtenerNombreAgente(citaSeleccionada.agente) }}
          </div>
          <div class="detalle-item">
            <strong>Estado:</strong> {{ citaSeleccionada.estado }}
          </div>
          <div class="detalle-item">
            <strong>Notas:</strong> {{ citaSeleccionada.notas || 'Sin notas' }}
          </div>
          
          <div class="form-acciones">
            <button 
              type="button" 
              class="btn-eliminar" 
              @click="confirmarEliminarCita"
            >
              Eliminar Cita
            </button>
            <button type="button" @click="mostrarDetallesCita = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación para eliminar cita -->
    <div class="modal" v-if="mostrarConfirmacion">
      <div class="modal-contenido modal-confirmacion">
        <h3>Confirmar Eliminación</h3>
        <p>¿Está seguro que desea eliminar esta cita? Esta acción no se puede deshacer.</p>
        
        <div class="form-acciones">
          <button type="button" @click="mostrarConfirmacion = false">Cancelar</button>
          <button 
            type="button" 
            class="btn-eliminar" 
            @click="eliminarCita"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      dias: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      horas: Array.from({ length: 12 }, (_, i) => i + 7), // Genera horas de 7 a 18
      mostrarFormulario: false,
      mostrarDetallesCita: false,
      mostrarConfirmacion: false,
      fechaSeleccionada: null,
      horaSeleccionada: null,
      diaSeleccionado: null,
      agentes: [],
      agendas: [],
      citaSeleccionada: null,
      nuevaAgenda: {
        fecha: '',
        hora: '',
        agente: '',
        notas: '',
        estado: 'pendiente'
      },
      clienteId: null,
      cargandoAgentes: false,
      cargandoAgendas: false,
      eliminandoCita: false,
      error: null
    };
  },
  
  computed: {
    fechaMinima() {
      const hoy = new Date();
      return hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
  },
  
  created() {
    // Obtener el ID del cliente de la sesión
    this.clienteId = this.obtenerClienteId();
    console.log("ID del cliente obtenido:", this.clienteId);
    
    if (this.clienteId) {
      // Cargar agentes y agendas al iniciar
      this.cargarAgentes();
      this.cargarAgendas();
    } else {
      this.error = "Debe iniciar sesión como cliente para ver su calendario.";
    }
  },
  
  methods: {
    obtenerClienteId() {
      // Obtener el ID del cliente directamente de localStorage
      const clienteId = localStorage.getItem('cliente_id');
      if (clienteId) {
        console.log("ID de cliente encontrado:", clienteId);
        return clienteId;
      }
      
      // Si no hay cliente_id, verificar en el objeto user
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          console.log("Datos de usuario encontrados:", userData);
          
          // Si el usuario tiene un cliente_id
          if (userData.cliente_id) {
            return userData.cliente_id;
          }
        } catch (e) {
          console.error("Error al parsear datos de usuario:", e);
        }
      }
      
      console.log("No se encontró ID de cliente");
      return null;
    },
    
    redirigirLogin() {
      this.$router.push('/login');
    },
    
    async cargarAgentes() {
      this.cargandoAgentes = true;
      this.error = null;
      
      try {
        // Usar la URL correcta sin el prefijo /api/
        console.log("Intentando cargar agentes...");
        const response = await axios.get('/accounts/agente/');
        console.log('Agentes cargados:', response.data);
        this.agentes = response.data;
      } catch (error) {
        console.error('Error al cargar agentes:', error);
        this.error = 'No se pudieron cargar los agentes. Por favor, intente nuevamente.';
        
        // Cargar datos de prueba para desarrollo
        this.cargarDatosPrueba();
      } finally {
        this.cargandoAgentes = false;
      }
    },
    
    cargarDatosPrueba() {
      console.log("Cargando datos de prueba para desarrollo");
      // Datos de prueba para desarrollo
      this.agentes = [
        { id: 1, user: { first_name: 'Juan', last_name: 'Pérez' } },
        { id: 2, user: { first_name: 'María', last_name: 'González' } },
        { id: 3, user: { first_name: 'Carlos', last_name: 'Rodríguez' } }
      ];
    },
    
    async cargarAgendas() {
      if (!this.clienteId) {
        console.warn('No hay ID de cliente disponible para cargar agendas');
        return;
      }
      
      this.cargandoAgendas = true;
      this.error = null;
      
      try {
        // Usar la URL correcta sin el prefijo /api/
        console.log(`Cargando agendas para cliente ID: ${this.clienteId}`);
        const response = await axios.get('/crm/agendaAbierta/');
        console.log('Agendas cargadas:', response.data);
        this.agendas = response.data;
      } catch (error) {
        console.error('Error al cargar agendas:', error);
        this.error = 'No se pudieron cargar las agendas. Por favor, intente nuevamente.';
        
        // Inicializar con un array vacío para evitar errores
        this.agendas = [];
      } finally {
        this.cargandoAgendas = false;
      }
    },
    
    abrirFormulario() {
      // Establecer la fecha actual como valor predeterminado
      const hoy = new Date();
      this.nuevaAgenda.fecha = hoy.toISOString().split('T')[0];
      
      // Mostrar el formulario
      this.mostrarFormulario = true;
    },
    
    seleccionarHorario(diaIndex, hora) {
      // Calcular la fecha basada en el día de la semana seleccionado
      const hoy = new Date();
      const primerDiaSemana = new Date(hoy);
      primerDiaSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo de la semana actual
      
      const fechaSeleccionada = new Date(primerDiaSemana);
      fechaSeleccionada.setDate(primerDiaSemana.getDate() + diaIndex);
      
      // Formatear la fecha para el input date (YYYY-MM-DD)
      this.nuevaAgenda.fecha = fechaSeleccionada.toISOString().split('T')[0];
      
      // Establecer la hora seleccionada
      this.nuevaAgenda.hora = `${hora}:00:00`;
      
      // Abrir el formulario
      this.mostrarFormulario = true;
    },
    
    formatearFecha(fecha) {
      if (!fecha) return '';
      
      // Si es un string, convertir a objeto Date
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      
      return fechaObj.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    
    formatearFechaCompleta(fecha) {
      if (!fecha) return '';
      
      // Si es un string, convertir a objeto Date
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      
      return fechaObj.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    
    formatearHora(hora) {
      if (!hora) return '';
      
      // Si la hora viene en formato HH:MM:SS, extraer solo HH:MM
      if (typeof hora === 'string' && hora.includes(':')) {
        const partes = hora.split(':');
        return `${partes[0]}:${partes[1]}`;
      }
      
      return hora;
    },
    
    obtenerNombreAgente(agente) {
      if (!agente) return 'Agente no asignado';
      
      // Si es un objeto con user
      if (agente.user && agente.user.first_name) {
        return `${agente.user.first_name} ${agente.user.last_name || ''}`;
      }
      
      // Si es solo un ID, buscar en la lista de agentes
      if (typeof agente === 'number') {
        const agenteEncontrado = this.agentes.find(a => a.id === agente);
        if (agenteEncontrado && agenteEncontrado.user) {
          return `${agenteEncontrado.user.first_name} ${agenteEncontrado.user.last_name || ''}`;
        }
      }
      
      // Si no se puede determinar el nombre
      return `Agente #${typeof agente === 'object' ? agente.id : agente}`;
    },
    
    citasEnHorario(diaIndex, hora) {
      // Filtrar las citas que coinciden con este día y hora
      const hoy = new Date();
      const primerDiaSemana = new Date(hoy);
      primerDiaSemana.setDate(hoy.getDate() - hoy.getDay());
      
      const fechaBuscada = new Date(primerDiaSemana);
      fechaBuscada.setDate(primerDiaSemana.getDate() + diaIndex);
      
      // Formatear la fecha buscada como YYYY-MM-DD para comparar
      const fechaFormateada = fechaBuscada.toISOString().split('T')[0];
      
      return this.agendas.filter(agenda => {
        // Comparar la fecha (YYYY-MM-DD)
        const fechaCoincide = agenda.fecha === fechaFormateada;
        
        // Extraer la hora de la agenda (HH:MM:SS) y compararla
        const horaAgenda = agenda.hora ? agenda.hora.split(':')[0] : null;
        const horaCoincide = horaAgenda && parseInt(horaAgenda) === hora;
        
        return fechaCoincide && horaCoincide;
      });
    },
    
    async crearAgenda() {
      if (!this.nuevaAgenda.fecha || !this.nuevaAgenda.hora || !this.nuevaAgenda.agente || !this.clienteId) {
        alert('Por favor complete todos los campos requeridos');
        return;
      }
      
      try {
        const datosAgenda = {
          cliente: this.clienteId,
          agente: this.nuevaAgenda.agente,
          fecha: this.nuevaAgenda.fecha,
          hora: this.nuevaAgenda.hora,
          estado: 'pendiente',
          notas: this.nuevaAgenda.notas
        };
        
        console.log('Enviando datos de agenda:', datosAgenda);
        
        // Usar la URL correcta sin el prefijo /api/
        const response = await axios.post('/crm/agenda/', datosAgenda);
        
        console.log('Respuesta del servidor:', response.data);
        
        // Actualizar la lista de agendas
        this.agendas.push(response.data);
        
        // Cerrar el formulario y limpiar campos
        this.mostrarFormulario = false;
        this.nuevaAgenda = {
          fecha: '',
          hora: '',
          agente: '',
          notas: '',
          estado: 'pendiente'
        };
        
        alert('Cita agendada correctamente');
        
        // Recargar las agendas para asegurarse de que todo esté actualizado
        this.cargarAgendas();
      } catch (error) {
        console.error('Error al crear agenda:', error);
        
        // Mostrar un mensaje de error más detallado
        if (error.response) {
          console.error('Detalles del error:', error.response.data);
          alert(`Error al agendar la cita: ${error.response.data.error || error.response.statusText}`);
        } else {
          alert('Error al agendar la cita. Por favor intente nuevamente.');
        }
      }
    },
    
    // Nuevos métodos para ver detalles y eliminar citas
    verDetallesCita(cita) {
      this.citaSeleccionada = cita;
      this.mostrarDetallesCita = true;
    },
    
    confirmarEliminarCita() {
      this.mostrarConfirmacion = true;
    },
    
    async eliminarCita() {
      if (!this.citaSeleccionada || !this.citaSeleccionada.id) {
        alert('No se ha seleccionado ninguna cita para eliminar');
        return;
      }
      
      this.eliminandoCita = true;
      
      try {
        console.log(`Eliminando cita con ID: ${this.citaSeleccionada.id}`);
        
        // Usar la URL correcta sin el prefijo /api/
        await axios.delete(`/crm/agenda/${this.citaSeleccionada.id}/`);
        
        // Cerrar los modales
        this.mostrarConfirmacion = false;
        this.mostrarDetallesCita = false;
        
        // Eliminar la cita de la lista local
        this.agendas = this.agendas.filter(agenda => agenda.id !== this.citaSeleccionada.id);
        
        // Limpiar la cita seleccionada
        this.citaSeleccionada = null;
        
        alert('Cita eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar cita:', error);
        
        // Mostrar un mensaje de error más detallado
        if (error.response) {
          console.error('Detalles del error:', error.response.data);
          alert(`Error al eliminar la cita: ${error.response.data.error || error.response.statusText}`);
        } else {
          alert('Error al eliminar la cita. Por favor intente nuevamente.');
        }
      } finally {
        this.eliminandoCita = false;
      }
    }
  }
};
</script>

<style scoped>
.calendario {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  margin: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.btn-agendar {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
}

.btn-agendar:hover {
  background-color: #45a049;
}

.btn-login {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
}

.btn-login:hover {
  background-color: #0b7dda;
}

.semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0; /* Sin separación entre columnas */
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden; /* Para bordes redondeados */
}

.dia {
  background-color: #f9f9f9;
  border-right: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  position: relative;
}

.dia:last-child {
  border-right: none; /* Eliminar borde derecho del último día */
}

.horas {
  display: flex;
  flex-direction: column;
}

.hora {
  border-top: 1px solid #eee;
  padding: 5px 0;
  color: #555;
  cursor: pointer;
  min-height: 30px;
  position: relative;
}

.hora:hover {
  background-color: #f0f0f0;
}

.hora:first-child {
  border-top: none; /* Eliminar borde superior de la primera hora */
}

/* Estilos para el modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  position: relative;
}

.modal-confirmacion {
  max-width: 400px;
  text-align: center;
}

.cerrar {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}

.cerrar:hover {
  color: #333;
}

.form-grupo {
  margin-bottom: 15px;
}

.form-grupo label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-grupo select,
.form-grupo textarea,
.form-grupo input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.fecha-seleccionada {
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 10px;
}

.form-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.form-acciones button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-acciones button[type="button"] {
  background-color: #f0f0f0;
  color: #333;
}

.form-acciones button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

.btn-eliminar {
  background-color: #f44336 !important;
  color: white !important;
}

.btn-eliminar:hover {
  background-color: #d32f2f !important;
}

.form-acciones button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Estilos para las citas en el calendario */
.cita {
  background-color: #4CAF50;
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.cita:hover {
  background-color: #388E3C;
}

/* Estilos para mensajes */
.mensaje-error {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.mensaje-carga {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.mensaje-alerta {
  color: #ff9800;
  font-size: 0.9em;
  margin-top: 5px;
}

/* Estilos para los detalles de la cita */
.detalles-cita {
  margin-top: 10px;
}

.detalle-item {
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.detalle-item strong {
  display: inline-block;
  width: 80px;
  color: #555;
}
</style>
