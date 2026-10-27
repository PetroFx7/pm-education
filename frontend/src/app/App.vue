<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { mdiMapLegend, mdiAccountStar, mdiTreasureChest, mdiBookOpenVariant, mdiNotebook, mdiGold, mdiFire, mdiAccountGroup, mdiBriefcaseOutline, mdiLogin, mdiLogout, mdiAccountCircle } from '@mdi/js'
import { mdiCloudCheckOutline, mdiCloudSyncOutline, mdiCloudAlertOutline, mdiEyeOutline } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import HeroAvatar from '../components/HeroAvatar.vue'
import ToastStack from '../components/ToastStack.vue'
import LevelUpModal from '../components/LevelUpModal.vue'
import { useHeroPersistence } from '../composables/useHeroPersistence'
import { practice, type PracticeKind } from '../services/course'
import { useUiStore } from '../stores/ui'
import { useAuthStore } from '../stores/auth'
import { useSyncStore } from '../stores/sync'

const hero = useHeroPersistence()

const auth = useAuthStore()
const sync = useSyncStore()
// Поки перевіряємо сесію й тягнемо прогрес — заставка, щоб не блимав режим перегляду
const booted = ref(false)
auth
  .restore()
  .then(() => sync.load())
  .finally(() => (booted.value = true))

const SYNC_ICON = { idle: mdiCloudCheckOutline, synced: mdiCloudCheckOutline, syncing: mdiCloudSyncOutline, error: mdiCloudAlertOutline }
const SYNC_LABEL = { idle: 'Збережено в хмарі', synced: 'Збережено в хмарі', syncing: 'Синхронізація…', error: 'Не вдалося синхронізувати — повторимо пізніше' }

const route = useRoute()
const bare = computed(() => route.meta.bare)

const nav = computed(() => [
  { to: '/map', label: 'Мапа', icon: mdiMapLegend },
  { to: '/hero', label: 'Герой', icon: mdiAccountStar },
  { to: '/treasury', label: 'Скарбниця', icon: mdiTreasureChest, badge: hero.readyChests.length },
  { to: '/journal', label: 'Журнал', icon: mdiNotebook },
  { to: '/codex', label: 'Кодекс', icon: mdiBookOpenVariant },
])

// Вкладки практики: сайдбар підсвічує ту, що обрана на сторінці, і пам'ятає її
const ui = useUiStore()
watch(
  () => route.params.kind,
  (kind) => {
    if (kind === 'situations' || kind === 'cases') ui.practiceKind = kind
  },
  { immediate: true },
)
const inPractice = computed(() => route.path.startsWith('/practice'))

const PRACTICE_TABS: { kind: PracticeKind; label: string; icon: string }[] = [
  { kind: 'situations', label: 'Робочі ситуації', icon: mdiAccountGroup },
  { kind: 'cases', label: 'Кейси з модулів', icon: mdiBriefcaseOutline },
]
const practiceNav = computed(() =>
  PRACTICE_TABS.map((t) => ({
    ...t,
    to: `/practice/${t.kind}`,
    total: practice[t.kind].length,
    done: practice[t.kind].filter((l) => hero.lessons[l.id]).length,
    on: inPractice.value && ui.practiceKind === t.kind,
  })),
)
const practiceIndex = computed(() => PRACTICE_TABS.findIndex((t) => t.kind === ui.practiceKind))
const practiceCurrent = computed(() => PRACTICE_TABS[practiceIndex.value])
</script>

