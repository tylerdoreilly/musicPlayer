

<script setup>
 import { computed, toRefs, onMounted } from 'vue'

 const props = defineProps({
    text:{
      type: String,
      docs:{
        validation:'_',
        description:'Section Title'
      }
    },
   
  });

  const { text } = toRefs(props);

  onMounted(() => {
})

</script>

<template>
    <div class="card">
        <div class="card-header">
           <slot name="cardHeader"></slot>
        </div>
        <div class="card-content">
          <slot name="cardContent"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .card{
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.75rem;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
      max-width: 280px;
      flex: 1 1 auto;
      min-width: 200px;
    }

    .card-header{
        font-size:1.25rem;
        font-weight:600;
        color:#1f2937;
    }

    .card-content{
        font-size:1rem;
        color:#4b5563;
    }

</style>