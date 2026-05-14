<script setup>
import { ref } from 'vue'
import Nav from './Nav.vue'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits(['folderSelected'])

</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <!-- <button
        class="app-menu-btn"
      >
        <font-awesome-icon :icon="faBars" class="icon"/>
      </button> -->
      <h1 class="app-title">Mantis</h1>
      <Nav />
    </div>
  </header>
</template>

<style scoped>
.app-header {
 background-color: #1b1b1f;
  color: white;
  padding: 16px 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.app-menu-btn .icon{
  background-color: transparent !important;
  background: none !important;
  border: none !important;
  color:#fff;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 100%;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  flex-shrink: 0;
}

.select-folder-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.select-folder-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.select-folder-btn:active {
  transform: translateY(0);
}

.folder-path {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

@media (max-width: 768px) {
  .app-header {
    padding: 12px 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .app-title {
    font-size: 20px;
  }

  .folder-path {
    width: 100%;
  }
}
</style>
