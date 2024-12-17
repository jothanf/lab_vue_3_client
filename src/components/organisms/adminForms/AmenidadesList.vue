<template>
  <div class="amenidades-list">
    <h1>Amenidades</h1>
    
    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="loading">
      Cargando...
    </div>

    <!-- Lista de amenidades -->
    <div v-else class="card-container">
      <div v-for="amenidad in amenidades" :key="amenidad.id" class="card">
        <div class="icon-container">
          <img 
            :src="amenidad.icono_url || '/default-icon.png'" 
            :alt="amenidad.nombre"
            class="icon"
            @error="handleImageError"
          />
        </div>
        <div class="card-content">
          <h3>{{ amenidad.nombre }}</h3>
          <p class="categoria">{{ amenidad.categoria }}</p>
          <p class="descripcion">{{ amenidad.descripcion }}</p>
          <button @click="verDetalles(amenidad.id)" class="btn-detalles">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'AmenidadesList',
  data() {
    return {
      amenidades: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchAmenidades() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/crm/amenidades/');
        console.log('Respuesta del servidor:', response.data);
        this.amenidades = response.data;
      } catch (error) {
        console.error('Error al obtener amenidades:', error);
        this.error = 'Error al cargar las amenidades: ' + 
          (error.response?.data?.error || error.message);
      } finally {
        this.loading = false;
      }
    },
    handleImageError(e) {
      e.target.src = '/default-icon.png';
    },
    verDetalles(id) {
      this.$router.push(`/detalles-de-amenidades/${id}`);
    }
  },
  created() {
    this.fetchAmenidades();
  }
}
</script>

<style scoped>
.amenidades-list {
  padding: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card:hover {
  transform: translateY(-5px);
}

.icon-container {
  height: 150px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.icon {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card-content {
  padding: 15px;
}

.btn-detalles {
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-detalles:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  padding: 10px;
  margin: 10px 0;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>