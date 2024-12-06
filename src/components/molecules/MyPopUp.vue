<!-- MyPopUp.vue (modificado) -->
<template>
    <div v-if="visible" class="popup-overlay">
        <div class="popup-content">
            <div class="popup-header">
                <h2>{{ titulo }}</h2>
                <button class="close-button" @click="cerrar">&times;</button>
            </div>
            <div class="popup-body">
                <slot></slot>
            </div>
            <div class="popup-footer">
                <button class="popup-button" @click="cerrar">Cerrar</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyPopUp',
    props: {
        titulo: {
            type: String,
            default: 'Información'
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        cerrar() {
            this.$emit('cerrar');
        }
    }
}
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 500px;
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
}

.popup-header h2 {
    margin: 0;
    font-size: 1.25rem;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

.popup-body {
    padding: 1rem;
    overflow-y: auto;
}

.popup-footer {
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: center;
}

.popup-button {
    padding: 0.5rem 1.5rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.popup-button:hover {
    background-color: #2980b9;
}
</style>