

<script setup>
  import { computed, toRefs, onMounted } from 'vue'
  import AlbumImage from '@renderer/components/Library/AlbumImage.vue'

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
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
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
    }

    .card-content{
        font-size:0.85rem;
        color:#fff;
    }

    .card-image{
      margin-bottom: 0.75rem;
    }

</style>