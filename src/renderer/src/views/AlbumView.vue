<script setup>
  import { ref, computed, onMounted } from 'vue'
  import Tracklist from '@renderer/components/Tracklist.vue'
  import AlbumHeader from '@renderer/components/AlbumHeader.vue'

  const props = defineProps({
    artistId: { type: String, required: true },
    id: { type: String, required: true }
  })

  const library = ref(null)

  const selectedArtist = computed(() => {
    if (!library.value?.artists) return null
    return Object.values(library.value.artists).find((artist) => artist.id === props.artistId) || null
  })

  const selectedAlbum = computed(() => {
    if (!selectedArtist.value?.albums) return null
    return Object.values(selectedArtist.value.albums).find((album) => album.id === props.id) || null
  })

  const trackEntries = computed(() => {
    if (!selectedAlbum.value) return []
    return Object.entries(selectedAlbum.value.tracks || {})
  })


  onMounted(() => {
    const savedLibrary = localStorage.getItem('musicLibrary')
    if (savedLibrary) {
      try {
        library.value = JSON.parse(savedLibrary)
      } catch (err) {
        console.error('Error parsing library:', err)
      }
    }
  })
</script>

<template>

  <empty-state 
    v-if="!library" 
    :title="'No music library loaded'" 
    :message="'Please analyze your music folder first.'"
  />

  <empty-state
    v-else-if="!selectedArtist || !selectedAlbum"
    :title="'Album not found'"
    :message="'The requested album could not be found in your music library.'"
  />

  <template v-else>
    <AlbumHeader 
      :album="selectedAlbum" 
      :artist="selectedArtist" 
      >
    </AlbumHeader>
    <page-content>
      <Tracklist :tracks="trackEntries" />
    </page-content>
  </template>

</template>

<style lang="scss" scoped>

</style>
