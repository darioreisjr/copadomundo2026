import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/',          name: 'Home',     component: () => import('@/pages/HomePage.vue'),     meta: { public: true } },
  { path: '/login',     name: 'Login',    component: () => import('@/pages/LoginPage.vue'),    meta: { public: true } },
  { path: '/register',        name: 'Register',       component: () => import('@/pages/RegisterPage.vue'),       meta: { public: true } },
  { path: '/como-usar',       name: 'HowTo',          component: () => import('@/pages/HowToPage.vue'),          meta: { public: true } },
  { path: '/termos',          name: 'Terms',          component: () => import('@/pages/TermsPage.vue'),          meta: { public: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('@/pages/ForgotPasswordPage.vue'), meta: { public: true } },
  { path: '/reset-password',  name: 'ResetPassword',  component: () => import('@/pages/ResetPasswordPage.vue'),  meta: { public: true } },
  { path: '/conta-criada',    name: 'AccountCreated', component: () => import('@/pages/AccountCreatedPage.vue'), meta: { public: true } },
  { path: '/dashboard', name: 'Dashboard',component: () => import('@/pages/DashboardPage.vue') },
  { path: '/games',     name: 'Games',    component: () => import('@/pages/GamesPage.vue') },
  { path: '/games/:id/bet', name: 'Bet', component: () => import('@/pages/BetPage.vue') },
  { path: '/ranking',   name: 'Ranking',  component: () => import('@/pages/RankingPage.vue') },
  { path: '/admin',     name: 'Admin',    component: () => import('@/pages/AdminPage.vue'),    meta: { adminOnly: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) await auth.init()

  if (!to.meta.public && !auth.user) return { name: 'Login' }
  if (to.meta.adminOnly && auth.profile?.role !== 'admin') return { name: 'Dashboard' }
  if ((to.name === 'Login' || to.name === 'Register') && auth.user) return { name: 'Dashboard' }
})

export default router
