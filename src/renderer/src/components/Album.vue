<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Tracklist from './Tracklist.vue'


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
        <div class="album-image">
            <img v-if="selectedAlbum.coverUrl" :src="selectedAlbum.coverUrl" alt="Album Cover" class="album-cover" />
            <div v-else class="album-placeholder">
                <i class="fas fa-music"></i>
            </div>
        </div>
        <div>
          <h2>{{ selectedAlbum.name }}</h2>
          <h3 class="album-artist">{{ selectedArtist.name }}</h3>
          <div class="album-meta">
            <span>Year: {{ selectedAlbum.year || 'Unknown' }}</span>
            <span style="margin-left: 1rem;">Tracks: {{ trackCount }}</span>
          </div>
          <!-- <p class="album-meta">ID: {{ selectedAlbum.id }}</p>
          <p v-if="selectedAlbum.folderPath" class="album-meta">Folder: {{ selectedAlbum.folderPath }}</p> -->
        </div>
      </div>

      <Tracklist :tracks="trackEntries" />
    </div>
  </div>
</template>

<style scoped>
.album-page {
  /* margin-top: 1rem; */
  padding: 1rem;
}

.back-button {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: #eff6ff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #1e293b;
  cursor: pointer;
}

.album-header-panel {
    display:flex;;
    gap: 1.5rem;
    flex-direction: row;
    align-items: flex-start;
    padding: 1rem 0;
    margin-bottom: 1rem;
    color:#fff;
}

.album-image {
  width: 150px;
  height: 150px;
  background: #f8fafc;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.album-header-panel h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #fff;
}

.album-meta {
    display:flex;
    gap: 1rem;

  margin: 0.25rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.album-artist {
  margin-top: 0.25rem;
  color: #fff;
  font-size: 1.1rem;
}

.no-library,
.not-found {
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
}
</style>
