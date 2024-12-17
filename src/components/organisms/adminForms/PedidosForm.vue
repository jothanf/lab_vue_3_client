<template>
  <form @submit.prevent="registrarRequerimiento">
    <h2>Registro de Pedido Inmobiliario</h2>
    
    <!-- Mensajes de error o éxito -->
    <div v-if="responseMessage" class="message" :class="{ 
        'success-message': isSuccess, 
        'error-message': !isSuccess 
    }">
        <i :class="isSuccess ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
        {{ formattedResponse }}
    </div>

    <!-- Cliente -->
    <div class="form-group">
      <label for="cliente">Cliente*:</label>
      <select 
        id="cliente" 
        v-model="form.cliente" 
        required 
        class="form-control"
      >
        <option value="">Seleccione un cliente</option>
        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
          {{ cliente.nombre }} {{ cliente.apellidos }}
        </option>
      </select>
    </div>

    <!-- Tipo de Requerimiento -->
    <div class="form-group">
      <label>Tipo de Requerimiento*:</label>
      <div class="checkbox-group">
        <label>
          <input 
            type="checkbox" 
            v-model="form.tipo_negocio.compra"
            @change="updateTipoNegocio"
          > Compra
        </label>
        <label>
          <input 
            type="checkbox" 
            v-model="form.tipo_negocio.renta"
            @change="updateTipoNegocio"
          > Renta
        </label>
      </div>
    </div>

    <!-- Tiempo de estadía -->
    <div class="form-group" v-if="form.tipo_negocio.renta">
      <label for="tiempo_estadia">Tiempo de estadía (meses):</label>
      <input 
        type="number" 
        id="tiempo_estadia" 
        v-model="form.tiempo_estadia" 
        class="form-control"
        min="1"
        required
      >
    </div>

    <!-- Presupuesto mínimo -->
    <div class="form-group">
      <label for="presupuesto_minimo">Presupuesto mínimo:</label>
      <input 
        type="number" 
        id="presupuesto_minimo" 
        v-model="form.presupuesto_minimo" 
        class="form-control"
        min="0"
        required
      >
    </div>

    <!-- Presupuesto máximo -->
    <div class="form-group">
      <label for="presupuesto_maximo">Presupuesto máximo:</label>
      <input 
        type="number" 
        id="presupuesto_maximo" 
        v-model="form.presupuesto_maximo" 
        class="form-control"
        min="0"
        required
      >
    </div>

    <button type="submit" :disabled="loading" class="btn btn-primary">
      {{ loading ? 'Registrando...' : 'Registrar Pedido' }}
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import axios from '@/utils/axios';

const emit = defineEmits(['pedido-created']);

const form = ref({
  cliente: '',
  tipo_negocio: {
    compra: false,
    renta: false
  },
  tiempo_estadia: null,
  presupuesto_minimo: null,
  presupuesto_maximo: null,
  agente: null,
  estado: 'pendiente',
  habitantes: 0
});

const clientes = ref([]);
const loading = ref(false);
const responseMessage = ref(false);
const isSuccess = ref(false);
const formattedResponse = ref('');

const showSuccess = (message) => {
  isSuccess.value = true;
  formattedResponse.value = message;
  responseMessage.value = true;
  
  // Solo cerrar después de 3 segundos si fue exitoso
  setTimeout(() => {
    if (isSuccess.value) {
      resetForm();
      emit('pedido-created');
    }
  }, 3000);
};

const showError = (message) => {
  isSuccess.value = false;
  formattedResponse.value = message;
  responseMessage.value = true;
};

const resetForm = () => {
  form.value = {
    cliente: '',
    tipo_negocio: {
      compra: false,
      renta: false
    },
    tiempo_estadia: null,
    presupuesto_minimo: null,
    presupuesto_maximo: null,
    agente: null,
    estado: 'pendiente',
    habitantes: 0
  };
};

const registrarRequerimiento = async () => {
  loading.value = true;
  responseMessage.value = false;

  try {
    const agenteId = obtenerIdAgente();
    if (!agenteId) {
      showError('No se encontró información del agente');
      return;
    }

    const tipo_negocio = {
      compra: form.value.tipo_negocio.compra,
      renta: form.value.tipo_negocio.renta
    };

    const dataToSend = {
      ...form.value,
      agente: agenteId,
      tipo_negocio: tipo_negocio,
      presupuesto_minimo: Number(form.value.presupuesto_minimo),
      presupuesto_maximo: Number(form.value.presupuesto_maximo),
      tiempo_estadia: form.value.tipo_negocio.renta ? Number(form.value.tiempo_estadia) : null
    };

    console.log('Datos a enviar:', dataToSend);

    await axios.post('/crm/requerimientos/', dataToSend);
    showSuccess('¡Pedido registrado exitosamente!');

  } catch (error) {
    console.error('Error al registrar requerimiento:', error);
    let errorMessage = 'Error al registrar el pedido';
    
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    showError(errorMessage);
  } finally {
    loading.value = false;
  }
};

const obtenerIdAgente = () => {
  const userInfo = localStorage.getItem('user');
  if (userInfo) {
    const parsedUser = JSON.parse(userInfo);
    return parsedUser.agente_id || parsedUser.agente?.id || parsedUser.id;
  }
  return null;
};

const fetchClientes = async () => {
  try {
    const response = await axios.get('/accounts/cliente/');
    clientes.value = response.data;
  } catch (error) {
    console.error('Error al cargar los clientes:', error);
    showError('Error al cargar los clientes');
  }
};

const updateTipoNegocio = () => {
  // Resetea el tiempo de estadía si no se está alquilando
  if (!form.value.tipo_negocio.renta) {
    form.value.tiempo_estadia = null;
  }
};

onMounted(() => {
  fetchClientes();
});
</script>

<style scoped>
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
</style>