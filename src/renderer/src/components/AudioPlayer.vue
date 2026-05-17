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
   console.log('currentTrack', currentTrack.value)
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
  console.log('currentTrack', currentTrack.value)
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
      <audio-controls>
        <template v-slot:audioControlsLeft>
          <div class="track-details">
            <exai-image :images="[]" :size="'xsmall'" />
            <div>
              <div>{{ currentTrack ? currentTrack.displayName : 'No Selection' }}</div>
              <div class="track-number"> {{ currentTrackIndex + 1 }}/{{ audioFiles.length }}</div>
            </div>
          </div>
          
        </template>
        <template v-slot:audioControlsCenter>
          <audio-controls-progress-bar
            :duration="duration"
            :currentTime="currentTime"
            @emitProgressUpdate="seekTo"
          />
          <audio-controls-actions>
            <audio-controls-random-btn
              text="Random"
              :disabled="audioFiles.length === 0"
              @emitRandom="() => { console.log('Random button clicked') }"
            />
            <audio-controls-prev-btn
              text="Previous"
              :disabled="audioFiles.length === 0"
              @emitPrev="prevTrack"
            />
            <audio-controls-play-btn
              text="Play/Pause"
              :disabled="audioFiles.length === 0" 
              :isPlaying="isPlaying"
              @playPause="togglePlayPause"
            />
            <audio-controls-next-btn
              text="Next"
              :disabled="audioFiles.length === 0"
              @emitNext="nextTrack"
            />
            <audio-controls-repeat-btn
              text="Repeat"
              :disabled="audioFiles.length === 0"
              @emitRepeat="() => { console.log('Repeat button clicked') }"
            />
          </audio-controls-actions>
        </template>
        <template v-slot:audioControlsRight>
          <audio-controls-volume
            :modelValue="volume"
            @emitVolumeChange="handleVolumeChange"
          />
        </template>
      </audio-controls>     
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  background-color:#181818ff;
  color: white;
  padding: 12px 16px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.player-container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  padding:10px 10px 0px 10px;
  height:85px;
}



.track-details{
  display:flex;
  flex-direction: row;
  gap:14px;
  align-items: flex-start;
}


.track-number {
  font-size: 13px;
  opacity:0.7;
}


/* .time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
} */

</style>
