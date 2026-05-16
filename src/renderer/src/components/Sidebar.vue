<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { faHome, faUserCircle, faCog } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()

const emit = defineEmits(['viewChanged'])

const activeView = ref('home')

const setView = (view) => {
  activeView.value = view
  const url = view === 'home' ? '/' : `/${view}`
  router.push(url)
}
</script>

<template>
  <div class="sidebar">
    <button
      @click="setView('home')"
      :class="{ active: activeView === 'home' }"
      class="sidebar-item"
    >
     <font-awesome-icon :icon="faHome" class="menu-icon" /> Home
    </button>
    <button
      @click="setView('artists')"
      :class="{ active: activeView === 'artists' }"
      class="sidebar-item"
    >
     <font-awesome-icon :icon="faUserCircle" class="menu-icon" /> Artists
    </button>
     <button
      @click="setView('preferences')"
      :class="{ active: activeView === 'preferences' }"
      class="sidebar-item"
    >
     <font-awesome-icon :icon="faCog" class="menu-icon" />   Preferences
    </button>
  </div>
</template>

<style lang="scss" scoped>

.sidebar {
  width: 300px;
  background-color:#181818ff;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-item {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 4px solid transparent;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
}

.sidebar-item:hover {
  background-color: #374151;
}

.sidebar-item.active {
  border-left: 4px solid #3b82f6;
}

.menu-icon {
  margin-right: 0.75rem;
  color: #fff;
}
</style>