<template>
  <div class="zonas-de-interes-list">
    <h1>Zonas de Interés</h1>
    
    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="loading">
      Cargando...
    </div>

    <!-- Lista de zonas de interés -->
    <div v-else class="card-container">
      <div v-for="zona in zonasDeInteres" :key="zona.id" class="card">
        <div class="icon-container">
          <img 
            :src="zona.icono_url || '/default-icon.png'" 
            :alt="zona.nombre"
            class="icon"
            @error="handleImageError"
          />
        </div>
        <div class="card-content">
          <h3>{{ zona.nombre }}</h3>
          <p class="categoria">{{ zona.categoria }}</p>
          <p class="descripcion">{{ zona.descripcion }}</p>
          <button @click="verDetalles(zona.id)" class="btn-detalles">
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
  name: 'ZonasDeInteresList',
  data() {
    return {
      zonasDeInteres: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchZonasDeInteres() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/crm/zonasDeInteres/');
        this.zonasDeInteres = response.data;
      } catch (error) {
        this.error = 'Error al cargar las zonas de interés: ' + 
          (error.response?.data?.error || error.message);
      } finally {
        this.loading = false;
      }
    },
    verDetalles(id) {
      this.$router.push(`/detalles-de-zona-de-interes/${id}`);
    },
    handleImageError(e) {
      e.target.src = '/default-icon.png'; // Manejo de error de imagen
    }
  },
  created() {
    this.fetchZonasDeInteres();
  }
}
</script>

<style scoped>
.zonas-de-interes-list {
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
</style>