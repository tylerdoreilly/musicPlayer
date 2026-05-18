<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navigationHistory = ref([])
const currentIndex = ref(-1)

const canGoBack = computed(() => currentIndex.value > 0)
const canGoForward = computed(() => currentIndex.value < navigationHistory.value.length - 1)

const addToHistory = (path) => {
  // Remove any forward history when navigating to a new page
  if (currentIndex.value < navigationHistory.value.length - 1) {
    navigationHistory.value = navigationHistory.value.slice(0, currentIndex.value + 1)
  }

  // Don't add duplicate consecutive entries
  if (navigationHistory.value[navigationHistory.value.length - 1] !== path) {
    navigationHistory.value.push(path)
    currentIndex.value = navigationHistory.value.length - 1
  }
}

const goBack = () => {
  if (canGoBack.value) {
    currentIndex.value--
    const previousPath = navigationHistory.value[currentIndex.value]
    router.push(previousPath)
  }
}

const goForward = () => {
  if (canGoForward.value) {
    currentIndex.value++
    const nextPath = navigationHistory.value[currentIndex.value]
    router.push(nextPath)
  }
}

// Watch for route changes and update history
watch(
  () => route.path,
  (newPath) => {
    addToHistory(newPath)
  },
  { immediate: true }
)

onMounted(() => {
  addToHistory(route.path)
})
</script>

<template>
  <div class="nav">
    <button
      class="nav-button"
      :disabled="!canGoBack"
      @click="goBack"
      :class="{ 'nav-button--disabled': !canGoBack }"
    >
      <font-awesome-icon icon="angle-left" class="icon"/>
    </button>

    <button
      class="nav-button"
      :disabled="!canGoForward"
      @click="goForward"
      :class="{ 'nav-button--disabled': !canGoForward }"
    >
      <font-awesome-icon icon="angle-right" class="icon" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .nav {
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag; 
  }

  .nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    border: none;
  }

  .nav-button .icon{
    width: 28px;
    height: 28px;
    color:rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-button:hover:not(.nav-button--disabled) .icon{
    color:#fff;
  }

  .nav-button:active:not(.nav-button--disabled) .icon{
    color:#fff;
  }

  .nav-button--disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: #9ca3af;
  }
</style>