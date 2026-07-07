<!-- components/products/ProductImage.vue -->
<template>
  <div class="product-image-wrapper">
    <img
        :src="imageSrc"
        :alt="alt"
        loading="lazy"
        @error="handleError"
        class="product-image"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import noImage from '~/assets/images/no-image.png'

const props = defineProps({
  src: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: ''
  }
})

const imageSrc = computed(() => {
  if (props.src) {
    if (props.src.startsWith('http')) {
      return props.src
    }
    return `https://obchod.tanatar.cz/${props.src}`
  }
  return noImage
})

const handleError = (e) => {
  e.target.src = noImage
}
</script>

<style scoped>
.product-image-wrapper {
  width: 100%;
  padding-top: 75%;
  position: relative;
  background: #f8f9fa;
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>