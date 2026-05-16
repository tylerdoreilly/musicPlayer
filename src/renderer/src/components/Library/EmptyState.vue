

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  const props = defineProps({
    title:{
      type: String,
      docs:{
        validation:'_',
        description:'Empty State Title'
      }
    },
    message:{
      type: String,
      docs:{
        validation:'_',
        description:'Empty State Message'
      }
    },
   
  });

  const { title, message } = toRefs(props);

  onMounted(() => {
  })

</script>

<template>
  <div :class="['empty-state']">
    <div :class="['empty-state__icon']">
      <slot name="icon"></slot>
    </div>
    <h2 :class="['empty-state__title']">{{ title }}</h2>
    <p :class="['empty-state__message']">{{ message }}</p>   
  </div>
</template>

<style lang="scss" scoped>
  .empty-state {
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .empty-state__icon {
    margin-bottom: 1rem;
  }

  .empty-state__title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .empty-state__message {
    font-size: 1rem;
    line-height: 1.5;
  }
</style>
