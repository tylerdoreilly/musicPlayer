

<script setup>
  import { computed, toRefs, onMounted } from 'vue'
  import HeaderImage from '@renderer/components/Library/HeaderImage.vue';

 const props = defineProps({
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

  const { artist } = toRefs(props);

  const artistAlbums = computed(() => artist.value?.albums || {})

  const albumCount = computed(() => {
    return Object.keys(artistAlbums.value).length
  })

  const trackCount = computed(() => {
    return Object.values(artistAlbums.value).reduce((total, album) => {
      return total + Object.keys(album.tracks || {}).length
    }, 0)
  })

  onMounted(() => {
    console.log('selected artist', artist.value)
})

</script>

<template>
    <div class="artist-header">
      <HeaderImage :images="artist.artistImages" />
      <div>
        <h2>{{ artist.name }}</h2>
           
        <p class="artist-meta">
            {{ albumCount }} album{{ albumCount !== 1 ? 's' : '' }} · {{ trackCount }} track{{ trackCount !== 1 ? 's' : '' }}
        </p>
             <!-- <p class="artist-meta">ID: {{ selectedArtist.id }}</p>
            <p v-if="selectedArtist.folderPath" class="artist-meta">Folder: {{ selectedArtist.folderPath }}</p> -->
      </div>
    </div>
</template>

<style lang="scss" scoped>
  .artist-header{
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

  .artist-header h2 {
    margin: 0;
    font-size: 3.75rem;
    color:#fff;
  }

  .artist-header .artist-meta {
    margin: 0.25rem 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
  }

</style>