<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  audioFiles: { type: Array, default: () => [] },
  selectedPath: { type: String, default: '' }
})

const audioElement = ref(null)
const currentTrackIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const audioFiles = ref([])
const shouldPlayOnMount = ref(false)

const currentTrack = computed(() => audioFiles.value[currentTrackIndex.value])
const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
}

const mimeTypes = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac'
}

function getMimeType(file) {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
  return mimeTypes[extension] || 'audio/mpeg'
}

function loadTrack(index) {
  if (!audioFiles.value[index]) return
  currentTrackIndex.value = index
  if (audioElement.value) {
    audioElement.value.src = audioFiles.value[index].url
    audioElement.value.load()
    currentTime.value = 0
  }
}

function play() {
  if (!audioElement.value) {
    shouldPlayOnMount.value = true
    return
  }

  audioElement.value
    .play()
    .then(() => {
      isPlaying.value = true
    })
    .catch((error) => {
      console.error('Play error:', error)
      isPlaying.value = false
    })
}

function pause() {
  if (audioElement.value) {
    audioElement.value.pause()
    isPlaying.value = false
  }
}

function togglePlayPause() {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

function nextTrack() {
  if (currentTrackIndex.value < audioFiles.value.length - 1) {
    currentTrackIndex.value++
    loadTrack(currentTrackIndex.value)
    play()
  }
}

function prevTrack() {
  if (currentTrackIndex.value > 0) {
    currentTrackIndex.value--
    loadTrack(currentTrackIndex.value)
    play()
  }
}

function seekTo(newTime) {
  if (audioElement.value) {
    audioElement.value.currentTime = newTime
  }
}

function handleTimeUpdate() {
  currentTime.value = audioElement.value?.currentTime || 0
}

function handleLoadedMetadata() {
  duration.value = audioElement.value?.duration || 0
}

function handleEnded() {
  // Auto-play next track when current track ends
  if (currentTrackIndex.value < audioFiles.value.length - 1) {
    nextTrack()
  } else {
    isPlaying.value = false
    // Dispatch event to notify other components that playback ended
    window.dispatchEvent(new CustomEvent('track-ended'))
  }
}

function handlePlayTrack(event) {
  const { track, tracklist } = event.detail
  // Convert library track format to AudioPlayer format
  const audioFile = {
    name: track.fileName || track.title,
    path: track.filePath,
    url: `file://${track.filePath}`,
    displayName: track.title
  }

  // Update audioFiles to the current tracklist
  audioFiles.value = tracklist.map(([title, t]) => ({
    name: t.fileName || t.title,
    path: t.filePath,
    url: `file://${t.filePath}`,
    displayName: t.title
  }))

  // Find and play the selected track
  const index = audioFiles.value.findIndex(f => f.path === audioFile.path)
  if (index >= 0) {
    loadTrack(index)
    play()
  }
}

function handlePauseTrack() {
  pause()
}

function handleResumeTrack() {
  play()
}

function handleVolumeChange(event) {
  volume.value = parseFloat(event.target.value)
  if (audioElement.value) {
    audioElement.value.volume = volume.value
  }
}

watch(
  () => props.audioFiles,
  (newFiles) => {
    audioFiles.value = newFiles
    if (!newFiles.length) {
      currentTrackIndex.value = 0
      if (audioElement.value) {
        audioElement.value.src = ''
      }
      return
    }

    const selectedIndex = newFiles.findIndex((file) => file.path === props.selectedPath)
    if (selectedIndex >= 0) {
      loadTrack(selectedIndex)
      return
    }

    loadTrack(0)
  },
  { immediate: true }
)

watch(
  () => props.selectedPath,
  (newPath) => {
    if (!newPath || !audioFiles.value.length) return
    const index = audioFiles.value.findIndex((file) => file.path === newPath)
    if (index >= 0) {
      loadTrack(index)
      if (audioElement.value) {
        play()
      } else {
        shouldPlayOnMount.value = true
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (audioElement.value) {
    audioElement.value.addEventListener('timeupdate', handleTimeUpdate)
    audioElement.value.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioElement.value.addEventListener('ended', handleEnded)

    if (audioFiles.value.length && audioFiles.value[currentTrackIndex.value]) {
      loadTrack(currentTrackIndex.value)
    }

    if (shouldPlayOnMount.value) {
      shouldPlayOnMount.value = false
      play()
    }
  }

  // Add custom event listeners for track control
  window.addEventListener('play-track', handlePlayTrack)
  window.addEventListener('pause-track', handlePauseTrack)
  window.addEventListener('resume-track', handleResumeTrack)
})

onBeforeUnmount(() => {
  if (audioElement.value) {
    audioElement.value.removeEventListener('timeupdate', handleTimeUpdate)
    audioElement.value.removeEventListener('loadedmetadata', handleLoadedMetadata)
    audioElement.value.removeEventListener('ended', handleEnded)
  }

  // Remove custom event listeners
  window.removeEventListener('play-track', handlePlayTrack)
  window.removeEventListener('pause-track', handlePauseTrack)
  window.removeEventListener('resume-track', handleResumeTrack)
})
</script>

<template>
  <div class="audio-player">
    <audio ref="audioElement" @timeupdate="handleTimeUpdate" @loadedmetadata="handleLoadedMetadata" @ended="handleEnded"></audio>

    <div class="player-container">
      <!-- Current Track Info -->
      <div v-if="currentTrack" class="track-info">
        <span class="track-name">{{ currentTrack.displayName }}</span>
        <span class="track-position">
          {{ currentTrackIndex + 1 }} / {{ audioFiles.length }}
        </span>
      </div>

      <!-- Progress Bar -->
      <div v-if="duration" class="progress-container">
        <input
          type="range"
          min="0"
          :max="duration"
          :value="currentTime"
          @input="seekTo($event.target.value)"
          class="progress-bar"
        />
        <span class="time">{{ formattedCurrentTime }} / {{ formattedDuration }}</span>
      </div>

      <!-- Controls -->
      <div class="controls">
        <button @click="prevTrack" class="control-btn" :disabled="audioFiles.length === 0" title="Previous track">
          ⏮️
        </button>
        <button @click="togglePlayPause" class="control-btn play-btn" :disabled="audioFiles.length === 0" title="Play/Pause">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button @click="nextTrack" class="control-btn" :disabled="audioFiles.length === 0" title="Next track">
          ⏭️
        </button>

        <!-- Volume Control -->
        <div class="volume-control">
          <label for="volume">🔊</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="volume"
            @input="handleVolumeChange"
            class="volume-slider"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  background: #1b1b1f;
  color: white;
  padding: 12px 16px;
  border-top: 2px solid #374151;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.player-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}

.track-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.track-name {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.track-position {
  margin-left: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  cursor: pointer;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-bar::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.control-btn {
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.3);
  font-size: 16px;
}

.play-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.4);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.volume-slider {
  width: 80px;
  height: 3px;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
}
</style>
