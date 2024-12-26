<template>
  <div class="image-analyzer">
    <div class="upload-area" 
         @dragover.prevent 
         @drop.prevent="handleDrop"
         :class="{ 'is-dragging': isDragging }"
         @dragenter.prevent="isDragging = true"
         @dragleave.prevent="isDragging = false"
    >
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileSelect" 
        accept="image/*" 
        :multiple="allowMultiple"
        class="file-input"
      >
      <div v-if="!previewUrls.length" class="upload-content">
        <i class="fas fa-image"></i>
        <p>{{ allowMultiple ? 'Arrastra imágenes o haz clic para seleccionar varias' : 'Arrastra una imagen o haz clic para seleccionar' }}</p>
      </div>
      <div v-else class="previews-container">
        <div v-for="(url, index) in previewUrls" :key="index" class="preview-item">
          <img :src="url" alt="Preview" class="image-preview">
          <button @click.stop="removeImage(index)" class="remove-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-if="previewUrls.length && !isProcessing" class="action-buttons">
      <template v-if="!allowMultiple">
        <button @click="processImage('ocr')" class="analyze-button">
          <i class="fas fa-search"></i> Extraer Texto
        </button>
        <button @click="processImage('property')" class="analyze-button">
          <i class="fas fa-home"></i> Analizar Propiedad
        </button>
      </template>
      <template v-else>
        <button @click="processMultipleImages" class="analyze-button">
          <i class="fas fa-magic"></i> Analizar Todas las Imágenes
        </button>
      </template>
      <button @click="removeAllImages" class="cancel-button">
        <i class="fas fa-times"></i> Cancelar
      </button>
    </div>
    <div v-if="isProcessing" class="processing-status">
      <i class="fas fa-spinner fa-spin"></i>
      Analizando imágenes...
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'

export default {
  name: 'ImageAnalyzer',
  
  props: {
    modelValue: String,
    allowMultiple: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      isDragging: false,
      isProcessing: false,
      previewUrls: [],
      selectedFiles: []
    }
  },

  methods: {
    handleDrop(e) {
      this.isDragging = false
      const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
      
      if (this.allowMultiple) {
        files.forEach(file => this.addImage(file))
      } else if (files.length > 0) {
        this.addImage(files[0])
      }
    },

    handleFileSelect(e) {
      const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'))
      
      if (this.allowMultiple) {
        files.forEach(file => this.addImage(file))
      } else if (files.length > 0) {
        this.addImage(files[0])
      }
    },

    addImage(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewUrls.push(e.target.result)
        this.selectedFiles.push(file)
      }
      reader.readAsDataURL(file)
    },

    removeImage(index) {
      this.previewUrls.splice(index, 1)
      this.selectedFiles.splice(index, 1)
    },

    removeAllImages() {
      this.previewUrls = []
      this.selectedFiles = []
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },

    async processMultipleImages() {
      if (this.isProcessing || !this.selectedFiles.length) return
      this.isProcessing = true

      try {
        const results = []
        for (const file of this.selectedFiles) {
          const formData = new FormData()
          formData.append('image', file)
          formData.append('analysis_type', 'property')

          const response = await axios.post('/crm/analyze-image/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })

          if (response.data.text) {
            results.push(response.data.text)
          }
        }

        this.$emit('general-analysis-complete', results.join('\n\n'))
      } catch (error) {
        console.error('Error al analizar las imágenes:', error)
      } finally {
        this.isProcessing = false
      }
    },

    async processImage(analysisType) {
      if (this.isProcessing || this.selectedFiles.length === 0) return
      this.isProcessing = true

      try {
        const formData = new FormData()
        formData.append('image', this.selectedFiles[0]) // Procesar solo la primera imagen
        formData.append('analysis_type', analysisType)

        const response = await axios.post('/crm/analyze-image/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.data.text) {
          this.$emit('analysis-complete', response.data.text)
        }
      } catch (error) {
        console.error('Error al analizar la imagen:', error)
      } finally {
        this.isProcessing = false
      }
    }
  }
}
</script>

<style scoped>
.image-analyzer {
  width: 100%;
  margin: 10px 0;
}

.upload-area {
  position: relative;
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #007bff;
}

.upload-area.is-dragging {
  border-color: #28a745;
  background-color: rgba(40, 167, 69, 0.1);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-content {
  color: #666;
}

.upload-content i {
  font-size: 2em;
  margin-bottom: 10px;
}

.previews-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.preview-item {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}

.image-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.remove-button {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
}

.analyze-button, .cancel-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.analyze-button {
  background-color: #007bff;
  color: white;
  margin-right: 5px;
}

.analyze-button:last-of-type {
  background-color: #28a745;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.analyze-button:hover {
  background-color: #0056b3;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.processing-status {
  margin-top: 10px;
  text-align: center;
  color: #666;
}

.processing-status i {
  margin-right: 8px;
}
</style> 