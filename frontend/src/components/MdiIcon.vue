<script setup lang="ts">
defineProps({
  path: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true" class="mdi">
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<style scoped>
.mdi { flex-shrink: 0; display: inline-block; vertical-align: middle; }
</style>
