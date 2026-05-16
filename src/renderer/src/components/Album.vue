<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Tracklist from './Tracklist.vue'
import Tags from '@renderer/components/Library/Tags.vue'
import AlbumImage from '@renderer/components/Library/AlbumImage.vue'
import HeaderImage from '@renderer/components/Library/HeaderImage.vue'

const props = defineProps({
  artistId: { type: String, required: true },
  id: { type: String, required: true }
})

const router = useRouter()
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

const trackCount = computed(() => trackEntries.value.length)

const goBack = () => {
  router.push({ name: 'artist-detail', params: { id: props.artistId } })
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
  <div class="album-page">

    <div v-if="!library" class="no-library">
      <p>No music library loaded. Please analyze your music folder first.</p>
    </div>

    <div v-else-if="!selectedArtist || !selectedAlbum" class="not-found">
      <p>Album not found.</p>
    </div>

    <div v-else class="album-details">
      <div class="album-header-panel">
        <HeaderImage :images="selectedAlbum.albumImages" />
        <div>
          <h2>{{ selectedAlbum.name }}</h2>
          <div class="album-meta">
                <span class="album-artist">{{ selectedArtist.name }}</span>
                <span>-</span>
                <span>{{ selectedAlbum.year || 'Unknown' }}</span>
                <span>-</span>
                <span>{{ trackCount }} Tracks</span>
          </div>
           <Tags :data="selectedAlbum.genres || []" />
          <!-- <p class="album-meta">ID: {{ selectedAlbum.id }}</p>
          <p v-if="selectedAlbum.folderPath" class="album-meta">Folder: {{ selectedAlbum.folderPath }}</p> -->
        </div>
      </div>
      <div class="album-content">
        <Tracklist :tracks="trackEntries" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.album-page {
  /* margin-top: 1rem; */
  /* padding: 1rem; */
}


.album-header-panel {
    display:flex;
    gap: 1.5rem;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
     padding: 2rem;
    margin-bottom: 1rem;
    color:#fff;
    min-height:400px;
}
.album-content{
      padding: 2rem;
      background:#191919ff;
}

.album-header-panel h2 {
  margin: 0;
  font-size: 2.75rem;
  color: #fff;
}

.album-meta {
    display:flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    margin:0 0 2rem 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
}

.album-artist {
  color: #fff;
  font-weight:bold;
}

.no-library,
.not-found {
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
}
</style>
