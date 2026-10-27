<script setup lang="ts">
import { computed } from 'vue'
import { mdiArrowLeft, mdiHeart, mdiHeartOutline, mdiSwordCross, mdiShieldHalfFull, mdiRestore, mdiMapLegend, mdiTreasureChest, mdiCheck, mdiClose } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import HeroAvatar from '../components/HeroAvatar.vue'
import { moduleById } from '../services/course'
import { HERO_HP, isVictory } from '../domain/quiz'
import { useHeroStore } from '../stores/hero'
import { useBossBattle } from '../composables/useBossBattle'

const props = defineProps<{ id: string }>()
const hero = useHeroStore()
const mod = computed(() => moduleById(props.id)!)
const record = computed(() => hero.moduleStats(mod.value).boss)
const won = computed(() => isVictory(correct.value, total.value))

const { phase, current, step, total, picked, correct, hit, result, bossHp, heroHp, isLast, start, answer, next } =
  useBossBattle(mod)
</script>

<template>
  <div class="page arena-page">
    <RouterLink :to="`/location/${mod.id}`" class="back"><MdiIcon :path="mdiArrowLeft" :size="18" /> {{ mod.location }}</RouterLink>

    <!-- Вступ -->
    <section v-if="phase === 'intro'" class="panel ornate intro">
      <div class="boss-sigil"><MdiIcon :path="mod.boss.icon" :size="72" /></div>
      <div class="eyebrow">Бос локації «{{ mod.location }}»</div>
      <h1>{{ mod.boss.name }}</h1>
      <p class="muted">
        П’ять питань з модуля «{{ mod.title }}». Кожна правильна відповідь — удар по босу.
        Помилишся двічі — доведеться відступити й спробувати знову.
      </p>
      <div class="rules">
        <span class="chip"><MdiIcon :path="mdiSwordCross" :size="14" /> 12 XP за влучання</span>
        <span class="chip"><MdiIcon :path="mdiShieldHalfFull" :size="14" /> +50 XP за бій без помилок</span>
        <span v-if="record.attempts" class="chip">Рекорд: {{ record.best }}/5 · спроб: {{ record.attempts }}</span>
      </div>
      <button class="btn primary big" @click="start"><MdiIcon :path="mdiSwordCross" :size="20" /> Почати бій</button>
    </section>

    <!-- Бій -->
    <section v-else-if="phase === 'battle' && current" class="battle">
      <div class="fighters">
        <div class="fighter" :class="{ shake: hit === 'hero' }">
          <HeroAvatar :avatar="hero.avatar" :level="hero.level" :size="64" />
          <div>
            <strong>{{ hero.name }}</strong>
            <div class="hearts">
              <MdiIcon v-for="n in HERO_HP" :key="n" :path="n <= heroHp ? mdiHeart : mdiHeartOutline" :size="20" />
            </div>
          </div>
        </div>
        <span class="vs">VS</span>
        <div class="fighter boss" :class="{ shake: hit === 'boss' }">
          <div>
            <strong>{{ mod.boss.name }}</strong>
            <div class="hp"><span :style="{ width: (bossHp / total) * 100 + '%' }" /></div>
          </div>
          <div class="boss-mini"><MdiIcon :path="mod.boss.icon" :size="36" /></div>
        </div>
      </div>

      <div class="panel question">
        <div class="eyebrow">Питання {{ step + 1 }} з {{ total }}</div>
        <h2>{{ current.q }}</h2>
        <div class="options">
          <button
            v-for="(o, i) in current.o"
            :key="i"
            class="opt"
            :class="{
              right: picked !== null && i === current.a,
              wrong: picked === i && i !== current.a,
              dim: picked !== null && i !== current.a && picked !== i,
            }"
            :disabled="picked !== null"
            @click="answer(i)"
          >
            <span class="letter">{{ 'АБВГ'[i] }}</span>
            <span>{{ o }}</span>
            <MdiIcon v-if="picked !== null && i === current.a" :path="mdiCheck" :size="20" class="mark" />
            <MdiIcon v-else-if="picked === i" :path="mdiClose" :size="20" class="mark" />
          </button>
        </div>

        <Transition name="reveal">
          <div v-if="picked !== null" class="explain" :class="picked === current.a ? 'good' : 'bad'">
            <strong>{{ picked === current.a ? 'Влучний удар!' : 'Бос контратакує!' }}</strong>
            <p>{{ current.why }}</p>
            <button class="btn primary" @click="next">
              {{ isLast ? 'Завершити бій' : 'Далі' }}
            </button>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Результат -->
    <section v-else-if="phase === 'result' && result" class="panel ornate intro result" :class="{ win: result.defeated }">
      <div class="boss-sigil" :class="{ fallen: won }"><MdiIcon :path="mod.boss.icon" :size="72" /></div>
      <div class="eyebrow">{{ won ? 'Перемога' : 'Відступ' }}</div>
      <h1>{{ won ? `${mod.boss.name} переможений!` : 'Бос виявився сильнішим' }}</h1>
      <p class="score"><b>{{ correct }}</b> / {{ total }}</p>
      <p class="muted">
        <template v-if="correct === total">Бездоганна перемога — жодної помилки!</template>
        <template v-else-if="won">Чудовий бій. Можна повернутися по ідеальний результат.</template>
        <template v-else>Перечитай квести локації та повертайся: потрібно щонайменше 4 правильні відповіді.</template>
      </p>
      <div class="actions">
        <RouterLink v-if="hero.moduleStats(mod).chestReady" to="/treasury" class="btn primary">
          <MdiIcon :path="mdiTreasureChest" :size="18" /> Відкрити скриню
        </RouterLink>
        <RouterLink v-else-if="result.defeated" to="/map" class="btn primary">
          <MdiIcon :path="mdiMapLegend" :size="18" /> На мапу
        </RouterLink>
        <button class="btn" @click="start"><MdiIcon :path="mdiRestore" :size="18" /> Ще раз</button>
        <RouterLink v-if="!result.defeated" :to="`/location/${mod.id}`" class="btn ghost">До квестів</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.arena-page { max-width: 860px; }
