<template>
  <div class="caracteristicas-list">
    <h1>Características Interiores</h1>
    
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="loading" class="loading">Cargando...</div>
    
    <div v-else class="card-container">
      <div v-for="caracteristica in caracteristicas" :key="caracteristica.id" class="card">
        <div class="icon-container">
          <img 
            :src="caracteristica.icono || '/default-icon.png'" 
            :alt="caracteristica.caracteristica"
            class="icon"
            @error="handleImageError"
          />
        </div>
        <div class="card-content">
          <h3>{{ caracteristica.caracteristica }}</h3>
          <p class="categoria">{{ caracteristica.categoria }}</p>
          <p class="descripcion">{{ caracteristica.descripcion }}</p>
          <button @click="verDetalles(caracteristica.id)" class="btn-detalles">Ver Detalles</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'CaracteristicasInterioresList',
  data() {
    return {
      caracteristicas: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchCaracteristicas() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/crm/caracteristicasInteriores/');
        this.caracteristicas = response.data;
      } catch (error) {
        this.error = 'Error al cargar las características interiores: ' + (error.response?.data?.error || error.message);
      } finally {
        this.loading = false;
      }
    },
    handleImageError(e) {
      e.target.src = '/default-icon.png'; // Manejo de error de imagen
    },
    verDetalles(id) {
      this.$router.push(`/detalles-de-caracteristicas-interiores/${id}`); // Redirige a la página de detalles
    }
  },
  created() {
    this.fetchCaracteristicas();
  }
}
</script>

<style scoped>
.caracteristicas-list {
  padding: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
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

.card-content h3 {
  margin: 0;
  font-size: 1.2em;
}

.card-content .categoria {
  font-weight: bold;
  color: #007bff;
}

.card-content .descripcion {
  color: #555;
}

.btn-detalles {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: auto; /* Empuja el botón hacia abajo */
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