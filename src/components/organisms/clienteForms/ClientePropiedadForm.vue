<template>
  <form @submit.prevent="registerPropiedad">
    <h2>Registro de Mi Propiedad</h2>
    
    <!-- Mensajes de error o éxito -->
    <div v-if="responseMessage" class="message" :class="{ 
        'success-message': isSuccess, 
        'error-message': !isSuccess 
    }">
        <i :class="isSuccess ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
        {{ formattedResponse }}
    </div>

    <!-- Título y Tipo de Propiedad -->
    <div class="form-group">
      <label for="titulo">Título*:</label>
      <input 
        type="text" 
        id="titulo" 
        v-model="form.titulo" 
        required 
        class="form-control"
        maxlength="100"
        placeholder="Ej: Apartamento en Chapinero, Casa en Cedritos"
      >
    </div>

    <div class="form-group">
      <label for="tipo_propiedad">Tipo de Propiedad*:</label>
      <select 
        id="tipo_propiedad" 
        v-model="form.tipo_propiedad" 
        required
        class="form-control"
      >
        <option value="">Seleccione un tipo</option>
        <option value="apartamento">Apartamento</option>
        <option value="casa">Casa</option>
        <option value="local">Local</option>
        <option value="terreno">Terreno</option>
      </select>
    </div>

    <!-- Modalidad de Negocio -->
    <div class="form-group">
      <label>Modalidad de Negocio*:</label>
      <div class="checkbox-group">
        <div class="modalidad-item">
          <label>
            <input 
              type="checkbox" 
              v-model="form.modalidad_de_negocio.venta_tradicional.activo"
            > Venta Tradicional
          </label>
          <input 
            type="number" 
            v-model="form.modalidad_de_negocio.venta_tradicional.precio" 
            placeholder="Precio Venta"
            class="form-control"
            :required="form.modalidad_de_negocio.venta_tradicional.activo"
          >
        </div>

        <div class="modalidad-item">
          <label>
            <input 
              type="checkbox" 
              v-model="form.modalidad_de_negocio.renta_tradicional.activo"
            > Renta Tradicional
          </label>
          <input 
            type="number" 
            v-model="form.modalidad_de_negocio.renta_tradicional.precio" 
            placeholder="Precio Renta"
            class="form-control"
            :required="form.modalidad_de_negocio.renta_tradicional.activo"
          >
        </div>
      </div>
    </div>

    <!-- Edificio (opcional) -->
    <div class="form-group">
      <label for="edificio">Edificio:</label>
      <select 
        id="edificio" 
        v-model="form.edificio" 
        class="form-control"
      >
        <option value="">Seleccione un edificio</option>
        <option v-for="edificio in edificios" :key="edificio.id" :value="edificio.id">
          {{ edificio.nombre }}
        </option>
      </select>
    </div>

    <!-- Información adicional -->
    <div class="form-group">
      <label for="descripcion">Descripción:</label>
      <textarea 
        id="descripcion" 
        v-model="form.descripcion" 
        class="form-control"
        rows="4"
        placeholder="Describa su propiedad, características importantes, etc."
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="habitaciones">Habitaciones:</label>
        <input 
          type="number" 
          id="habitaciones" 
          v-model="form.habitaciones" 
          class="form-control"
          min="0"
        >
      </div>
      <div class="form-group col-md-6">
        <label for="banos">Baños:</label>
        <input 
          type="number" 
          id="banos" 
          v-model="form.banos" 
          class="form-control"
          min="0"
        >
      </div>
    </div>

    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="metro_cuadrado_construido">Área construida (m²):</label>
        <input 
          type="number" 
          id="metro_cuadrado_construido" 
          v-model="form.metro_cuadrado_construido" 
          class="form-control"
          min="0"
        >
      </div>
      <div class="form-group col-md-6">
        <label for="estrato">Estrato:</label>
        <input 
          type="number" 
          id="estrato" 
          v-model="form.estrato" 
          class="form-control"
          min="1"
          max="6"
        >
      </div>
    </div>

    <button type="submit" :disabled="loading" class="btn btn-primary">
      {{ loading ? 'Registrando...' : 'Registrar Propiedad' }}
    </button>
  </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';

