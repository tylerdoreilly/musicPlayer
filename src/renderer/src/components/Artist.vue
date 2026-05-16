<script setup>
  import { ref, computed, shallowRef, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import ArtistHeader from '@renderer/components/ArtistHeader.vue'
  import GridView from '@renderer/components/GridView.vue'
  import ListView from '@renderer/components/ListView.vue'
  import { faList, faTh } from '@fortawesome/free-solid-svg-icons'

  const props = defineProps({
    id: { type: String, required: true }
  })

  const router = useRouter()
  const library = ref(null)
  const viewMode = shallowRef(GridView);

  const selectedArtist = computed(() => {
    if (!library.value?.artists) return null
    return Object.values(library.value.artists).find((artist) => artist.id === props.id) || null
  })

  const artistAlbums = computed(() => selectedArtist.value?.albums || {})


  const openAlbumPage = (albumId) => {
    if (!selectedArtist.value || !albumId) return
    router.push({
      name: 'album-detail',
      params: {
        artistId: selectedArtist.value.id,
        id: albumId
      }
    })
  }

  const setViewMode = (mode) => {
    viewMode.value = mode
  }

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
    v-else-if="!selectedArtist"
    :title="'Artist not found'"
    :message="'The requested artist could not be found in your music library.'"
  />
  
  <template v-else>
    <ArtistHeader :artist="selectedArtist" />

    <page-content>
  
      <exai-section-header text="Albums">
          <template #sectionHeaderActions>             
            <font-awesome-icon :icon="faList" class="page-control-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = ListView"/>
            <font-awesome-icon :icon="faTh" class="page-control-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = GridView"/>        
          </template>
      </exai-section-header>
      
      <component 
        :is="viewMode" 
        :data="artistAlbums" 
        @selected="openAlbumPage"
      />

    </page-content> 
    
  </template>

</template>

<style lang="scss" scoped>
 .page-control-btn {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
    font-size: 0.85rem;
    cursor: pointer;
  }
</style>