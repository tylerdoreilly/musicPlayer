

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
        <div class="card-image">
            <slot name="cardImage"></slot>
        </div>
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
      display:flex;
      flex-direction: column;
       align-items: center;    
      cursor: pointer;
      max-width: 280px;
      width: 180px;
      // flex: 1 1 auto;
      min-width: 180px;
    }

    .card-header{
        font-size:0.875rem;
        line-height:1.25rem;
        font-weight:600;
        color:#fff;
        margin-bottom:4px;
        text-align: center;
    }

    .card-content{
        font-size:0.85rem;
        color:#fff;
        text-align: center;
    }

    .card-image{
      margin-bottom: 0.75rem;
    }

</style>