<template>
  <ToastStack />
  <LevelUpModal />

  <div v-if="!booted" class="boot" role="status">
    <span class="sigil">✦</span>
    <span class="muted">Завантаження…</span>
  </div>

  <RouterView v-else-if="bare" />

  <div v-else class="shell">
    <aside class="side">
      <RouterLink to="/map" class="brand">
        <span class="sigil">✦</span>
        <span>PM&nbsp;Quest</span>
      </RouterLink>

      <RouterLink to="/hero" class="hero-card">
        <HeroAvatar :avatar="hero.avatar" :level="hero.level" :size="52" />
        <div class="hero-meta">
          <div class="name">{{ hero.name }}</div>
          <div class="cls">{{ hero.classInfo.name }} · {{ hero.title }}</div>
        </div>
      </RouterLink>

      <div class="xp">
        <div class="xp-row">
          <span>Рівень {{ hero.level }}</span>
          <span>{{ hero.levelProgress.current }} / {{ hero.levelProgress.needed }} XP</span>
        </div>
        <div class="bar"><span :style="{ width: hero.levelProgress.pct + '%' }" /></div>
      </div>

      <div class="stats">
        <span class="chip gold"><MdiIcon :path="mdiGold" :size="16" /> {{ hero.gold }}</span>
        <span class="chip" :class="{ hot: hero.streak > 0 }" title="Днів поспіль">
          <MdiIcon :path="mdiFire" :size="16" /> {{ hero.streak }}
        </span>
      </div>

      <nav class="nav">
        <RouterLink v-for="n in nav" :key="n.to" :to="n.to" class="nav-link">
          <MdiIcon :path="n.icon" :size="22" />
          <span>{{ n.label }}</span>
          <b v-if="n.badge" class="badge">{{ n.badge }}</b>
        </RouterLink>
      </nav>

      <nav class="nav practice" aria-labelledby="practice-title">
        <div id="practice-title" class="nav-title">Практика</div>
        <div class="practice-links" :class="{ on: inPractice }" :style="{ '--i': practiceIndex }">
          <span class="practice-slider" aria-hidden="true" />
          <RouterLink
            v-for="n in practiceNav"
            :key="n.to"
            :to="n.to"
            class="nav-link"
            :class="{ on: n.on }"
            active-class=""
            exact-active-class=""
            :aria-current="n.on ? 'page' : undefined"
          >
            <MdiIcon :path="n.icon" :size="22" />
            <span>{{ n.label }}</span>
            <small class="count">{{ n.done }}/{{ n.total }}</small>
          </RouterLink>
        </div>
        <!-- на мобільному: одна кнопка, що веде до останньої обраної вкладки -->
        <RouterLink :to="`/practice/${practiceCurrent.kind}`" class="nav-link mobile-practice" :class="{ on: inPractice }" active-class="" exact-active-class="">
          <MdiIcon :path="practiceCurrent.icon" :size="22" />
          <span>Практика</span>
        </RouterLink>
      </nav>

      <div v-if="auth.ready" class="account">
        <template v-if="auth.user">
          <MdiIcon :path="mdiAccountCircle" :size="22" />
          <span class="email" :title="auth.user.email">{{ auth.user.email }}</span>
          <span class="sync" :class="sync.status" :title="SYNC_LABEL[sync.status]" role="status" :aria-label="SYNC_LABEL[sync.status]">
            <MdiIcon :path="SYNC_ICON[sync.status]" :size="18" />
          </span>
          <button type="button" class="icon-btn" title="Вийти" aria-label="Вийти" @click="auth.signOut()">
            <MdiIcon :path="mdiLogout" :size="20" />
          </button>
        </template>
        <RouterLink v-else to="/auth" class="nav-link">
          <MdiIcon :path="mdiLogin" :size="22" />
          <span>Увійти</span>
        </RouterLink>
      </div>
    </aside>

    <header class="topbar">
      <RouterLink to="/hero" class="mini-hero">
        <HeroAvatar :avatar="hero.avatar" :level="hero.level" :size="36" />
        <div class="mini-xp">
          <div class="bar"><span :style="{ width: hero.levelProgress.pct + '%' }" /></div>
        </div>
      </RouterLink>
      <span class="chip gold"><MdiIcon :path="mdiGold" :size="16" /> {{ hero.gold }}</span>
      <span class="chip" :class="{ hot: hero.streak > 0 }"><MdiIcon :path="mdiFire" :size="16" /> {{ hero.streak }}</span>
      <template v-if="auth.ready">
        <button v-if="auth.user" type="button" class="icon-btn" :title="`Вийти (${auth.user.email})`" aria-label="Вийти" @click="auth.signOut()">
          <MdiIcon :path="mdiLogout" :size="20" />
        </button>
        <RouterLink v-else to="/auth" class="icon-btn" title="Увійти" aria-label="Увійти">
          <MdiIcon :path="mdiLogin" :size="20" />
        </RouterLink>
      </template>
    </header>

    <main class="main">
      <div v-if="!auth.user" class="preview-banner">
        <MdiIcon :path="mdiEyeOutline" :size="20" />
        <span><b>Режим перегляду.</b> Усе відкрито, але прогрес не зберігається.</span>
        <RouterLink to="/auth" class="btn small primary">Увійти</RouterLink>
      </div>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="($route.meta.viewKey as string) ?? $route.fullPath" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.shell { display: grid; grid-template-columns: 272px 1fr; min-height: 100vh; }

.side {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 18px;
  border-right: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(44, 27, 47, 0.6), rgba(0, 3, 14, 0.6));
  backdrop-filter: blur(8px);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 0.04em;
  color: var(--mist);
  text-decoration: none;
}
.sigil { color: var(--rose); font-size: 22px; text-shadow: 0 0 14px var(--rose); }

.hero-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: rgba(0, 3, 14, 0.35);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s;
}
.hero-card:hover { border-color: var(--rose); }
.hero-meta { min-width: 0; }
.name { font-weight: 800; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cls { font-size: 12px; color: var(--text-dim); line-height: 1.35; }

.xp-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-dim); margin-bottom: 6px; font-weight: 600; }

