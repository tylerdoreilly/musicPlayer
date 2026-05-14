

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
    size:{
      type: String,
      default:'large',
      docs:{
        validation:'_',
        description:'Image size'
      }
    },
  });

  const { images, size } = toRefs(props);

    const imageSizeModifiers = computed(() =>{
        return {
            'album-image-container--sm': size.value == 'small',
            'album-image-container--md': size.value == 'medium',
            'album-image-container--lg': size.value == 'large'
        }
    })

  onMounted(() => {
    console.log('album images', images.value)
})

</script>

<template>
   <div :class="[ 'album-image-container', imageSizeModifiers ]">
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
        background: #f8fafc;
        border-radius: 0.5rem;
        flex-shrink: 0;
        overflow: hidden;

        &--sm{
            width: 100px;
            height: 100px;
        }
        &--md{
            width: 150px;
            height: 150px;
        }
        &--lg{
            width: 250px;
            height: 250px;
        }
        &--xl{
            width: 350px;
            height: 350px;
        }
    }

    .album-image{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>