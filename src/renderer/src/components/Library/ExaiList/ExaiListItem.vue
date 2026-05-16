

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  onMounted(() => {
  })

</script>

<template>
    <div :class="['exai-list__item']">
        <slot name="listImage"></slot>
        <div class="list-item-content"> 
            <slot name="listHeader"></slot>
            <slot name="listDetails"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
  .exai-list__item{
    overflow: hidden;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: opacity 0.2s;
  }

 
</style>