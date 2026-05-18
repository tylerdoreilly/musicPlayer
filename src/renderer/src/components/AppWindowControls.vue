<script setup>
  import { ref } from 'vue'

  const minimize = () => window.electronAPI.minimize();
  const maximize = () => window.electronAPI.maximize();
  const close = () => window.electronAPI.close();

</script>

<template>
  <div class="app-window-controls">
    <button 
      @click="minimize" 
      class="control-btn"
      >
      <span class="control-btn__icon control-btn__icon--min">_</span>
    </button>
    <button 
      @click="maximize" 
      class="control-btn"
      >
      <span class="control-btn__icon control-btn__icon--max">▢</span>
    </button>
    <button 
      @click="close" 
      class="control-btn close"
      >
      <span class="control-btn__icon control-btn__icon--close">×</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>


.app-window-controls {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag; 
}

.control-btn {
  width: 45px;
  height: 45px;
  border: none;
  background: transparent;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;  
  position: relative; 
  cursor: pointer;
}

.control-btn:hover { background: #555; }
.control-btn.close:hover { background: #e81123; }

.control-btn__icon {
  line-height: 0;
  font-family: "Segoe UI", sans-serif;
  font-weight: 100;
  text-align: center;
  position:absolute;

  &--min {
    font-size: 18px;
    top: 14px;
  }

  &--max {
    font-size: 16px;
    top: 22px;
  }

  &--close {
    font-size: 26px;
    top: 20px;
  }
}

</style>
