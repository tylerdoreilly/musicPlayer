<script setup>
  import { ref } from 'vue'

  const applicationName = ref('Mantis')

</script>

<template>
  <header class="app-title-bar">
    <div class="app-title-bar-content drag-region">
      <div class="app-title-bar__brand">{{ applicationName }}</div>
      <app-nav-btns />
    </div>
    <div class="app-title-bar-controls">
      <exai-icon icon="user-circle" size="small" class="user-icon"/>
      <app-window-controls />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-title-bar {
  display: flex;
  justify-content: space-between;
  align-items:center;
  height: 45px;
  background: #000;
  color: white;
  -webkit-app-region: drag; 

  &__brand{
    margin-left:15px;
  }
}

.app-title-bar-content{
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title-bar-controls {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag; 
}

.user-icon{
  width:18px;
  height:18px;
  color: #fff;
  margin-right: 12px;
}

</style>
