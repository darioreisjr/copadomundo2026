<template>
  <v-app>
    <div class="not-found-wrapper">
      <div class="stars">
        <span v-for="n in 60" :key="n" class="star" :style="starStyle(n)" />
      </div>

      <div class="content">
        <div class="ball-container">
          <v-icon class="ball-icon" size="80" color="#f5c542">mdi-soccer</v-icon>
        </div>

        <h1 class="error-code">404</h1>

        <h2 class="title">Página não encontrada</h2>

        <p class="subtitle">
          A bola saiu pela linha de fundo...<br />
          Essa página não existe mais ou foi movida.
        </p>

        <v-btn
          color="green-darken-3"
          size="large"
          rounded="pill"
          class="mt-6 home-btn"
          :to="homeRoute"
        >
          <v-icon start>mdi-home</v-icon>
          {{ auth.user ? 'Ir para o Dashboard' : 'Voltar ao Início' }}
        </v-btn>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const homeRoute = auth.user ? '/dashboard' : '/'

function starStyle(n) {
  const size = Math.random() * 3 + 1
  return {
    width: size + 'px',
    height: size + 'px',
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    animationDelay: (Math.random() * 3).toFixed(2) + 's',
    animationDuration: (Math.random() * 2 + 2).toFixed(2) + 's',
  }
}
</script>

<style scoped>
.not-found-wrapper {
  position: relative;
  min-height: 100vh;
  background: #1b5e20;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Stars */
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: #f5c542;
  opacity: 0.6;
  animation: twinkle ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50%       { opacity: 0.9;  transform: scale(1.6); }
}

/* Content */
.content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  padding: 2rem;
}

/* Ball */
.ball-container {
  margin-bottom: 1rem;
}

.ball-icon {
  animation: spin 3s linear infinite, bounce 1.2s ease-in-out infinite alternate;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  from { transform: rotate(0deg) translateY(0); }
  to   { transform: rotate(180deg) translateY(-18px); }
}

/* 404 */
.error-code {
  font-size: clamp(6rem, 20vw, 12rem);
  font-weight: 900;
  line-height: 1;
  color: #f5c542;
  text-shadow:
    0 0 20px rgba(245, 197, 66, 0.8),
    0 0 60px rgba(245, 197, 66, 0.4);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 20px rgba(245,197,66,0.8), 0 0 60px rgba(245,197,66,0.4); }
  50%       { text-shadow: 0 0 40px rgba(245,197,66,1),   0 0 100px rgba(245,197,66,0.7); }
}

/* Text */
.title {
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 700;
  margin-top: 0.5rem;
  animation: slide-up 0.8s ease both;
}

.subtitle {
  font-size: clamp(0.95rem, 2.5vw, 1.15rem);
  opacity: 0.85;
  margin-top: 0.75rem;
  line-height: 1.7;
  animation: slide-up 0.9s 0.15s ease both;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Button */
.home-btn {
  animation: slide-up 1s 0.3s ease both;
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
