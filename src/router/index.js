import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/',          name: 'Home',     component: () => import('@/pages/HomePage.vue'),     meta: { public: true, title: 'Início' } },
  { path: '/login',     name: 'Login',    component: () => import('@/pages/LoginPage.vue'),    meta: { public: true, title: 'Login' } },
  { path: '/register',        name: 'Register',       component: () => import('@/pages/RegisterPage.vue'),       meta: { public: true, title: 'Cadastro' } },
  { path: '/como-usar',       name: 'HowTo',          component: () => import('@/pages/HowToPage.vue'),          meta: { public: true, title: 'Como Usar' } },
  { path: '/termos',          name: 'Terms',          component: () => import('@/pages/TermsPage.vue'),          meta: { public: true, title: 'Termos de Uso' } },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('@/pages/ForgotPasswordPage.vue'), meta: { public: true, title: 'Recuperar Senha' } },
  { path: '/reset-password',  name: 'ResetPassword',  component: () => import('@/pages/ResetPasswordPage.vue'),  meta: { public: true, title: 'Redefinir Senha' } },
  { path: '/conta-criada',          name: 'AccountCreated',      component: () => import('@/pages/AccountCreatedPage.vue'),      meta: { public: true, title: 'Conta Criada' } },
  { path: '/aguardando-confirmacao', name: 'PendingConfirmation', component: () => import('@/pages/PendingConfirmationPage.vue'), meta: { public: true, title: 'Aguardando Confirmação' } },
  { path: '/dashboard', name: 'Dashboard',component: () => import('@/pages/DashboardPage.vue'), meta: { title: 'Dashboard' } },
  { path: '/games',     name: 'Games',    component: () => import('@/pages/GamesPage.vue'),     meta: { title: 'Jogos' } },
  { path: '/games/:id/bet', name: 'Bet', component: () => import('@/pages/BetPage.vue'),        meta: { title: 'Fazer Palpite' } },
  { path: '/ranking',   name: 'Ranking',  component: () => import('@/pages/RankingPage.vue'),   meta: { title: 'Ranking' } },
  { path: '/grupos',          name: 'MeusGrupos',  component: () => import('@/pages/MeusGruposPage.vue'),   meta: { title: 'Grupos' } },
  { path: '/grupos/:id',      name: 'GrupoDetail', component: () => import('@/pages/GrupoDetailPage.vue'),  meta: { title: 'Grupo' } },
  { path: '/meus-grupos',     name: 'CriarGrupo',  component: () => import('@/pages/CriarGrupoPage.vue'),   meta: { title: 'Meus Grupos' } },
  { path: '/minha-conta', name: 'Account', component: () => import('@/pages/AccountPage.vue'), meta: { title: 'Minha Conta' } },
  { path: '/admin',          name: 'Admin',        component: () => import('@/pages/AdminPage.vue'),        meta: { adminOnly: true, title: 'Administração' } },
  { path: '/admin/avatares', name: 'AdminAvatars', component: () => import('@/pages/AdminAvatarsPage.vue'), meta: { adminOnly: true, title: 'Admin — Avatares' } },
  { path: '/admin/selos',   name: 'AdminSeals',   component: () => import('@/pages/AdminSealsPage.vue'),   meta: { adminOnly: true, title: 'Admin — Selos' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue'), meta: { public: true, title: 'Página não encontrada' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  const pageTitle = to.meta.title
  document.title = pageTitle ? `Bolão Copa 26 | ${pageTitle}` : 'Bolão Copa 26'
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) await auth.init()

  if (!to.meta.public && !auth.user && auth.intentionalLogout) return { name: 'Login' }
  if (!to.meta.public && !auth.user && !auth.intentionalLogout) return
  if (to.meta.adminOnly && auth.profile?.role !== 'admin') return { name: 'Dashboard' }
  if ((to.name === 'Login' || to.name === 'Register') && auth.user) return { name: 'Dashboard' }
})

export default router
