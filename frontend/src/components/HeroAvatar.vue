<script setup lang="ts">
import { computed } from 'vue'
import MdiIcon from './MdiIcon.vue'
import { AVATARS } from '../data/world'

const props = defineProps({
  avatar: { type: String, default: 'wizard' },
  size: { type: Number, default: 56 },
  level: { type: Number, default: 0 },
})
const icon = computed(() => (AVATARS.find((a) => a.id === props.avatar) || AVATARS[0]).icon)
</script>

<template>
  <div class="avatar" :style="{ width: size + 'px', height: size + 'px' }">
    <MdiIcon :path="icon" :size="size * 0.55" />
    <span v-if="level" class="lvl">{{ level }}</span>
  </div>
</template>

<style scoped>
.avatar {
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--mist);
  background: radial-gradient(circle at 35% 30%, var(--rose), var(--plum) 55%, var(--plum-deep));
  box-shadow: 0 0 0 2px var(--night), 0 0 0 4px var(--rose), var(--glow);
  flex-shrink: 0;
}
.lvl {
  position: absolute;
  right: -6px;
  bottom: -6px;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--mist);
  color: var(--abyss);
  font-family: var(--font-head);
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 0 0 2px var(--night);
}
</style>
