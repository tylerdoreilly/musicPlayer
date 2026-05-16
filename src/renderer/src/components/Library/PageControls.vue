

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  onMounted(() => {
  })

</script>

<template>
  <div :class="['page-controls']">
    <div :class="['page-controls__left']">
      <slot name="pageControlsLeft"></slot>
    </div>
    <div :class="['page-controls__right']">
      <slot name="pageControlsRight"></slot>
    </div>          
  </div>
</template>

<style lang="scss" scoped>
  .page-controls {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;

    &__left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  }

  .page-control-btn {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
    font-size: 0.85rem;
    cursor: pointer;
  }
</style>