<template>
  <div class="puntos-de-interes-list">
    <h1>Puntos de Interés</h1>
    
    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="loading">
      Cargando...
    </div>

    <!-- Lista de puntos de interés -->
    <div v-else class="card-container">
      <div v-for="punto in puntosDeInteres" :key="punto.id" class="card">
        <div class="icon-container">
          <img 
            :src="punto.icono_url || '/default-icon.png'" 
            :alt="punto.nombre"
            class="icon"
            @error="handleImageError"
          />
        </div>
        <div class="card-content">
          <h3>{{ punto.nombre }}</h3>
          <p class="categoria">{{ punto.categoria }}</p>
          <p class="descripcion">{{ punto.descripcion }}</p>
          <p v-if="punto.direccion" class="direccion">
            <strong>Dirección:</strong> {{ punto.direccion }}
          </p>
          <button @click="verDetalles(punto.id)" class="btn-detalles">
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
  name: 'PuntosDeInteresList',
  data() {
    return {
      puntosDeInteres: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchPuntosDeInteres() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/crm/puntos-de-interes/');
        this.puntosDeInteres = response.data;
      } catch (error) {
        this.error = 'Error al cargar los puntos de interés: ' + 
          (error.response?.data?.error || error.message);
      } finally {
        this.loading = false;
      }
    },
    verDetalles(id) {
      this.$router.push(`/detalles-de-punto-de-interes/${id}`);
    },
    handleImageError(e) {
      e.target.src = '/default-icon.png';
    }
  },
  created() {
    this.fetchPuntosDeInteres();
  }
}
</script>

<style scoped>
.puntos-de-interes-list {
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

.direccion {
  font-size: 0.9em;
  color: #666;
  margin: 8px 0;
}

.btn-detalles {
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
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

.categoria {
  color: #666;
  font-size: 0.9em;
  text-transform: capitalize;
  margin: 5px 0;
}

.descripcion {
  font-size: 0.9em;
  color: #333;
  margin: 8px 0;
  line-height: 1.4;
}
</style>
