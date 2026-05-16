

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  onMounted(() => {
  })

</script>

<template>
    <div :class="['page-content']">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
    .page-content{
      display: flex;
      flex-direction: column;
      gap: 0;
      background:#191919ff;
      padding: 2rem;
    }
</style>