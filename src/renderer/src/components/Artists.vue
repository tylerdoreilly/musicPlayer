<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { faSortAlphaAsc, faSortAlphaDesc, faList, faTh } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const library = ref(null)
const expandedArtists = ref(new Set())
const searchQuery = ref('')
const sortDirection = ref('asc');

const artistsList = computed(() => {
  if (!library.value || !library.value.artists) return []
  return Object.entries(library.value.artists).sort((a, b) => a[0].localeCompare(b[0]))
});

const filteredItems = computed(() => {
  return artistsList.value.filter(([artistName]) =>
    artistName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
});

const processedList = computed(() => {
    // 1. Filter the list
    const filtered = artistsList.value.filter(([artistName]) =>
    artistName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

    // 2. Sort the list
    return [...filtered].sort((a, b) => {
      const modifier = sortDirection.value === 'asc' ? 1 : -1;
      
      // Assuming sorting by a 'name' string property
      if (a[0] < b[0]) return -1 * modifier;
      if (a[0] > b[0]) return 1 * modifier;
      return 0;
    });
  });

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

const openArtistPage = (artistId) => {
  if (!artistId) return
  router.push({ name: 'artist-detail', params: { id: artistId } })
}

 const toggleSort = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  };

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

    <page-header text="Artists" />

    <empty-state 
      v-if="!library" 
      :title="'No music library loaded'" 
      :message="'Please analyze your music folder first.'"
    />

    <empty-state
      v-else-if="artistsList.length === 0"
      :title="'No artists found'"
      :message="'There are no artists in your music library.'"
    />

    <template v-else>
      <page-content>
        <page-controls>
          <template #pageControlsLeft>
            <form-input v-model="searchQuery" placeholder="Search by artist name"/>
          </template>
          <template #pageControlsRight>
            <font-awesome-icon :icon="faSortAlphaAsc" class="page-control-btn" @click="toggleSort" v-if="sortDirection === 'asc'"/> 
            <font-awesome-icon :icon="faSortAlphaDesc" class="page-control-btn" @click="toggleSort" v-else/>
            <font-awesome-icon :icon="faList" class="page-control-btn"/>
            <font-awesome-icon :icon="faTh" class="page-control-btn"/>
          </template>
        </page-controls>

        <div v-for="[artistName, artist] in processedList" :key="artistName" class="artist-item">
          <div class="artist-header">
            <div class="artist-header-left" @click="toggleArtist(artistName)">
              <exai-image :images="artist.artistImages" size="small" />
              <div>
                <div class="artist-name">{{ artistName }}</div>
                <div class="artist-meta">
                  {{ getAlbumCount(artist) }} album{{ getAlbumCount(artist) !== 1 ? 's' : '' }} · 
                  {{ getTrackCount(artist) }} track{{ getTrackCount(artist) !== 1 ? 's' : '' }}
                </div>
              </div>
            </div>

            <button class="artist-detail-button" @click.stop="openArtistPage(artist.id)">
              View artist
            </button>
          </div>
        </div>
      </page-content>
    </template>
  
</template>

<style scoped>


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

.artist-item {
  overflow: hidden;
  border-bottom:1px solid rgba(255, 255, 255, 0.1)
}

.artist-header {
  padding: 1rem;
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