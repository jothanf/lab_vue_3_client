<template>
    <div class="prospectar-container">
        <h2>Prospectar Propiedad</h2>
        <div class="input-group">
            <textarea 
                v-model="textoTranscrito" 
                placeholder="Ingrese el texto aquí"
                class="transcription-input"
            ></textarea>
            <button class="button-secondary" @click="limpiarTextoTranscrito">Limpiar</button>
            <button class="button-primary">
                <AudioTranscriber
                    v-model="textoTranscrito"
                    @transcription-complete="onTranscriptionComplete"
                />
            </button>
        </div>
        <div v-for="(analizador, index) in analizadores" :key="index">
            <div class="input-group">
                <textarea 
                    v-model="analizador.textoImagen" 
                    placeholder="Información extraída de la imagen"
                    class="image-text-input"
                ></textarea>
                <button class="button-secondary" @click="limpiarTextoImagen(index)">Limpiar</button>
            </div>
            <div class="button-group">
                <ImageAnalyzer
                    v-model="analizador.textoImagen"
                    @analysis-complete="(texto) => onImageAnalysisComplete(texto, index)"
                    @image-added="(url) => addImage(url, index)"
                />
            </div>
        </div>
        <div class="multiple-analysis-section">
            <h3>Análisis Múltiple de Imágenes</h3>
            <div class="input-group">
                <textarea 
                    v-model="analisisMultiple.descripcionGeneral" 
                    placeholder="Descripción general de las imágenes"
                    class="image-text-input"
                    :readonly="true"
                ></textarea>
            </div>
            <div class="button-group">
                <ImageAnalyzer
                    ref="multipleAnalyzer"
                    :allowMultiple="true"
                    @analysis-complete="onMultipleAnalysisComplete"
                    @general-analysis-complete="onGeneralAnalysisComplete"
                />
            </div>
        </div>
        <div class="button-group">
            <button @click="agregarNuevoAnalisis" class="button-primary">
                <i class="fas fa-plus"></i> Agregar Nuevo Análisis Individual
            </button>
            <button @click="limpiarTexto" class="button-secondary">Limpiar Todo</button>
        </div>
        <div class="uploaded-images">
            <h3>Imágenes Cargadas</h3>
            <div v-for="(image, index) in imageAnalysis" :key="index" class="image-analysis-container">
                <div class="image-preview">
                    <img :src="image.url" alt="Imagen cargada" />
                    <button @click="removeImage(index)">Eliminar</button>
                </div>
                <textarea 
                    v-model="image.analysis" 
                    placeholder="Información extraída de la imagen"
                    class="image-text-input"
                ></textarea>
            </div>
        </div>
    </div>
</template>

<script>
import AudioTranscriber from '@/components/molecules/AudioTranscriber.vue'
import ImageAnalyzer from '@/components/molecules/ImageAnalyzer.vue'

export default {
    name: 'ProspectarPropiedad',
    components: {
        AudioTranscriber,
        ImageAnalyzer
    },
    
    data() {
        return {
            textoTranscrito: '',
            analizadores: [{
                textoImagen: '',
                imageUrl: null
            }],
            analisisMultiple: {
                descripcionGeneral: '',
                imagenes: []
            }
        }
    },

    methods: {
        onTranscriptionComplete(texto) {
            this.textoTranscrito = texto
        },
        onImageAnalysisComplete(texto, index) {
            this.analizadores[index].textoImagen = texto
        },
        limpiarTexto() {
            this.textoTranscrito = ''
        },
        limpiarTextoTranscrito() {
            this.textoTranscrito = ''
        },
        limpiarTextoImagen(index) {
            this.analizadores[index].textoImagen = ''
        },
        addImage(imageUrl, index) {
            this.analizadores[index].imageUrl = imageUrl
        },
        removeImage(index) {
            this.imageAnalysis.splice(index, 1)
        },
        agregarNuevoAnalisis() {
            this.analizadores.push({
                textoImagen: '',
                imageUrl: null
            })
        },
        onMultipleAnalysisComplete({ text, type }) {
            this.analisisMultiple.imagenes.push({
                analisis: text,
                tipo: type
            })
        },
        onGeneralAnalysisComplete(descripcionGeneral) {
            this.analisisMultiple.descripcionGeneral = descripcionGeneral
        },
        limpiarAnalisisMultiple() {
            this.analisisMultiple = {
                descripcionGeneral: '',
                imagenes: []
            }
        }
    }
}
</script>

<style scoped>
.prospectar-container {
    padding: 20px;
}

.input-group {
    margin: 20px 0;
}

.transcription-input {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
}

.button-secondary {
    background-color: #f0f0f0; /* Color de fondo */
    color: #333; /* Color del texto */
    border: 1px solid #ccc; /* Borde */
    border-radius: 4px; /* Esquinas redondeadas */
    padding: 10px 15px; /* Espaciado interno */
    cursor: pointer; /* Cambia el cursor al pasar el mouse */
}

.button-secondary:hover {
    background-color: #e0e0e0; /* Color de fondo al pasar el mouse */
}

.button-group {
    display: flex;
    gap: 10px;
    align-items: center;
}

.image-text-input {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    margin-bottom: 10px;
}

.uploaded-images {
    margin-top: 20px;
}

.image-analysis-container {
    margin-bottom: 20px;
    border: 1px solid #eee;
    padding: 15px;
    border-radius: 4px;
}

.image-preview {
    margin-bottom: 10px;
}

.image-preview img {
    max-width: 100px;
    margin-right: 10px;
}

.button-primary {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
}

.button-primary:hover {
    background-color: #0056b3;
}

.multiple-analysis-section {
    margin-top: 30px;
    padding: 20px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.multiple-analysis-section h3 {
    margin-bottom: 15px;
    color: #333;
    font-size: 1.2em;
}

.multiple-analysis-section .image-text-input {
    min-height: 150px;
}
</style>