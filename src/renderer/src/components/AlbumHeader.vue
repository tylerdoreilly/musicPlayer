

<script setup>
  import { computed, toRefs, onMounted } from 'vue'
  import HeaderImage from '@renderer/components/Library/HeaderImage.vue';

 const props = defineProps({
    album:{
      type: Object,
      required: true,
      default: () => ({}),
      docs:{
        validation:'_',
        description:'Section Title'
      }
    },
    artist:{
      type: Object,
      required: true,
      default: () => ({}),
      docs:{
        validation:'_',
        description:'Section Title'
      }
    },
  });

  const { album, artist } = toRefs(props);

  const trackEntries = computed(() => {
    if (!album.value) return []
    return Object.entries(album.value.tracks || {})
  })

  const trackCount = computed(() => trackEntries.value.length)

  onMounted(() => {
    console.log('selected artist', artist.value)
    console.log('selected album', album.value)
  })

</script>

<template>
    <div class="album-header">
      <HeaderImage :images="album.albumImages" />
      <div>
       <h2>{{ album.name }}</h2>
           
        <div class="album-meta">
            <span class="album-artist">{{ artist.name }}</span>
            <span>-</span>
            <span>{{ album.year || 'Unknown' }}</span>
            <span>-</span>
            <span>{{ trackCount }} Tracks</span>
        </div>
        <exai-tags :data="album.genres || []" />
          <!-- <p class="album-meta">ID: {{ album.id }}</p>
          <p v-if="album.folderPath" class="album-meta">Folder: {{ album.folderPath }}</p> -->
      </div>
    </div>
</template>

<style lang="scss" scoped>
  .album-header{
    gap: 1.5rem;
    margin-bottom: 1rem;
    color:#fff;
    display:flex;
    flex-direction: row;
    align-items: flex-end;
    padding: 2rem 2rem 2rem 2rem;
    min-height:180px;
    height:350px;
    background: linear-gradient(0deg,rgba(25, 25, 25, 0.43) 0%, rgba(252, 176, 69, 0) 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .album-header h2 {
    margin: 0;
    font-size: 3.75rem;
    color:#fff;
  }

  .album-header .album-meta {
     display:flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    margin:0 0 2rem 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
  }


</style>