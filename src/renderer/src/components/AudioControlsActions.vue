

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  onMounted(() => {
  })

</script>

<template>
  <div :class="['audio-controls-actions']">
    <slot/>
  </div>
</template>

<style lang="scss" scoped>
  .audio-controls-actions {
     display: flex;
     flex-direction: row;
     justify-content: center; 
     align-items: center; 
     gap:10px;
   
  }

</style>