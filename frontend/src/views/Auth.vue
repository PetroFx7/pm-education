<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mdiArrowRight, mdiArrowLeft } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import { useAuthStore, authErrorMessage } from '../stores/auth'
import { useHeroStore } from '../stores/hero'
import { useSyncStore } from '../stores/sync'

const auth = useAuthStore()
const hero = useHeroStore()
const sync = useSyncStore()
const router = useRouter()

const mode = ref<'sign-in' | 'sign-up'>('sign-in')
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

const isSignUp = computed(() => mode.value === 'sign-up')
const canSubmit = computed(
  () => email.value.includes('@') && password.value.length >= 8 && (!isSignUp.value || name.value.trim().length >= 2),
)

function switchMode(m: 'sign-in' | 'sign-up') {
  mode.value = m
  error.value = ''
}

function leave() {
  router.push(hero.created ? '/map' : '/create')
}

async function submit() {
  if (!canSubmit.value || busy.value) return
  busy.value = true
  error.value = ''
  try {
    if (isSignUp.value) await auth.signUp(name.value.trim(), email.value.trim(), password.value)
    else await auth.signIn(email.value.trim(), password.value)
    await sync.load()
    leave()
  } catch (e) {
    error.value = authErrorMessage(e)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="auth">
    <header class="intro">
      <div class="eyebrow">Хроніки Проєктного Менеджера</div>
      <h1>{{ isSignUp ? 'Новий акаунт' : 'Вхід' }}</h1>
      <p class="muted">Акаунт потрібен, щоб зберегти героя в хмарі й продовжити з іншого пристрою.</p>
    </header>

    <form class="panel ornate form" @submit.prevent="submit">
      <div class="tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="!isSignUp" :class="{ on: !isSignUp }" @click="switchMode('sign-in')">Вхід</button>
        <button type="button" role="tab" :aria-selected="isSignUp" :class="{ on: isSignUp }" @click="switchMode('sign-up')">Реєстрація</button>
      </div>

      <label v-if="isSignUp" class="field">
        <span>Ім’я</span>
        <input v-model="name" class="input" maxlength="40" autocomplete="name" />
      </label>
      <label class="field">
        <span>Email</span>
        <input v-model="email" class="input" type="email" autocomplete="email" required />
      </label>
      <label class="field">
        <span>Пароль</span>
        <input
          v-model="password"
          class="input"
          type="password"
          minlength="8"
          :autocomplete="isSignUp ? 'new-password' : 'current-password'"
          required
        />
        <small v-if="isSignUp" class="muted">Щонайменше 8 символів</small>
      </label>

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <button class="btn primary big" type="submit" :disabled="!canSubmit || busy">
        {{ busy ? 'Зачекай…' : isSignUp ? 'Створити акаунт' : 'Увійти' }}
        <MdiIcon v-if="!busy" :path="mdiArrowRight" :size="20" />
      </button>
    </form>

    <button type="button" class="btn ghost small back" @click="leave">
      <MdiIcon :path="mdiArrowLeft" :size="18" /> Продовжити без акаунта
    </button>
  </div>
</template>

<style scoped>
.auth { max-width: 440px; margin: 0 auto; padding: 56px 16px 64px; display: flex; flex-direction: column; }
.intro { text-align: center; margin-bottom: 32px; }
.intro h1 {
  font-size: clamp(32px, 7vw, 48px);
  font-weight: 800;
  margin: 8px 0 12px;
  background: linear-gradient(180deg, var(--mist), var(--rose));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.form { display: flex; flex-direction: column; gap: 18px; padding: 28px; }
.tabs { display: grid; grid-template-columns: 1fr 1fr; padding: 4px; border-radius: 999px; border: 1px solid var(--line); background: rgba(0, 3, 14, 0.4); }
.tabs button {
  padding: 10px;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--text-dim);
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tabs button.on { background: rgba(180, 122, 154, 0.3); color: var(--mist); }
.field { display: flex; flex-direction: column; gap: 6px; font-weight: 600; font-size: 14px; }
.field small { font-weight: 500; font-size: 12px; }
.input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--line-strong);
  background: rgba(0, 3, 14, 0.5);
  color: var(--mist);
  font: inherit;
  font-size: 16px;
}
.input:focus { outline: none; border-color: var(--rose); box-shadow: var(--glow); }
.error { margin: 0; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--bad); color: var(--bad); font-size: 14px; }
.big { align-self: stretch; padding: 14px 24px; font-size: 16px; }
.back { align-self: center; margin-top: 18px; }
@media (max-width: 640px) {
  .auth { padding-top: 32px; }
  .form { padding: 22px 18px; }
}
</style>
