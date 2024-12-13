<template>
  <div class="detalles-propiedad">
    <header class="header">
      <h1>{{ propiedad?.titulo || 'Detalles de Propiedad' }}</h1>
      <button @click="volver" class="btn btn-secondary">
        <i class="fas fa-arrow-left"></i> Volver
      </button>
    </header>

    <div v-if="propiedad" class="contenido">
      <!-- Información Básica -->
      <section class="seccion">
        <h2>Información Básica</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Código:</span>
            <span class="valor">{{ propiedad.codigo || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Tipo de Propiedad:</span>
            <span class="valor">{{ propiedad.tipo_propiedad || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Modalidad de Negocio:</span>
            <span class="valor">{{ propiedad.modalidad_de_negocio || 'No disponible' }}</span>
          </div>
        </div>
      </section>

      <!-- Información del Propietario y Agente -->
      <section class="seccion">
        <h2>Contactos</h2>
        <div class="grid">
          <div class="subseccion">
            <h3>Propietario</h3>
            <div v-if="propiedad.propietario">
              <p>Nombre: {{ propiedad.propietario.nombre }}</p>
              <p>Teléfono: {{ propiedad.propietario.telefono }}</p>
              <p>Email: {{ propiedad.propietario.email }}</p>
            </div>
            <p v-else>No hay información del propietario</p>
          </div>
          <div class="subseccion">
            <h3>Agente</h3>
            <div v-if="propiedad.agente">
              <p>Nombre: {{ propiedad.agente.nombre }}</p>
              <p>Teléfono: {{ propiedad.agente.telefono }}</p>
              <p>Email: {{ propiedad.agente.email }}</p>
            </div>
            <p v-else>No hay información del agente</p>
          </div>
        </div>
      </section>

      <!-- Características -->
      <section class="seccion">
        <h2>Características</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Área Construida:</span>
            <span class="valor">{{ propiedad.metro_cuadrado_construido || 0 }} m²</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Área Total:</span>
            <span class="valor">{{ propiedad.metro_cuadrado_propiedad || 0 }} m²</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Habitaciones:</span>
            <span class="valor">{{ propiedad.habitaciones || 0 }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Baños:</span>
            <span class="valor">{{ propiedad.banos || 0 }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Nivel:</span>
            <span class="valor">{{ propiedad.nivel || 'No disponible' }}</span>
          </div>
        </div>
      </section>

      <!-- Información Adicional -->
      <section class="seccion">
        <h2>Información Adicional</h2>
        <div class="grid">
          <div class="campo">
            <span class="etiqueta">Estrato:</span>
            <span class="valor">{{ propiedad.estrato || 'No disponible' }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Valor Administración:</span>
            <span class="valor">${{ formatearNumero(propiedad.valor_administracion) }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Valor Predial:</span>
            <span class="valor">${{ formatearNumero(propiedad.valor_predial) }}</span>
          </div>
          <div class="campo">
            <span class="etiqueta">Fecha de Ingreso:</span>
            <span class="valor">{{ formatFecha(propiedad.fecha_ingreso) }}</span>
            <span class="tiempo-transcurrido">{{ calcularTiempo(propiedad.fecha_ingreso) }}</span>
          </div>
        </div>
      </section>

      <!-- Descripción -->
      <section class="seccion">
        <h2>Descripción</h2>
        <p class="descripcion">{{ propiedad.descripcion || 'Sin descripción disponible' }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.detalles-propiedad {
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

.descripcion {
  line-height: 1.6;
  color: var(--color-loblolly-950);
}

.tiempo-transcurrido {
  font-size: 0.8rem;
  color: var(--color-loblolly-700);
  font-style: italic;
}

.subseccion {
  background-color: var(--color-white-sand-50);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.subseccion h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
  font-size: 1.2rem;
}
</style>

<script>
import axios from '@/utils/axios';

export default {
  name: 'DetallesDePropiedad',
  data() {
    return {
      propiedad: null
    }
  },
  async created() {
    try {
      console.log('ID de la propiedad:', this.$route.params.id); // Para debugging
      const response = await axios.get(`/crm/propiedades/${this.$route.params.id}/`);
      console.log('Respuesta de la API:', response.data); // Para debugging
      this.propiedad = response.data;
    } catch (error) {
      console.error('Error al cargar los detalles de la propiedad:', error);
      console.log('URL intentada:', `/crm/propiedades/${this.$route.params.id}/`); // Para debugging
    }
  },
  methods: {
    volver() {
      this.$router.go(-1);
    },
    formatFecha(fecha) {
      if (!fecha) return 'Null';
      const date = new Date(fecha);
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
    },
    calcularTiempo(fecha) {
      if (!fecha) return 'Null';
      const fechaIngreso = new Date(fecha);
      const hoy = new Date();
      const diferencia = hoy - fechaIngreso;
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      return `${dias} días desde la fecha de ingreso`;
    },
    formatearNumero(numero) {
      return numero ? numero.toLocaleString('es-CO') : '0';
    }
  }
}
</script>