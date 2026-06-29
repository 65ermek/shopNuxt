<template>
  <div class="hero-carousel">
    <div class="carousel-container">
      <div
          class="carousel-slides"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
            v-for="(slide, index) in slides"
            :key="index"
            class="carousel-slide"
        >
          <div class="slide-image" :style="{ backgroundImage: `url(${slide.image})` }">
            <div class="slide-overlay"></div>
          </div>
          <div class="slide-content">
            <span class="slide-subtitle">{{ slide.subtitle }}</span>
            <h3 class="slide-title">{{ slide.title }}</h3>
            <NuxtLink :to="slide.link" class="slide-btn">{{ slide.buttonText }}</NuxtLink>
          </div>
        </div>
      </div>

      <button class="carousel-prev" @click="prevSlide" aria-label="Předchozí">
        <span class="arrow-icon">‹</span>
      </button>
      <button class="carousel-next" @click="nextSlide" aria-label="Další">
        <span class="arrow-icon">›</span>
      </button>

      <div class="carousel-dots">
        <button
            v-for="(slide, index) in slides"
            :key="index"
            class="dot"
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const currentIndex = ref(0)
let interval = null

// Используем прямые пути к изображениям в public/assets/images/
const slides = ref([
  {
    image: '/assets/images/gastro.png',
    subtitle: 'Až 20% sleva na první nákup',
    title: 'Kvalitní produkty za skvělé ceny',
    buttonText: 'Nakupovat nyní',
    link: '/catalog'
  },
  {
    image: '/assets/images/rollup.png',
    subtitle: 'Doprava zdarma od 1500 Kč',
    title: 'Široký výběr zboží skladem',
    buttonText: 'Zobrazit akce',
    link: '/catalog?filter=sale'
  },
  {
    image: '/assets/images/cards.png',
    subtitle: 'Pro firmy i jednotlivce',
    title: 'Množstevní slevy již od 5 ks',
    buttonText: 'Více informací',
    link: '/dodavatel'
  }
])

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
  resetInterval()
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
  resetInterval()
}

const goToSlide = (index) => {
  currentIndex.value = index
  resetInterval()
}

const resetInterval = () => {
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => {
    nextSlide()
  }, 5000)
}

onMounted(() => {
  resetInterval()
})

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
.hero-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: #f5f5f5;
}

.carousel-container {
  position: relative;
  overflow: hidden;
}

.carousel-slides {
  display: flex;
  transition: transform 0.6s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  position: relative;
  height: 320px;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%);
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
  padding: 20px 30px;
  width: 90%;
  max-width: 600px;
}

.slide-subtitle {
  display: inline-block;
  background-color: rgba(225, 29, 72, 0.85);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.slide-title {
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  line-height: 1.3;
}

.slide-btn {
  display: inline-block;
  padding: 10px 28px;
  background-color: #e11d48;
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
}

.slide-btn:hover {
  background-color: #be123c;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(225, 29, 72, 0.4);
}

.carousel-prev,
.carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 20;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.carousel-prev:hover,
.carousel-next:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.carousel-prev {
  left: 12px;
}

.carousel-next {
  right: 12px;
}

.arrow-icon {
  line-height: 1;
  font-weight: 300;
}

.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 20;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.dot.active {
  background-color: #e11d48;
  width: 24px;
  border-radius: 10px;
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 992px) {
  .carousel-slide {
    height: 280px;
  }

  .slide-title {
    font-size: 1.3rem;
  }

  .slide-subtitle {
    font-size: 0.65rem;
  }
}

@media (max-width: 576px) {
  .carousel-slide {
    height: 220px;
  }

  .slide-content {
    padding: 12px 16px;
  }

  .slide-title {
    font-size: 1rem;
  }

  .slide-subtitle {
    font-size: 0.55rem;
    padding: 2px 10px;
  }

  .slide-btn {
    padding: 6px 16px;
    font-size: 0.7rem;
  }

  .carousel-prev,
  .carousel-next {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .carousel-prev {
    left: 6px;
  }

  .carousel-next {
    right: 6px;
  }

  .dot {
    width: 8px;
    height: 8px;
  }

  .dot.active {
    width: 16px;
  }
}
</style>