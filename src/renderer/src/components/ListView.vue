

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  const $emit = defineEmits(['selected']);

  const props = defineProps({
    data:{
      type: Array,
      default: () => [],
      docs:{
        validation:'_',
        description:'Data for the list view'
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
  <exai-list-item 
    v-for="([albumName, album]) in Object.entries(data)" 
    :key="album.id" 
    @click="navigate(album.id)"
    >
    <template #listImage>
        <exai-image :images="album.albumImages" :size="'small'" />
    </template>
    <template #listHeader>
        <h3>{{ album.name }}</h3>
    </template>
    <template #listDetails>
        <span>{{ album.year || '????' }}</span> - 
        <span>{{ Object.keys(album.tracks || {}).length }} track{{ Object.keys(album.tracks || {}).length !== 1 ? 's' : '' }}</span>
    </template>
  </exai-list-item>
</template>

<style lang="scss" scoped>
</style>
