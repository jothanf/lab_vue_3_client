<template>
  <div class="propiedad-form">
    <h2>Crear Propiedad</h2>
    
    <!-- Notificaciones -->
    <div v-if="notification" :class="['alert', `alert-${notification.type}`]">
      {{ notification.message }}
    </div>

    <form @submit.prevent="submitForm">
      <!-- Agente y Propietario -->
      <div class="form-group">
        <label for="agente">Agente*:</label>
        <select 
          id="agente" 
          v-model="formData.agente" 
          required 
          class="form-control"
        >
          <option value="">Seleccione un agente</option>
          <option v-for="agente in agentes" :key="agente.id" :value="agente.id">
            {{ agente.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="propietario">Propietario*:</label>
        <select 
          id="propietario" 
          v-model="formData.propietario" 
          required 
          class="form-control"
        >
          <option value="">Seleccione un propietario</option>
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
            {{ cliente.nombre }}
          </option>
        </select>
      </div>

      <!-- Título y Tipo de Propiedad -->
      <div class="form-group">
        <label for="titulo">Título*:</label>
        <input 
          type="text" 
          id="titulo" 
          v-model="formData.titulo" 
          required 
          class="form-control"
          maxlength="100"
        >
      </div>

      <div class="form-group">
        <label for="tipo_propiedad">Tipo de Propiedad:</label>
        <select 
          id="tipo_propiedad" 
          v-model="formData.tipo_propiedad" 
          class="form-control"
        >
          <option value="">Seleccione un tipo</option>
          <option value="apartamento">Apartamento</option>
          <option value="casa">Casa</option>
          <option value="local">Local</option>
          <option value="terreno">Terreno</option>
        </select>
      </div>

      <!-- Edificio (opcional) -->
      <div class="form-group">
        <label for="edificio">Edificio:</label>
        <select 
          id="edificio" 
          v-model="formData.edificio" 
          class="form-control"
        >
          <option value="">Seleccione un edificio</option>
          <option v-for="edificio in edificios" :key="edificio.id" :value="edificio.id">
            {{ edificio.nombre }}
          </option>
        </select>
      </div>

      <!-- Modalidad de Negocio -->
      <div class="form-group">
        <label>Modalidad de Negocio:</label>
        <div class="checkbox-group">
          <label>
            <input 
              type="checkbox" 
              v-model="formData.modalidad_de_negocio.venta_tradicional.activo"
            > Venta Tradicional
          </label>
          <input 
            type="number" 
            v-model="formData.modalidad_de_negocio.venta_tradicional.precio" 
            placeholder="Precio Venta"
            class="form-control"
          >

          <label>
            <input 
              type="checkbox" 
              v-model="formData.modalidad_de_negocio.renta_tradicional.activo"
            > Renta Tradicional
          </label>
          <input 
            type="number" 
            v-model="formData.modalidad_de_negocio.renta_tradicional.precio" 
            placeholder="Precio Renta"
            class="form-control"
          >

          <label>
            <input 
              type="checkbox" 
              v-model="formData.modalidad_de_negocio.renta_amoblado.activo"
            > Renta Amoblado
          </label>
          <input 
            type="number" 
            v-model="formData.modalidad_de_negocio.renta_amoblado.precio" 
            placeholder="Precio Renta Amoblado"
            class="form-control"
          >
        </div>
      </div>

      <!-- Detalles Adicionales -->
      <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea 
          id="descripcion" 
          v-model="formData.descripcion" 
          class="form-control" 
          rows="3"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary btn-submit">Guardar Propiedad</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'PropiedadForm',
  data() {
    return {
      formData: {
        agente: '',
        propietario: '',
        titulo: '',
        modalidad_de_negocio: {
          venta_tradicional: { activo: false, precio: 0 },
          renta_tradicional: { activo: false, precio: 0 },
          renta_amoblado: { activo: false, precio: 0 }
        },
        tipo_propiedad: '',
        edificio: '',
        descripcion: ''
      },
      agentes: [],
      clientes: [],
      edificios: [],
      notification: null
    }
  },
  created() {
    this.fetchAgentes();
    this.fetchClientes();
    this.fetchEdificios();
  },
  methods: {
    showNotification(message, type = 'success') {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    },

    async fetchAgentes() {
      try {
        const response = await axios.get('/accounts/agente/');
        this.agentes = response.data;
      } catch (error) {
        console.error('Error al obtener agentes:', error);
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.id) {
            this.agentes = [{ id: user.id, nombre: `${user.first_name} ${user.last_name}` }];
          }
        }
        this.showNotification('Error al cargar los agentes', 'error');
      }
    },

    async fetchClientes() {
      try {
        const response = await axios.get('/accounts/cliente/');
        this.clientes = response.data;
      } catch (error) {
        console.error('Error al obtener clientes:', error);
        
        // Manejo de errores más detallado
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error('Datos del error:', error.response.data);
          console.error('Código de estado:', error.response.status);
        } else if (error.request) {
          // La solicitud se hizo pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor');
        } else {
          // Algo sucedió al configurar la solicitud
          console.error('Error al configurar la solicitud', error.message);
        }

        // Intenta obtener el usuario actual como fallback
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user && user.id) {
            try {
              // Intentar obtener los clientes asociados al agente actual
              const agenteResponse = await axios.get(`/accounts/agente/${user.id}/clientes/`);
              this.clientes = agenteResponse.data;
            } catch (agenteError) {
              console.error('Error al obtener clientes del agente:', agenteError);
            }
          }
        }

        this.showNotification('Error al cargar los clientes. Por favor, recargue la página.', 'error');
      }
    },

    async fetchEdificios() {
      try {
        const response = await axios.get('/crm/edificios/');
        this.edificios = response.data;
      } catch (error) {
        console.error('Error al obtener edificios:', error);
        this.showNotification('Error al cargar los edificios', 'error');
      }
    },

    async submitForm() {
      try {
        // Validaciones básicas
        if (!this.formData.agente || !this.formData.propietario || !this.formData.titulo) {
          this.showNotification('Por favor complete los campos obligatorios', 'error');
          return;
        }

        // Enviar datos al backend
        const response = await axios.post('/crm/propiedades/', this.formData);
        
        this.showNotification('Propiedad creada exitosamente');
        
        // Limpiar el formulario
        this.resetForm();
        
        // Emitir evento para actualizar la lista de propiedades si es necesario
        this.$emit('propiedad-created', response.data);

      } catch (error) {
        console.error('Error al crear propiedad:', error);
        let errorMessage = 'Error al guardar la propiedad';
        
        if (error.response?.data) {
          errorMessage = typeof error.response.data === 'object'
            ? Object.values(error.response.data).join('\n')
            : error.response.data;
        }
        
        this.showNotification(errorMessage, 'error');
      }
    },

    resetForm() {
      this.formData = {
        agente: '',
        propietario: '',
        titulo: '',
        modalidad_de_negocio: {
          venta_tradicional: { activo: false, precio: 0 },
          renta_tradicional: { activo: false, precio: 0 },
          renta_amoblado: { activo: false, precio: 0 }
        },
        tipo_propiedad: '',
        edificio: '',
        descripcion: ''
      };
    }
  }
}
</script>

<style scoped>
.propiedad-form {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.btn-submit {
  width: 100%;
  margin-top: var(--spacing-md);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>