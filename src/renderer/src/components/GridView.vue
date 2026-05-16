

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  const $emit = defineEmits(['selected']);

  const props = defineProps({
    data:{
      type: Array,
      default: () => [],
      docs:{
        validation:'_',
        description:'Data for the grid view'
      }
    },
   
  });

  const { data } = toRefs(props);

  const navigate = (albumId) => {
    $emit('selected', albumId);
  }

  onMounted(() => {
  })

</script>

<template>
  <exai-grid>         
    <exai-card 
      v-for="([albumName, album]) in Object.entries(data)" 
      :key="album.id"
      @click="navigate(album.id)"
      >
      <template #cardImage>
        <exai-image :images="album.albumImages" :size="'medium'" />
      </template>
      <template #cardHeader>
          <h3>{{ album.name }}</h3>
      </template>
      <template #cardContent>
          <span>{{ album.year || '????' }}</span> - 
          <span>{{ Object.keys(album.tracks || {}).length }} track{{ Object.keys(album.tracks || {}).length !== 1 ? 's' : '' }}</span>
      </template>
    </exai-card>    
  </exai-grid>
</template>

<style lang="scss" scoped>
  .grid-view {
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