export default {
  name: 'ClientePropiedadForm',
  props: {
    clienteId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    // Estados reactivos
    const form = ref({
      propietario: props.clienteId,
      titulo: '',
      tipo_propiedad: '',
      edificio: '',
      descripcion: '',
      habitaciones: 0,
      banos: 0,
      metro_cuadrado_construido: 0,
      estrato: 0,
      modalidad_de_negocio: {
        venta_tradicional: { activo: false, precio: '' },
        renta_tradicional: { activo: false, precio: '' }
      }
    });

    // Estados para listas desplegables
    const edificios = ref([]);

    // Estados para mensajes y loading
    const loading = ref(false);
    const responseMessage = ref(false);
    const isSuccess = ref(false);
    const formattedResponse = ref('');

    // Función para mostrar mensaje de éxito
    const showSuccess = (message) => {
      isSuccess.value = true;
      formattedResponse.value = message;
      responseMessage.value = true;
      
      // Solo cerrar después de 3 segundos si fue exitoso
      setTimeout(() => {
        if (isSuccess.value) {
          resetForm();
          emit('propiedad-created');
        }
      }, 3000);
    };

    // Función para mostrar mensaje de error
    const showError = (message) => {
      isSuccess.value = false;
      formattedResponse.value = message;
      responseMessage.value = true;
    };

    // Función para resetear el formulario
    const resetForm = () => {
      form.value = {
        propietario: props.clienteId,
        titulo: '',
        tipo_propiedad: '',
        edificio: '',
        descripcion: '',
        habitaciones: 0,
        banos: 0,
        metro_cuadrado_construido: 0,
        estrato: 0,
        modalidad_de_negocio: {
          venta_tradicional: { activo: false, precio: '' },
          renta_tradicional: { activo: false, precio: '' }
        }
      };
    };

    // Función para registrar propiedad
    const registerPropiedad = async () => {
      loading.value = true;
      responseMessage.value = false;

      try {
        // Validar que al menos una modalidad de negocio esté activa
        if (!form.value.modalidad_de_negocio.venta_tradicional.activo && 
            !form.value.modalidad_de_negocio.renta_tradicional.activo) {
          showError('Debe seleccionar al menos una modalidad de negocio (venta o renta)');
          loading.value = false;
          return;
        }

        const dataToSend = {
          ...form.value,
          propietario: parseInt(props.clienteId)
        };

        console.log('Datos a enviar:', dataToSend);
        await axios.post('/crm/propiedades/', dataToSend);
        showSuccess('¡Propiedad registrada exitosamente!');

      } catch (error) {
        console.error('Error al crear propiedad:', error);
        let errorMessage = 'Error al registrar la propiedad';
        
        if (error.response) {
          errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        }
        
        showError(errorMessage);
      } finally {
        loading.value = false;
      }
    };

    // Función para obtener edificios
    const fetchEdificios = async () => {
      try {
        const response = await axios.get('/crm/edificios/');
        edificios.value = response.data;
      } catch (error) {
        console.error('Error al obtener edificios:', error);
        showError('Error al cargar los edificios');
      }
    };

    // Cargar información al montar el componente
    onMounted(() => {
      // Cargar listas desplegables
      fetchEdificios();
    });

    return {
      form,
      edificios,
      loading,
      responseMessage,
      isSuccess,
      formattedResponse,
      registerPropiedad
    };
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -5px;
  margin-left: -5px;
}

.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding-right: 5px;
  padding-left: 5px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modalidad-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.message {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  animation: fadeIn 0.3s ease;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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
  width: 100%;
  margin-top: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
