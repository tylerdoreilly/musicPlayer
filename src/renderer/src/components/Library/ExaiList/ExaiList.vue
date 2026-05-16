

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  onMounted(() => {
  })

</script>

<template>
    <div :class="['exai-list']">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
  .exai-list{
    display: flex;
    flex-direction: column;
  }

 
</style>