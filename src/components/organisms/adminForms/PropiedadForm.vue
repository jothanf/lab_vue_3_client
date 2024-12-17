<template>
  <form @submit.prevent="registerPropiedad">
    <h2>Registro de Propiedad</h2>
    
    <!-- Mensajes de error o éxito -->
    <div v-if="responseMessage" class="message" :class="{ 
        'success-message': isSuccess, 
        'error-message': !isSuccess 
    }">
        <i :class="isSuccess ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
        {{ formattedResponse }}
    </div>

    <!-- Propietario -->
    <div class="form-group">
      <label for="propietario">Propietario*:</label>
      <select 
        id="propietario" 
        v-model="form.propietario" 
        required 
        class="form-control"
      >
        <option value="">Seleccione un propietario</option>
        <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
          {{ cliente.nombre }} {{ cliente.apellidos }}
        </option>
      </select>
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

    <button type="submit" :disabled="loading" class="btn btn-primary">
      {{ loading ? 'Registrando...' : 'Registrar Propiedad' }}
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import axios from '@/utils/axios';

// Definir emisores
const emit = defineEmits(['propiedad-created']);

// Estados reactivos
const form = ref({
  propietario: '',
  titulo: '',
  tipo_propiedad: '',
  edificio: '',
  agente: null,
  modalidad_de_negocio: {
    venta_tradicional: { activo: false, precio: '' },
    renta_tradicional: { activo: false, precio: '' }
  }
});

// Estados para listas desplegables
const clientes = ref([]);
const edificios = ref([]);

// Estado para información del agente
const agenteActual = ref(null);

// Estados para mensajes y loading
const loading = ref(false);
const responseMessage = ref(false);
const isSuccess = ref(false);
const formattedResponse = ref('');

// Función para obtener el ID del agente
const obtenerIdAgente = () => {
  const userInfo = localStorage.getItem('user');
  if (userInfo) {
    try {
      const parsedUser = JSON.parse(userInfo);
      console.log('Información completa del usuario:', parsedUser);
      
      // Verificar si existe agente_id o buscar una alternativa
      const agenteId = parsedUser.agente_id || 
                       parsedUser.agente?.id || 
                       parsedUser.id;
      
      console.log('ID del agente encontrado:', agenteId);
      return agenteId;
    } catch (error) {
      console.error('Error al parsear información del usuario:', error);
      return null;
    }
  }
  return null;
};

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
    propietario: '',
    titulo: '',
    tipo_propiedad: '',
    edificio: '',
    agente: null,
    modalidad_de_negocio: {
      venta_tradicional: { activo: false, precio: '' },
      renta_tradicional: { activo: false, precio: '' }
    }
  };
};

// Función modificada para registrar propiedad
const registerPropiedad = async () => {
  loading.value = true;
  responseMessage.value = false;

  try {
    const agenteId = obtenerIdAgente();
    if (!agenteId) {
      showError('No se encontró información del agente');
      return;
    }

    const dataToSend = {
      ...form.value,
      agente: parseInt(agenteId)
    };

    console.log('Datos a enviar:', dataToSend);
    await axios.post('/crm/propiedades/', dataToSend);
    showSuccess('¡Propiedad registrada exitosamente!');

  } catch (error) {
    console.error('Error al crear propiedad:', error);
    let errorMessage = 'Error al registrar la propiedad';
    
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    showError(errorMessage);
  } finally {
    loading.value = false;
  }
};

// Función para obtener clientes
const fetchClientes = async () => {
  try {
    const response = await axios.get('/accounts/cliente/');
    clientes.value = response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    showError('Error al cargar los clientes');
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
  // Obtener información del agente desde localStorage
  const userInfo = localStorage.getItem('user');
  
  if (userInfo) {
    try {
      const parsedUser = JSON.parse(userInfo);
      console.log('Información del agente:', parsedUser);
      
      // Verificar que el objeto tenga la estructura esperada
      if (parsedUser && parsedUser.id) {
        // Cargar información del agente
        agenteActual.value = {
          id: obtenerIdAgente(),
          nombre: `${parsedUser.first_name} ${parsedUser.last_name}`
        };
        
        console.log('Agente actual cargado:', agenteActual.value);
      } else {
        console.error('Estructura de usuario inválida');
        showError('Error al cargar información del agente');
      }
    } catch (error) {
      console.error('Error al parsear información del usuario:', error);
      showError('Error al cargar información del agente');
    }
  } else {
    console.error('No se encontró información de usuario');
    showError('No se encontró información del agente');
  }

  // Cargar listas desplegables
  fetchClientes();
  fetchEdificios();
});
</script>

<style scoped>
.propiedad-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
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