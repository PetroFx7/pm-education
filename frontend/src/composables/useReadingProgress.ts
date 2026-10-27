import { ref, onMounted, onBeforeUnmount } from 'vue'

// Відсоток прокручування сторінки — для смуги прогресу читання
export function useReadingProgress() {
  const pct = ref(0)
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight
    pct.value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 100
  }
  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', update))
  return pct
}
