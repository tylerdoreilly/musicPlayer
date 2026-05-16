

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  onMounted(() => {
  })

</script>

<template>
  <div :class="['file-selector']">
    <div :class="['file-selector__left']">
      <slot name="fileSelectorLeft"></slot>
    </div>
    <div :class="['file-selector__right']">
      <slot name="fileSelectorRight"></slot>
    </div>          
  </div>
</template>

<style lang="scss" scoped>
  .file-selector {
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

  .file-selector-btn {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
    font-size: 0.85rem;
    cursor: pointer;
  }
</style>