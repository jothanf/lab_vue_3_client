<template>
    <div class="propiedades-list">
        <div class="search-section">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar por título, tipo o código..." 
                class="search-input"
            />
        </div>

        <div v-if="filtradas.length > 0" class="propiedades-grid">
            <div v-for="propiedad in paginadas" 
                 :key="propiedad.id" 
                 class="propiedad-card">
                <div class="propiedad-imagenes" v-if="propiedad.multimedia && propiedad.multimedia.length > 0">
                    <div class="imagenes-grid">
                        <img v-for="imagen in propiedad.multimedia.slice(0, 3)" 
                             :key="imagen.id"
                             :src="getFullImageUrl(imagen.archivo_url)"
                             :alt="imagen.titulo || 'Imagen de propiedad'"
                             class="propiedad-imagen"
                        />
                    </div>
                </div>
                <div v-else class="no-imagen">
                    <i class="fas fa-home"></i>
                    <span>Sin imágenes disponibles</span>
                </div>

                <div class="propiedad-header">
                    <h3>{{ propiedad.titulo }}</h3>
                    <span class="codigo">Código: {{ propiedad.codigo || 'N/A' }}</span>
                </div>
                
                <div class="propiedad-info">
                    <div class="info-section">
                        <h4>Detalles Básicos</h4>
                        <p><i class="fas fa-home"></i> {{ propiedad.tipo_propiedad }}</p>
                        <p><i class="fas fa-ruler-combined"></i> {{ propiedad.metro_cuadrado_construido }}m² construidos</p>
                        <p><i class="fas fa-bed"></i> {{ propiedad.habitaciones }} habitaciones</p>
                        <p><i class="fas fa-bath"></i> {{ propiedad.banos }} baños</p>
                    </div>

                    <div class="info-section">
                        <h4>Características</h4>
                        <p><i class="fas fa-car"></i> {{ getGarajes(propiedad) }}</p>
                        <p><i class="fas fa-warehouse"></i> {{ getDepositos(propiedad) }}</p>
                        <p><i class="fas fa-building"></i> Estrato {{ propiedad.estrato }}</p>
                        <p><i class="fas fa-paw"></i> Mascotas: {{ propiedad.mascotas === 'si' ? 'Permitidas' : 'No permitidas' }}</p>
                    </div>

                    <div class="info-section">
                        <h4>Valores</h4>
                        <p><i class="fas fa-money-bill"></i> Administración: ${{ formatNumber(propiedad.valor_administracion) }}</p>
                        <p><i class="fas fa-file-invoice-dollar"></i> Predial: ${{ formatNumber(propiedad.valor_predial) }}</p>
                    </div>
                </div>

                <div class="propiedad-footer">
                    <button @click="verDetalles(propiedad.id)" class="btn-detalles">
                        Ver Detalles Completos
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="no-results">No se encontraron propiedades que coincidan con tu búsqueda.</p>

        <div class="pagination" v-if="filtradas.length > limite">
            <button 
                @click="cargarMas" 
                v-if="pagina < totalPaginas"
                class="btn-cargar-mas"
            >
                Cargar más propiedades
            </button>
        </div>
    </div>
</template>

<style scoped>
.propiedades-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.propiedad-card {
    background-color: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--spacing-md);
    transition: transform 0.2s;
}

.propiedad-card:hover {
    transform: scale(1.05);
}

.propiedad-imagenes {
    width: 100%;
    margin-bottom: var(--spacing-md);
}

.imagenes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    height: 150px;
}

.propiedad-imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
}

.no-imagen {
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--color-mine-shaft-100);
    border-radius: var(--border-radius-sm);
    color: var(--color-loblolly-800);
    margin-bottom: var(--spacing-md);
}

.no-imagen i {
    font-size: 2rem;
    margin-bottom: var(--spacing-sm);
}

.propiedad-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.info-section {
    background-color: var(--color-white-sand-50);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-sm);
    box-shadow: var(--shadow-sm);
}

.info-section h4 {
    margin-bottom: var(--spacing-xs);
    color: var(--color-primary);
}

.propiedad-footer {
    margin-top: var(--spacing-md);
    text-align: center;
}

.btn-detalles {
    background-color: var(--color-primary);
    color: var(--color-white);
    padding: var(--spacing-sm);
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-detalles:hover {
    background-color: var(--color-primary-light);
}
</style>

<script>
import axios from '@/utils/axios';

export default {
    data() {
        return {
            propiedades: [],
            errorMessage: null,
            searchQuery: '',
            pagina: 1,
            limite: 10, // Número de propiedades por página
        };
    },
    computed: {
        filtradas() {
            return this.propiedades.filter(propiedad => 
                propiedad.titulo.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        totalPaginas() {
            return Math.ceil(this.filtradas.length / this.limite);
        },
        paginadas() {
            const inicio = (this.pagina - 1) * this.limite;
            return this.filtradas.slice(inicio, inicio + this.limite);
        }
    },
    created() {
        this.obtenerPropiedades();
    },
    methods: {
        async obtenerPropiedades() {
            try {
                const response = await axios.get('/crm/propiedades/');
                this.propiedades = response.data;
            } catch (error) {
                console.error('Error al obtener las propiedades:', error);
                this.errorMessage = 'Error al cargar las propiedades. Intente nuevamente.';
            }
        },
        cargarMas() {
            this.pagina++;
        },
        verDetalles(id) {
            this.$router.push(`/detalles-de-propiedad/${id}`);
        },
        getFullImageUrl(url) {
            if (url && !url.startsWith('http')) {
                return `http://localhost:8000${url}`;
            }
            return url;
        },
        getGarajes(propiedad) {
            if (!propiedad.garajes) return 'Sin garajes';
            const cantidad = propiedad.garajes.cantidad || 0;
            return `${cantidad} ${cantidad === 1 ? 'garaje' : 'garajes'}`;
        },
        getDepositos(propiedad) {
            if (!propiedad.depositos) return 'Sin depósitos';
            const cantidad = propiedad.depositos.cantidad || 0;
            return `${cantidad} ${cantidad === 1 ? 'depósito' : 'depósitos'}`;
        },
        formatNumber(number) {
            if (!number) return '0';
            return number.toLocaleString('es-CO');
        }
    }
}
</script>
