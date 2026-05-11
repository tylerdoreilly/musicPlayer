<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SectionHeader from '@renderer/components/Library/SectionHeader.vue'
import Card from '@renderer/components/Library/Card.vue'

const props = defineProps({
  id: { type: String, required: true }
})

const router = useRouter()
const library = ref(null)
const viewMode = ref('grid') // 'list' or 'grid'

const selectedArtist = computed(() => {
  if (!library.value?.artists) return null
  return Object.values(library.value.artists).find((artist) => artist.id === props.id) || null
})

const artistAlbums = computed(() => selectedArtist.value?.albums || {})

const albumCount = computed(() => {
  return Object.keys(artistAlbums.value).length
})

const trackCount = computed(() => {
  return Object.values(artistAlbums.value).reduce((total, album) => {
    return total + Object.keys(album.tracks || {}).length
  }, 0)
})

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

const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const goBack = () => {
  router.back()
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
  <div class="artist-page">

    <div v-if="!library" class="no-library">
      <p>No music library loaded. Please analyze your music folder first.</p>
    </div>

    <div v-else-if="!selectedArtist" class="not-found">
      <p>Artist not found.</p>
    </div>
  
    <div v-else class="artist-details">
        <div class="artist-header-panel">
            <div>
            <h2>{{ selectedArtist.name }}</h2>
            <p class="artist-meta">ID: {{ selectedArtist.id }}</p>
            <p class="artist-meta">
                {{ albumCount }} album{{ albumCount !== 1 ? 's' : '' }} · {{ trackCount }} track{{ trackCount !== 1 ? 's' : '' }}
            </p>
            <p v-if="selectedArtist.folderPath" class="artist-meta">Folder: {{ selectedArtist.folderPath }}</p>
            </div>
        </div>

        <SectionHeader text="Albums">
            <template #sectionHeaderActions>
                <div class="display-options">
                    <button 
                    class="display-option-button" 
                    :class="{ active: viewMode === 'list' }"
                    @click="setViewMode('list')"
                    >
                    List View
                    </button>
                    <button 
                    class="display-option-button" 
                    :class="{ active: viewMode === 'grid' }"
                    @click="setViewMode('grid')"
                    >
                    Grid View
                    </button>
                </div>
            </template>
        </SectionHeader>      

        <div v-if="viewMode === 'list'" class="albums-list">
            <div v-for="([albumName, album]) in Object.entries(artistAlbums)" :key="album.id" class="album-card" @click="openAlbumPage(album.id)">
            <div class="album-card-header">
                <div>
                <h3>{{ album.name }}</h3>
                <p class="album-meta">{{ Object.keys(album.tracks || {}).length }} track{{ Object.keys(album.tracks || {}).length !== 1 ? 's' : '' }}</p>
                </div>
                <span class="album-year">{{ album.year || 'Unknown year' }}</span>
            </div>
            </div>
        </div>

        <div v-if="viewMode === 'grid'" class="albums-grid">
            <template v-for="([albumName, album]) in Object.entries(artistAlbums)" :key="album.id">
                <Card @click="openAlbumPage(album.id)">
                    <template #cardHeader>
                        <h3>{{ album.name }}</h3>
                    </template>
                    <template #cardContent>
                        <span class="album-year">{{ album.year || 'Unknown year' }}</span>
                        <p class="album-meta">{{ Object.keys(album.tracks || {}).length }} track{{ Object.keys(album.tracks || {}).length !== 1 ? 's' : '' }}</p>
                    </template>
                </Card>
            </template>
        </div>
    </div>
  </div>
</template>

<style scoped>
.artist-page {
  margin-top: 1rem;
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

.artist-header-panel {
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.artist-header-panel h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #111827;
}

.artist-meta {
  margin: 0.25rem 0;
  color: #475569;
  font-size: 0.95rem;
}

.display-options {
  display: flex;
  gap: 0.5rem;
}

.display-option-button {
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.display-option-button:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.display-option-button.active {
  background: #3b82f6;
  border-color: #2563eb;
  color: white;
}

.display-option-button.active:hover {
  background: #2563eb;
}

.albums-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.albums-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}

.album-card {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  max-width: 280px;
  flex: 1 1 auto;
  min-width: 200px;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .album-card {
    max-width: 100%;
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .albums-grid {
    gap: 0.75rem;
  }

  .album-card {
    padding: 0.75rem;
    min-width: 120px;
  }
}

.album-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  background: #ffffff;
}

.album-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.album-card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1f2937;
}

.album-meta {
  margin: 0.25rem 0 0;
  color: #64748b;
}

.album-year {
  color: #334155;
  font-weight: 600;
}

.album-tracks {
  display: grid;
  gap: 0.75rem;
}

.track-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
}

.track-title {
  color: #0f172a;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 1rem;
}

.track-duration {
  color: #475569;
  font-size: 0.9rem;
}

.no-library,
.not-found {
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
}
</style>