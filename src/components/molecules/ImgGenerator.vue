<template>
  <div>
    <h1>ImgGenerator</h1>
    <form @submit.prevent="generateIcon">
      <input v-model="prompt" placeholder="Ingresa tu prompt" required />
      <input v-model="selectedPalette" placeholder="Selecciona una paleta de colores" />
      <button type="submit" :disabled="isGenerating">Generar Icono</button>
    </form>
    <div v-if="isGenerating">Generando...</div>
    <div v-if="generatedIcon">
      <img :src="generatedIcon" alt="Icono generado" style="width: 100px; height: 100px;" />
    </div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ImgGenerator',
  data() {
    return {
      prompt: '',
      selectedPalette: '',
      generatedIcon: null,
      isGenerating: false,
      error: null
    }
  },
  methods: {
    buildIconPrompt() {
      let fullPrompt = "Crea un icono minimalista y simple. El icono debe ser claro y legible incluso en tamaños pequeños. ";
      
      if (this.selectedPalette) {
        fullPrompt += `Usa solo esta paleta de colores: ${this.selectedPalette}. `;
      }
      
      fullPrompt += this.prompt;
      
      return fullPrompt;
    },

    async generateIcon() {
      this.isGenerating = true;
      this.error = null;
      
      const requestData = {
        dimensions: 1024,
        style: 'icon',
        prompt: this.buildIconPrompt(),
        colors: this.selectedPalette,
        quality: 'standard'
      };

      try {
        const response = await axios.post('/crm/generate-image/', requestData);

        if (response.data.success) {
          this.$emit('iconGenerated', {
            url: response.data.image_url,
            base64: response.data.image_base64
          });
        } else {
          this.error = response.data.error;
        }
      } catch (error) {
        this.error = 'Error al generar el icono.';
        console.error('Error:', error);
      } finally {
        this.isGenerating = false;
      }
    },
    // ... resto del código ...
  }
}
</script>
