

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  onMounted(() => {
  })

</script>

<template>
  <div :class="['audio-controls']">
    <div :class="['audio-controls__left']">
      <slot name="audioControlsLeft"></slot>
    </div>
     <div :class="['audio-controls__center']">
       <slot name="audioControlsCenter"></slot>
    </div> 
    <div :class="['audio-controls__right']">
      <slot name="audioControlsRight"></slot>
    </div>          
  </div>
</template>

<style lang="scss" scoped>
  .audio-controls {
    display: flex;
    justify-content: center; 
    align-items: center; 

    &__left {
       flex: 1;
       text-align: left;
    }

    &__right {
    flex: 1;
       text-align: right;
       margin-left:auto;
       width:200px;
     
    }

    &__center {
      flex: 0 0 auto;
       text-align: center;
    }
  }

</style>