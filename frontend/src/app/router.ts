import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useHeroStore } from '../stores/hero'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/map' },
  { path: '/create', name: 'create', component: () => import('../views/CreateHero.vue'), meta: { bare: true } },
  { path: '/auth', name: 'auth', component: () => import('../views/Auth.vue'), meta: { bare: true } },
  { path: '/map', name: 'map', component: () => import('../views/WorldMap.vue') },
  { path: '/location/:id', name: 'location', component: () => import('../views/Location.vue'), props: true },
  { path: '/location/:id/quest/:lessonId', name: 'quest', component: () => import('../views/Quest.vue'), props: true },
  { path: '/location/:id/scroll', name: 'reflection', component: () => import('../views/Reflection.vue'), props: true },
  { path: '/location/:id/boss', name: 'boss', component: () => import('../views/Boss.vue'), props: true },
  { path: '/hero', name: 'hero', component: () => import('../views/Hero.vue') },
  { path: '/treasury', name: 'treasury', component: () => import('../views/Treasury.vue') },
  { path: '/codex', name: 'codex', component: () => import('../views/Codex.vue') },
  { path: '/practice', redirect: '/practice/situations' },
  { path: '/practice/:kind(situations|cases)', name: 'practice', component: () => import('../views/Practice.vue'), props: true, meta: { viewKey: 'practice' } },
  { path: '/practice/:kind(situations|cases)/:lessonId', name: 'practice-case', component: () => import('../views/PracticeCase.vue'), props: true },
  { path: '/journal', name: 'journal', component: () => import('../views/Journal.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/map' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const hero = useHeroStore()
  // Створювати героя має сенс лише з акаунтом; без нього — режим перегляду
  if (to.name === 'create' && !useAuthStore().user) return { name: 'map' }
  if (!hero.created && to.name !== 'create' && to.name !== 'auth') return { name: 'create' }
  if (hero.created && to.name === 'create') return { name: 'map' }
  const id = Number(to.params.id)
  if (id && !hero.isUnlocked(id)) return { name: 'map' }
})

export default router
