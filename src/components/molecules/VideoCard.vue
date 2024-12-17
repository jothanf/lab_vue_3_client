<template>
  <div class="video-card">
    <video 
      controls 
      class="video"
      :src="videoSrc"
      :alt="titulo"
    ></video>
    <div class="video-info">
      <!-- Se eliminaron el título y la descripción -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoSrc: {
      type: String,
      required: true
    },
    // Se eliminaron las propiedades 'titulo' y 'descripcion'
  }
}
</script>

<style scoped>
.video-card {
  margin: var(--spacing-md);
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.video {
  width: 100%;
  height: auto;
}

.video-info {
  padding: var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.9);
}

/* Se eliminaron los estilos para 'titulo' y 'descripcion' */
</style>
