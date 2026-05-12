

<script setup>
 import { computed, toRefs, onMounted } from 'vue'

 const props = defineProps({
    images:{
      type: Array,
      docs:{
        validation:'_',
        description:'Icon size'
      }
    },
   
  });

  const { images } = toRefs(props);

  onMounted(() => {
    console.log('album images', images.value)
})

</script>

<template>
   <div :class="[ 'album-image-container' ]">
        <img 
            v-if="images[0]" 
            :src="images[0]?.path" 
            alt="Album Cover" 
            class="album-image" 
        />
        <div v-else class="album-placeholder">
            <i class="fas fa-music"></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .album-image-container{
        width: 250px;
        height: 250px;
        background: #f8fafc;
        border-radius: 0.5rem;
        flex-shrink: 0;
        overflow: hidden;
    }

    .album-image{
        width: 250px;
        height: 250px;
    }
</style>