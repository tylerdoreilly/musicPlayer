<script setup>
import { useAudioPlayer } from '../composables/useAudioPlayer.js'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  tracks: { type: Array, default: () => [] }
})

const { playTrack, togglePlayPause, isTrackPlaying, isTrackPaused } = useAudioPlayer()

const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

const handleTrackClick = (trackTitle, track) => {
  if (isTrackPlaying(track.id) || isTrackPaused(track.id)) {
    togglePlayPause()
  } else {
    playTrack(track, props.tracks)
  }
}

const getPlayIcon = (trackId) => {
  if (isTrackPlaying(trackId)) {
    return faPause
  }
  return faPlay
}
</script>

<template>
    <div class="tracklist-header">
        <h3 class="tracklist-title">Tracklist</h3>
    </div>
  <div class="tracks-list">
    <div v-for="([trackTitle, track]) in tracks" :key="track.id" class="track-row" @click="handleTrackClick(trackTitle, track)">
      <div class="track-info">
        <font-awesome-icon :icon="getPlayIcon(track.id)" class="play-icon" />
        <div class="track-title-group">
          <span class="track-title">{{ trackTitle }}</span>
        </div>
      </div>
      <span class="track-duration">{{ formatDuration(track.duration) }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.tracklist-header{
    display:flex;
    align-items:center;
    border-bottom:1px solid rgba(255, 255, 255, 0.1);
    margin-bottom:1rem;
}

.tracks-list {
  display: grid;
  gap: 0.75rem;
}

.track-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.track-row:hover {
    background-color:#1b1b1f;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
}

.play-icon {
  color: #374151;
  font-size: 0.875rem;
  width: 1rem;
  text-align: center;
  flex-shrink: 0;
}

.track-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.track-title {
  color: #fff;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-subtitle {
  color: #64748b;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-duration {
  color: #fff;
  font-size: 0.9rem;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>