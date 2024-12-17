<template>
  <div class="detalles-pedido">
    <header class="header">
      <h1>{{ requerimiento?.cliente.nombre || 'Detalles del Pedido' }}</h1>
      <button @click="volver" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver
      </button>
      <button v-if="!isEditing" @click="activarEdicion" class="btn btn-primary">
        <i class="fas fa-edit"></i> Editar
      </button>
      <button v-if="isEditing" @click="guardarCambios" class="btn btn-success">
        <i class="fas fa-save"></i> Guardar
      </button>
    </header>

    <div v-if="requerimiento" class="contenido">
      <!-- Información del Requerimiento -->
      <section class="seccion">
        <h2>Información del Requerimiento</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">ID:</span>
            <span class="valor">{{ requerimiento.id }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Agente:</span>
            <span class="valor">{{ requerimiento.agente.nombre }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Cliente:</span>
            <span class="valor">{{ requerimiento.cliente.nombre }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Fecha de Ingreso:</span>
            <span class="valor">{{ formatFecha(requerimiento.fecha_ingreso) }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Tiempo de Estadía:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.tiempo_estadia" class="input" />
            <span v-else class="valor">{{ requerimiento.tiempo_estadia }} días</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Tipo de Negocio:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.tipo_negocio" class="input" />
            <span v-else class="valor">{{ requerimiento.tipo_negocio }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Habitantes:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.habitantes" class="input" />
            <span v-else class="valor">{{ requerimiento.habitantes }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Área Mínima:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.area_minima" class="input" />
            <span v-else class="valor">{{ requerimiento.area_minima }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Área Máxima:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.area_maxima" class="input" />
            <span v-else class="valor">{{ requerimiento.area_maxima }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Área Lote:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.area_lote" class="input" />
            <span v-else class="valor">{{ requerimiento.area_lote }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Presupuesto Mínimo:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.presupuesto_minimo" class="input" />
            <span v-else class="valor">${{ formatearNumero(requerimiento.presupuesto_minimo) }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Presupuesto Máximo:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.presupuesto_maximo" class="input" />
            <span v-else class="valor">${{ formatearNumero(requerimiento.presupuesto_maximo) }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Descripción:</span>
            <textarea v-if="isEditing" v-model="requerimientoEditado.descripcion" class="input"></textarea>
            <p v-else class="valor">{{ requerimiento.descripcion || 'Sin descripción disponible' }}</p>
          </div>
          <div class="campo">
            <span class="etiqueta">Habitaciones:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.habitaciones" class="input" />
            <span v-else class="valor">{{ requerimiento.habitaciones }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Habitaciones de Servicio:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.habitaciones_servicio" class="input" />
            <span v-else class="valor">{{ requerimiento.habitaciones_servicio }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Baños:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.banos" class="input" />
            <span v-else class="valor">{{ requerimiento.banos }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Parqueaderos:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.parqueaderos" class="input" />
            <span v-else class="valor">{{ requerimiento.parqueaderos }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Depósitos:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.depositos" class="input" />
            <span v-else class="valor">{{ requerimiento.depositos }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Estado:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.estado" class="input" />
            <span v-else class="valor">{{ requerimiento.estado }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Prioridad:</span>
            <input v-if="isEditing" v-model="requerimientoEditado.prioridad" class="input" />
            <span v-else class="valor">{{ requerimiento.prioridad }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Comentarios:</span>
            <textarea v-if="isEditing" v-model="requerimientoEditado.comentarios" class="input"></textarea>
            <p v-else class="valor">{{ requerimiento.comentarios || 'Sin comentarios disponibles' }}</p>
          </div>
          <!-- Agrega más campos según sea necesario -->
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'DetallesPedido',
  data() {
    return {
      requerimiento: null,
      requerimientoEditado: {},
      isEditing: false,
    }
  },
  async created() {
    try {
      const response = await axios.get(`/crm/requerimientos/${this.$route.params.id}/`);
      this.requerimiento = response.data;
      this.requerimientoEditado = { ...this.requerimiento }; // Copia para edición
    } catch (error) {
      console.error('Error al cargar los detalles del requerimiento:', error);
    }
  },
  methods: {
    volver() {
      this.$router.go(-1);
    },
    activarEdicion() {
      this.requerimientoEditado = { ...this.requerimiento }; // Copia para edición
      this.isEditing = true;
    },
    async guardarCambios() {
      try {
        const response = await axios.put(`/crm/requerimientos/${this.requerimiento.id}/`, this.requerimientoEditado);
        this.requerimiento = response.data; // Actualiza la información
        this.isEditing = false; // Desactiva el modo de edición
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
      }
    },
    formatFecha(fecha) {
      if (!fecha) return 'Null';
      const date = new Date(fecha);
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    },
    formatearNumero(numero) {
      return numero ? numero.toLocaleString('es-CO') : '0';
    },
  }
}
</script>

<style scoped>
/* Estilos para el componente */
.detalles-pedido {
  max-width: 1200px;
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
</style>