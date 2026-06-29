<template>
  <button
      v-show="showButton"
      class="scroll-top-btn"
      @click="scrollToTop"
      aria-label="Наверх"
  >
    <img
        src="/assets/icons/up-arrow.png"
        alt="Наверх"
        width="24"
        height="24"
    />
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showButton = ref(false)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  showButton.value = window.scrollY > 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  border-radius: 10%;
  background-color: #7edffd;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  padding: 0;
}

.scroll-top-btn img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
  object-fit: contain;
}

.scroll-top-btn:hover {
  background-color: #1db3e1;
  opacity: 1;
  transform: scale(1.05);
}

.scroll-top-btn:active {
  transform: scale(0.95);
}
</style>