.stats { display: flex; gap: 8px; }
.chip.gold { color: var(--gold); }
.chip.hot { color: #f3a6a6; border-color: rgba(243, 166, 166, 0.4); }

.nav { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  color: var(--text-dim);
  text-decoration: none;
  font-weight: 700;
  transition: background 0.2s, color 0.2s;
}
.nav-link:hover { background: rgba(94, 58, 92, 0.3); color: var(--mist); }
.nav-link.router-link-active {
  background: linear-gradient(90deg, rgba(180, 122, 154, 0.3), rgba(94, 58, 92, 0.1));
  color: var(--mist);
  box-shadow: inset 3px 0 0 var(--rose);
}
.practice { padding-top: 14px; border-top: 1px solid var(--line); }
.nav-title {
  padding: 0 14px 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rose);
}
.practice-links { position: relative; display: flex; flex-direction: column; gap: 4px; }
.practice-links .nav-link { position: relative; z-index: 1; background: none; }
.practice-links .nav-link:hover { background: rgba(94, 58, 92, 0.2); }
.practice-links .nav-link.on { color: var(--mist); }
/* Підсвітка, що плавно переїжджає до обраної вкладки: два пункти однакової висоти, gap 4px */
.practice-slider {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: calc((100% - 4px) / 2);
  border-radius: 14px;
  background: linear-gradient(90deg, rgba(180, 122, 154, 0.3), rgba(94, 58, 92, 0.1));
  box-shadow: inset 3px 0 0 var(--rose);
  transform: translateY(calc(var(--i) * (100% + 4px)));
  opacity: 0;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
}
.practice-links.on .practice-slider { opacity: 1; }
.count { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--text-dim); transition: color 0.2s; }
.nav-link.on .count { color: var(--rose); }
.mobile-practice { display: none; }
.badge {
  margin-left: auto;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 12px;
  background: var(--rose);
  color: var(--abyss);
  animation: bob 1.4s ease-in-out infinite;
}
@keyframes bob { 50% { transform: translateY(-2px); } }

.account {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding: 10px 0 0 14px;
  border-top: 1px solid var(--line);
  color: var(--text-dim);
  font-size: 13px;
  font-weight: 600;
}
.account .nav-link { flex: 1; margin-left: -14px; }
.email { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sync { display: grid; place-items: center; color: var(--good); }
.sync.syncing { color: var(--text-dim); animation: pulse 1s ease-in-out infinite alternate; }
.sync.error { color: var(--bad); }
@keyframes pulse { to { opacity: 0.4; } }
.icon-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: rgba(0, 3, 14, 0.4);
  color: var(--text-dim);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.icon-btn:hover { color: var(--mist); border-color: var(--rose); }

.boot { min-height: 100vh; display: grid; place-content: center; justify-items: center; gap: 12px; }
.boot .sigil { font-size: 40px; animation: pulse 1s ease-in-out infinite alternate; }

.preview-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1100px;
  margin: 20px auto 0;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--line-strong);
  background: rgba(0, 3, 14, 0.4);
  color: var(--text-dim);
  font-size: 14px;
}
.preview-banner b { color: var(--mist); }
.preview-banner span { flex: 1; }
.preview-banner .btn { flex-shrink: 0; }

.topbar { display: none; }
.main { min-width: 0; }

.page-enter-active, .page-leave-active { transition: opacity 0.2s, transform 0.2s; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .shell { grid-template-columns: 1fr; }
  .side {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    z-index: 50;
    padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
    border-right: 0;
    border-top: 1px solid var(--line);
    background: rgba(11, 14, 26, 0.95);
  }
  .side { flex-direction: row; gap: 0; }
  .brand, .hero-card, .xp, .stats, .account { display: none; }
  .nav { flex-direction: row; justify-content: space-around; margin: 0; flex: 5; }
  .practice { flex: 1; padding: 0; border-top: 0; }
  .nav-title, .practice-links { display: none; }
  .mobile-practice { display: flex; }
  .mobile-practice.on { color: var(--mist); box-shadow: inset 0 2px 0 var(--rose); }
  .nav-link { flex-direction: column; gap: 2px; padding: 8px 6px; font-size: 11px; flex: 1; position: relative; }
  .nav-link.router-link-active { box-shadow: inset 0 2px 0 var(--rose); }
  .badge { position: absolute; top: 2px; right: calc(50% - 22px); min-width: 18px; height: 18px; font-size: 10px; }

  .topbar {
    display: flex;
    align-items: center;
    gap: 8px;
    position: sticky;
    top: 0;
    z-index: 40;
    padding: 10px 16px;
    background: rgba(11, 14, 26, 0.9);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }
  .mini-hero { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; text-decoration: none; }
  .mini-xp { flex: 1; max-width: 200px; }
  .preview-banner { margin: 12px 16px 0; }
}
</style>
