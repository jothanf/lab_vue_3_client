<template>
  <div class="cliente-home">
    <h1>Mi Perfil</h1>
    
    <!-- Información personal del cliente -->
    <div class="profile-section">
      <h2>Información Personal</h2>
      <div v-if="loading" class="loading">Cargando información...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="profile-info">
        <div class="info-row">
          <span class="label">Nombre:</span>
          <span class="value">{{ cliente.nombre }} {{ cliente.apellidos }}</span>
        </div>
        <div class="info-row">
          <span class="label">Correo:</span>
          <span class="value">{{ cliente.correo }}</span>
        </div>
        <div class="info-row">
          <span class="label">Teléfono:</span>
          <span class="value">{{ cliente.telefono }}</span>
        </div>
        <div class="info-row" v-if="cliente.telefono_secundario">
          <span class="label">Teléfono Secundario:</span>
          <span class="value">{{ cliente.telefono_secundario }}</span>
        </div>
        <div class="info-row" v-if="cliente.cedula">
          <span class="label">Cédula:</span>
          <span class="value">{{ cliente.cedula }}</span>
        </div>
        <div class="info-row">
          <span class="label">Fecha de Registro:</span>
          <span class="value">{{ formatDate(cliente.fecha_ingreso) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Estado:</span>
          <span class="value">{{ cliente.estado_del_cliente }}</span>
        </div>
      </div>
    </div>

    <!-- Propiedades del cliente -->
    <div class="properties-section">
      <div class="section-header">
        <h2>Mis Propiedades</h2>
        <button @click="showPropiedadForm = true" class="btn btn-success">
          <i class="fas fa-plus-circle"></i> Registrar Nueva Propiedad
        </button>
      </div>
      
      <div v-if="loadingPropiedades" class="loading">Cargando propiedades...</div>
      <div v-else-if="errorPropiedades" class="error">{{ errorPropiedades }}</div>
      <div v-else-if="propiedades.length === 0" class="empty-message">
        No tienes propiedades registradas.
      </div>
      <div v-else class="properties-list">
        <div v-for="propiedad in propiedades" :key="propiedad.id" class="property-card">
          <h3>{{ propiedad.titulo || 'Propiedad sin título' }}</h3>
          <div class="property-info">
            <div class="info-row">
              <span class="label">Tipo:</span>
              <span class="value">{{ propiedad.tipo_propiedad }}</span>
            </div>
            <div class="info-row">
              <span class="label">Modalidad:</span>
              <span class="value">{{ formatModalidad(propiedad.modalidad_de_negocio) }}</span>
            </div>
            <div class="info-row" v-if="propiedad.metro_cuadrado_construido">
              <span class="label">Área construida:</span>
              <span class="value">{{ propiedad.metro_cuadrado_construido }} m²</span>
            </div>
            <div class="info-row" v-if="propiedad.habitaciones">
              <span class="label">Habitaciones:</span>
              <span class="value">{{ propiedad.habitaciones }}</span>
            </div>
            <div class="info-row" v-if="propiedad.banos">
              <span class="label">Baños:</span>
              <span class="value">{{ propiedad.banos }}</span>
            </div>
          </div>
          <button @click="verDetallePropiedad(propiedad.id)" class="btn btn-primary">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>

    <!-- Requerimientos del cliente -->
    <div class="requirements-section">
      <h2>Mis Requerimientos</h2>
      <div v-if="loadingRequerimientos" class="loading">Cargando requerimientos...</div>
      <div v-else-if="errorRequerimientos" class="error">{{ errorRequerimientos }}</div>
      <div v-else-if="requerimientos.length === 0" class="empty-message">
        No tienes requerimientos registrados.
      </div>
      <div v-else class="requirements-list">
        <div v-for="requerimiento in requerimientos" :key="requerimiento.id" class="requirement-card">
          <h3>Requerimiento #{{ requerimiento.id }}</h3>
          <div class="requirement-info">
            <div class="info-row">
              <span class="label">Tipo de negocio:</span>
              <span class="value">{{ formatTipoNegocio(requerimiento.tipo_negocio) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Estado:</span>
              <span class="value">{{ formatEstado(requerimiento.estado) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Fecha de creación:</span>
              <span class="value">{{ formatDate(requerimiento.fecha_ingreso) }}</span>
            </div>
            <div class="info-row" v-if="requerimiento.presupuesto_maximo">
              <span class="label">Presupuesto máximo:</span>
              <span class="value">{{ formatCurrency(requerimiento.presupuesto_maximo) }}</span>
            </div>
          </div>
          <button @click="verDetalleRequerimiento(requerimiento.id)" class="btn btn-primary">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>

    <!-- Tareas relacionadas con el cliente -->
    <div class="tasks-section">
      <h2>Mis Tareas Pendientes</h2>
      <div v-if="loadingTareas" class="loading">Cargando tareas...</div>
      <div v-else-if="errorTareas" class="error">{{ errorTareas }}</div>
      <div v-else-if="tareas.length === 0" class="empty-message">
        No tienes tareas pendientes.
      </div>
      <div v-else class="tasks-list">
        <div v-for="tarea in tareas" :key="tarea.id" class="task-card">
          <h3>{{ tarea.tipo_tarea }}</h3>
          <div class="task-info">
            <div class="info-row">
              <span class="label">Estado:</span>
              <span class="value">{{ formatEstadoTarea(tarea.estado) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Prioridad:</span>
              <span class="value">{{ formatPrioridad(tarea.prioridad) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Fecha de vencimiento:</span>
              <span class="value">{{ formatDate(tarea.fecha_vencimiento) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Descripción:</span>
              <span class="value">{{ tarea.descripcion }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para el formulario de propiedad -->
    <div v-if="showPropiedadForm" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registrar Nueva Propiedad</h3>
          <button @click="showPropiedadForm = false" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <ClientePropiedadForm 
            :cliente-id="clienteId" 
            @propiedad-created="handlePropiedadCreated" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import ClientePropiedadForm from '@/components/organisms/clienteForms/ClientePropiedadForm.vue';

export default {
  name: 'ClienteHome',
  components: {
    ClientePropiedadForm
  },
  data() {
    return {
      cliente: null,
      propiedades: [],
      requerimientos: [],
      tareas: [],
      loading: true,
      loadingPropiedades: true,
      loadingRequerimientos: true,
      loadingTareas: true,
      error: null,
      errorPropiedades: null,
      errorRequerimientos: null,
      errorTareas: null,
      clienteId: null,
      showPropiedadForm: false
    };
  },
  created() {
    this.clienteId = localStorage.getItem('cliente_id');
    if (!this.clienteId) {
      this.error = 'No se encontró información del cliente. Por favor inicie sesión nuevamente.';
      this.loading = false;
      return;
    }
    
    this.cargarDatosCliente();
    this.cargarPropiedades();
    this.cargarRequerimientos();
    this.cargarTareas();
  },
  methods: {
    async cargarDatosCliente() {
      try {
        const response = await axios.get(`/accounts/cliente/${this.clienteId}/`);
        this.cliente = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
        this.error = 'Error al cargar la información del cliente. Por favor intente nuevamente.';
        this.loading = false;
      }
    },
    
    async cargarPropiedades() {
      try {
        const response = await axios.get(`/crm/propiedades/?propietario=${this.clienteId}`);
        this.propiedades = response.data;
        this.loadingPropiedades = false;
      } catch (error) {
        console.error('Error al cargar propiedades:', error);
        this.errorPropiedades = 'Error al cargar las propiedades. Por favor intente nuevamente.';
        this.loadingPropiedades = false;
      }
    },
    
    async cargarRequerimientos() {
      try {
        const response = await axios.get(`/crm/requerimientos/?cliente=${this.clienteId}`);
        this.requerimientos = response.data;
        this.loadingRequerimientos = false;
      } catch (error) {
        console.error('Error al cargar requerimientos:', error);
        this.errorRequerimientos = 'Error al cargar los requerimientos. Por favor intente nuevamente.';
        this.loadingRequerimientos = false;
      }
    },
    
    async cargarTareas() {
      try {
        const response = await axios.get(`/crm/tareas/?cliente=${this.clienteId}`);
        this.tareas = response.data;
        this.loadingTareas = false;
      } catch (error) {
        console.error('Error al cargar tareas:', error);
        this.errorTareas = 'Error al cargar las tareas. Por favor intente nuevamente.';
        this.loadingTareas = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    formatCurrency(value) {
      if (!value) return 'N/A';
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(value);
    },
    
    formatModalidad(modalidad) {
      if (!modalidad) return 'N/A';
      try {
        if (typeof modalidad === 'string') {
          modalidad = JSON.parse(modalidad);
        }
        return modalidad.tipo || 'N/A';
      } catch (e) {
        return 'N/A';
      }
    },
    
    formatTipoNegocio(tipoNegocio) {
      if (!tipoNegocio) return 'N/A';
      try {
        if (typeof tipoNegocio === 'string') {
          tipoNegocio = JSON.parse(tipoNegocio);
        }
        return tipoNegocio.tipo || 'N/A';
      } catch (e) {
        return 'N/A';
      }
    },
    
    formatEstado(estado) {
      if (!estado) return 'N/A';
      const estados = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'completado': 'Completado'
      };
      return estados[estado] || estado;
    },
    
    formatEstadoTarea(estado) {
      if (!estado) return 'N/A';
      const estados = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En Proceso',
        'completada': 'Completada',
        'cancelada': 'Cancelada'
      };
      return estados[estado] || estado;
    },
    
    formatPrioridad(prioridad) {
      if (!prioridad) return 'N/A';
      const prioridades = {
        'baja': 'Baja',
        'media': 'Media',
        'alta': 'Alta'
      };
      return prioridades[prioridad] || prioridad;
    },
    
    verDetallePropiedad(propiedadId) {
      this.$router.push(`/propiedad/${propiedadId}`);
    },
    
    verDetalleRequerimiento(requerimientoId) {
      this.$router.push(`/requerimiento/${requerimientoId}`);
    },
    
    handlePropiedadCreated() {
      this.showPropiedadForm = false;
      this.cargarPropiedades(); // Recargar las propiedades para mostrar la nueva
    }
  }
}
</script>

<style scoped>
.cliente-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--color-primary);
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  margin: 1.5rem 0;
  color: var(--color-secondary);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.5rem;
}

.profile-section, .properties-section, .requirements-section, .tasks-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.loading, .error, .empty-message {
  padding: 1rem;
  text-align: center;
  border-radius: 4px;
}

.loading {
  background-color: #f8f9fa;
  color: #6c757d;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}

.empty-message {
  background-color: #e2e3e5;
  color: #383d41;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: bold;
  width: 40%;
  color: #495057;
}

.value {
  width: 60%;
}

.property-card, .requirement-card, .task-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.property-card h3, .requirement-card h3, .task-card h3 {
  margin-top: 0;
  color: var(--color-primary);
  font-size: 1.2rem;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.modal-body {
  padding: 1rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #333;
}

@media (max-width: 768px) {
  .cliente-home {
    padding: 1rem;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .label, .value {
    width: 100%;
  }
}
</style>

