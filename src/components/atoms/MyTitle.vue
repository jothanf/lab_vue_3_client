<template>
  <h2 class="title" :class="{ 'title-animated': isHovered }" 
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false">
    <slot></slot>
  </h2>
</template>

<script>
export default {
  name: 'MyTitle',
  data() {
    return {
      isHovered: false,
    };
  },
}
</script>

<style scoped>
.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'Engagement', cursive;
  transition: transform 0.3s;
  animation: colorChange 5s infinite;
}

@keyframes colorChange {
  0% { color: var(--color-cobalt-900); }
  50% { color: var(--color-cobalt-700); }
  100% { color: var(--color-black-rock-950); }
}

.title-animated {
  transform: translateY(-5px);
}
</style>
