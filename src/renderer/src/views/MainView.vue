<script setup>
  import { ref } from 'vue'
  import { RouterLink, RouterView } from 'vue-router'
  import Sidebar from '../components/Sidebar.vue'

  const currentView = ref('home')

  const onViewChanged = (view) => {
    currentView.value = view
  }

</script>

<template>
 <div class="main-content">
    <Sidebar @viewChanged="onViewChanged" />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.main-content {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  min-width: 0;
  max-height: calc(100% - 120px);
}
</style>