.back { display: inline-flex; align-items: center; gap: 6px; color: var(--text-dim); text-decoration: none; font-weight: 700; margin-bottom: 18px; }
.intro { text-align: center; padding: 44px 32px; }
.intro h1 { font-size: clamp(24px, 4vw, 36px); margin: 8px 0 12px; }
.intro p { max-width: 520px; margin: 0 auto 18px; }
.boss-sigil {
  width: 140px; height: 140px; margin: 0 auto 18px; border-radius: 50%;
  display: grid; place-items: center;
  color: var(--mist);
  background: radial-gradient(circle at 40% 35%, #8e4a6e, var(--plum-deep) 65%, var(--abyss));
  box-shadow: 0 0 0 2px rgba(232, 138, 154, 0.5), 0 0 60px rgba(232, 138, 154, 0.35);
  animation: menace 3s ease-in-out infinite;
}
.boss-sigil.fallen { filter: grayscale(0.8) brightness(0.7); animation: none; transform: rotate(-12deg); }
@keyframes menace { 50% { transform: scale(1.05); box-shadow: 0 0 0 2px rgba(232, 138, 154, 0.7), 0 0 90px rgba(232, 138, 154, 0.5); } }
.rules { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 26px; }
.big { padding: 16px 32px; }

.fighters { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
.fighter { flex: 1; display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 18px; border: 1px solid var(--line); background: rgba(0, 3, 14, 0.4); min-width: 0; }
.fighter strong { display: block; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fighter > div:not(.boss-mini) { min-width: 0; flex: 1; }
.fighter.boss { text-align: right; border-color: rgba(232, 138, 154, 0.35); }
.hearts { display: flex; gap: 2px; color: var(--bad); margin-top: 4px; }
.hp { height: 10px; margin-top: 8px; border-radius: 999px; background: rgba(0, 3, 14, 0.6); overflow: hidden; border: 1px solid rgba(232, 138, 154, 0.35); }
.hp span { display: block; height: 100%; margin-left: auto; background: linear-gradient(90deg, #8e4a6e, var(--bad)); transition: width 0.5s; }
.boss-mini { width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle, #8e4a6e, var(--plum-deep)); flex-shrink: 0; }
.vs { font-family: var(--font-head); font-weight: 800; color: var(--rose); }
.shake { animation: shake 0.45s; }
@keyframes shake { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }

.question h2 { font-size: clamp(17px, 2.4vw, 21px); line-height: 1.45; margin: 8px 0 20px; }
.options { display: grid; gap: 10px; }
.opt {
  display: flex; align-items: center; gap: 14px; text-align: left;
  padding: 14px 16px; border-radius: 14px;
  border: 1px solid var(--line-strong);
  background: rgba(0, 3, 14, 0.4);
  cursor: pointer; font-weight: 600; line-height: 1.4;
  transition: all 0.15s;
}
.opt:not(:disabled):hover { border-color: var(--rose); background: rgba(94, 58, 92, 0.4); transform: translateX(3px); }
.opt:disabled { cursor: default; }
.letter {
  flex-shrink: 0; width: 30px; height: 30px; border-radius: 8px;
  display: grid; place-items: center;
  font-family: var(--font-head); font-size: 12px;
  background: rgba(94, 58, 92, 0.5);
}
.mark { margin-left: auto; }
.opt.right { border-color: var(--good); background: rgba(159, 214, 181, 0.12); }
.opt.right .letter { background: var(--good); color: var(--abyss); }
.opt.wrong { border-color: var(--bad); background: rgba(232, 138, 154, 0.12); }
.opt.wrong .letter { background: var(--bad); color: var(--abyss); }
.opt.dim { opacity: 0.45; }
.explain { margin-top: 18px; padding: 16px 18px; border-radius: 14px; border-left: 3px solid; }
.explain.good { border-color: var(--good); background: rgba(159, 214, 181, 0.08); }
.explain.bad { border-color: var(--bad); background: rgba(232, 138, 154, 0.08); }
.explain p { margin: 6px 0 14px; color: var(--text-dim); }
.reveal-enter-active { transition: all 0.25s; }
.reveal-enter-from { opacity: 0; transform: translateY(6px); }

.score { font-family: var(--font-head); font-size: 22px; }
.score b { font-size: 56px; color: var(--rose); }
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }

@media (max-width: 640px) {
  .fighters { gap: 8px; }
  .vs { display: none; }
  .fighter { padding: 10px; gap: 10px; }
  .boss-mini { width: 44px; height: 44px; }
  .intro { padding: 32px 18px; }
}
</style>
