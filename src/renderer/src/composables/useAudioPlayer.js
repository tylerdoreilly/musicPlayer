import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentPlayingTrack = ref(null)
const isPlaying = ref(false)
const currentTracklist = ref([])
const currentTrackIndex = ref(-1)

export function useAudioPlayer() {
  const playTrack = (track, tracklist = []) => {
    currentPlayingTrack.value = track
    currentTracklist.value = tracklist
    currentTrackIndex.value = tracklist.findIndex(t => t[1].id === track.id)
    isPlaying.value = true

    // Dispatch custom event that AudioPlayer can listen to
    window.dispatchEvent(new CustomEvent('play-track', {
      detail: { track, tracklist }
    }))
  }

  const pauseTrack = () => {
    isPlaying.value = false
    window.dispatchEvent(new CustomEvent('pause-track'))
  }

  const resumeTrack = () => {
    isPlaying.value = true
    window.dispatchEvent(new CustomEvent('resume-track'))
  }

  const togglePlayPause = () => {
    if (isPlaying.value) {
      pauseTrack()
    } else {
      resumeTrack()
    }
  }

  const playNext = () => {
    if (currentTrackIndex.value < currentTracklist.value.length - 1) {
      const nextIndex = currentTrackIndex.value + 1
      const [nextTrackTitle, nextTrack] = currentTracklist.value[nextIndex]
      playTrack(nextTrack, currentTracklist.value)
    }
  }

  const playPrevious = () => {
    if (currentTrackIndex.value > 0) {
      const prevIndex = currentTrackIndex.value - 1
      const [prevTrackTitle, prevTrack] = currentTracklist.value[prevIndex]
      playTrack(prevTrack, currentTracklist.value)
    }
  }

  const handleTrackEnded = () => {
    // Auto-play next track when current track ends
    playNext()
  }

  const isTrackPlaying = (trackId) => {
    return currentPlayingTrack.value?.id === trackId && isPlaying.value
  }

  const isTrackPaused = (trackId) => {
    return currentPlayingTrack.value?.id === trackId && !isPlaying.value
  }

  onMounted(() => {
    window.addEventListener('track-ended', handleTrackEnded)
  })

  onUnmounted(() => {
    window.removeEventListener('track-ended', handleTrackEnded)
  })

  return {
    currentPlayingTrack: computed(() => currentPlayingTrack.value),
    isPlaying: computed(() => isPlaying.value),
    currentTracklist: computed(() => currentTracklist.value),
    currentTrackIndex: computed(() => currentTrackIndex.value),
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    isTrackPlaying,
    isTrackPaused
  }
}