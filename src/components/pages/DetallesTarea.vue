<template>
  <div class="detalles-tarea">
    <header class="header">
      <h1>{{ tarea?.titulo || 'Detalles de Tarea' }}</h1>
      <button @click="volver" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver
      </button>
      <button v-if="!isEditing" @click="activarEdicion" class="btn btn-primary">
        <i class="fas fa-edit"></i> Editar
      </button>
      <button v-if="isEditing" @click="guardarCambios" class="btn btn-success">
        <i class="fas fa-save"></i> Guardar
      </button>
      <button @click="showSeguimientoForm = true" class="btn btn-info">
        <i class="fas fa-tasks"></i> Agregar Seguimiento
      </button>
    </header>

    <div v-if="tarea" class="contenido">
      <!-- Información Básica -->
      <section class="seccion">
        <h2>Información Básica</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Tipo de Tarea:</span>
            <span class="valor">{{ tarea.tipo_tarea || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Descripción:</span>
            <textarea v-if="isEditing" v-model="tarea.descripcion" class="input"></textarea>
            <p v-else class="valor">{{ tarea.descripcion || 'No disponible' }}</p>
          </div>
          <div class="campo">
            <span class="etiqueta">Estado:</span>
            <select v-if="isEditing" v-model="tarea.estado" class="input">
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <span v-else class="valor">{{ tarea.estado || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Fecha de Vencimiento:</span>
            <span class="valor">{{ formatFecha(tarea.fecha_vencimiento) }}</span>
            <span class="tiempo-transcurrido">{{ calcularTiempoRestante(tarea.fecha_vencimiento) }}</span>
          </div>
        </div>
      </section>

      <!-- Mostrar Seguimientos -->
      <section class="seccion">
        <h2>Seguimientos</h2>
        <div v-if="seguimientos.length > 0" class="seguimientos-container">
          <div v-for="seguimiento in seguimientos" :key="seguimiento.id" class="seguimiento-card">
            <h3>Descripción:</h3>
            <p>{{ seguimiento.descripcion }}</p>
            <h4>Estado:</h4>
            <p class="estado">{{ seguimiento.estado }}</p>
            <h4>Notas Internas:</h4>
            <p>{{ seguimiento.notas_internas }}</p>
            <h4>Resultado:</h4>
            <p>{{ seguimiento.resultado }}</p>
            <h4>Fecha de Inicio:</h4>
            <p>{{ seguimiento.fecha_inicio }}</p>
          </div>
        </div>
        <div v-else>
          <p>No hay seguimientos para esta tarea.</p>
        </div>
      </section>

      <!-- Manejo de errores -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <!-- Popup para el formulario de seguimiento -->
      <MyPopUp 
        :visible="showSeguimientoForm" 
        @cerrar="showSeguimientoForm = false" 
        titulo="Agregar Seguimiento"
      >
        <SeguimientoForm 
          :tarea-id="tarea.id"
          @seguimiento-created="handleSeguimientoCreated"
        />
      </MyPopUp>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import MyPopUp from '@/components/molecules/MyPopUp.vue';
import SeguimientoForm from '@/components/organisms/adminForms/SeguimientoForm.vue';

export default {
  components: {
    MyPopUp,
    SeguimientoForm
  },
  data() {
    return {
      tarea: null,
      seguimientos: [],
      isEditing: false,
      errorMessage: '',
      showSeguimientoForm: false
    };
  },
  created() {
    this.obtenerTarea();
  },
  methods: {
    async obtenerTarea() {
      try {
        const response = await axios.get(`/crm/tareas/${this.$route.params.id}/`);
        this.tarea = response.data.tarea;
        this.seguimientos = response.data.seguimientos;
      } catch (error) {
        console.error('Error al obtener la tarea:', error);
      }
    },
    activarEdicion() {
      this.isEditing = true;
    },
    async guardarCambios() {
      try {
        await axios.put(`/crm/tareas/${this.tarea.id}/`, this.tarea);
        this.isEditing = false;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Error al guardar los cambios: ' + (error.response.data.detail || error.message);
        console.error('Error al guardar los cambios:', error);
      }
    },
    calcularTiempoRestante(fecha) {
      const fechaVencimiento = new Date(fecha);
      const hoy = new Date();
      const diferencia = fechaVencimiento - hoy;
      const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
      return diasRestantes >= 0 ? `${diasRestantes} días restantes` : 'Vencido';
    },
    formatFecha(fecha) {
      const date = new Date(fecha);
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    },
    volver() {
      this.$router.go(-1);
    },
    handleSeguimientoCreated() {
      this.showSeguimientoForm = false;
      this.obtenerTarea(); // Recargar los datos de la tarea
    }
  }
}
</script>

<style scoped>
.detalles-tarea {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.seccion {
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.seccion h2 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.5rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.etiqueta {
  font-weight: bold;
  color: var(--color-loblolly-800);
  font-size: 0.9rem;
}

.valor {
  color: var(--color-loblolly-950);
}

.input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-mine-shaft-100);
  border-radius: var(--border-radius-sm);
}

.error-message {
  color: red;
  margin-top: var(--spacing-md);
}

.seguimientos-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.seguimiento-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-mine-shaft-100);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;
}

.seguimiento-card:hover {
  transform: scale(1.02);
}

.estado {
  font-weight: bold;
  color: var(--color-primary);
}

h3, h4 {
  margin: var(--spacing-md) 0 0.5rem;
  color: var(--color-primary);
}

p {
  margin: 0.5rem 0;
  color: var(--color-loblolly-950);
}
</style>