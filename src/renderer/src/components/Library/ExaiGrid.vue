

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  onMounted(() => {
  })

</script>

<template>
    <div :class="['exai-grid']">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
  .exai-grid{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    .exai-grid {
      gap: 0.75rem;
    }

  //   .album-card {
  //   padding: 0.75rem;
  //   min-width: 120px;
  // }
  }

//   @media (max-width: 768px) {
//   .album-card {
//     max-width: 100%;
//     min-width: 150px;
//   }
// }

  :slotted(.card) {
    align-items: center;
    text-align: center;
  }
</style>