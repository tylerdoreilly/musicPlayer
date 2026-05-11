<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const library = ref(null)
const expandedArtists = ref(new Set())

const artistsList = computed(() => {
  if (!library.value || !library.value.artists) return []
  return Object.entries(library.value.artists).sort((a, b) => a[0].localeCompare(b[0]))
})

const getAlbumCount = (artist) => {
  return Object.keys(artist.albums || {}).length
}

const getTrackCount = (artist) => {
  let count = 0
  for (const album of Object.values(artist.albums || {})) {
    count += Object.keys(album.tracks || {}).length
  }
  return count
}

const toggleArtist = (artistName) => {
  if (expandedArtists.value.has(artistName)) {
    expandedArtists.value.delete(artistName)
  } else {
    expandedArtists.value.add(artistName)
  }
}

const isArtistExpanded = (artistName) => {
  return expandedArtists.value.has(artistName)
}

const openArtistPage = (artistId) => {
  if (!artistId) return
  router.push({ name: 'artist-detail', params: { id: artistId } })
}

const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
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
  console.log('Loaded library:', library.value)
})
</script>

<template>
  <div class="artists">
    <h2 class="artists-title">
      <i class="fas fa-users"></i> Artists
    </h2>
    
    <div v-if="!library" class="no-library">
      <p>No music library loaded. Please analyze your music folder first.</p>
    </div>

    <div v-else-if="artistsList.length === 0" class="no-artists">
      <p>No artists found in your music library.</p>
    </div>

    <div v-else class="artists-list">
      <div v-for="[artistName, artist] in artistsList" :key="artistName" class="artist-item">
        <div class="artist-header">
          <div class="artist-header-left" @click="toggleArtist(artistName)">
            <i :class="isArtistExpanded(artistName) ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
            <span class="artist-name">{{ artistName }}</span>
            <span class="artist-meta">
              {{ getAlbumCount(artist) }} album{{ getAlbumCount(artist) !== 1 ? 's' : '' }} · 
              {{ getTrackCount(artist) }} track{{ getTrackCount(artist) !== 1 ? 's' : '' }}
            </span>
          </div>

          <button class="artist-detail-button" @click.stop="openArtistPage(artist.id)">
            View artist
          </button>
        </div>

        <div v-if="isArtistExpanded(artistName)" class="artist-content">
          <div v-for="[albumName, album] in Object.entries(artist.albums)" :key="album.id" class="album-item">
            <div class="album-name">
              <i class="fas fa-compact-disc"></i>
              {{ albumName }}
              <span v-if="album.year" class="album-year">({{ album.year }})</span>
            </div>
            <div class="tracks-list">
              <div v-for="[trackTitle, track] in Object.entries(album.tracks)" :key="track.id" class="track-item">
                <span class="track-title">{{ trackTitle }}</span>
                <span class="track-duration">{{ formatDuration(track.duration) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.artists {
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
}

.artists-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.artists-title i {
  margin-right: 0.5rem;
  color: #667eea;
}

.no-library,
.no-artists {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.artists-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.artist-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.artist-header {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.2s;
}

.artist-header:hover {
  opacity: 0.9;
}

.artist-header i:first-child {
  width: 1rem;
  text-align: center;
}

.artist-name {
  font-weight: 600;
  flex: 1;
}

.artist-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  cursor: pointer;
}

.artist-detail-button {
  padding: 0.5rem 0.9rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 0.5rem;
  color: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.artist-detail-button:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-1px);
}

.artist-meta {
  font-size: 0.875rem;
  opacity: 0.9;
}

.artist-content {
  background-color: #f9fafb;
  padding: 1rem;
}

.album-item {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: white;
  border-left: 3px solid #667eea;
  border-radius: 0.25rem;
}

.album-name {
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.album-name i {
  margin-right: 0.5rem;
  color: #667eea;
}

.album-year {
  font-size: 0.875rem;
  color: #666;
  margin-left: 0.5rem;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1rem;
}

.track-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: #555;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.track-item:hover {
  background-color: #f0f0f0;
}

.track-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-duration {
  color: #999;
  margin-left: 1rem;
  font-size: 0.75rem;
}
</style>