

<script setup>
  import { computed, toRefs, onMounted } from 'vue';

  const $emit = defineEmits(["emitProgressUpdate"]);

  const props = defineProps({
    duration:{
      type: Number,
      docs:{
        validation:'_',
        description:'Input Model Value'
      }
    },
    currentTime:{
      type: Number,
      docs:{
        validation:'_',
        description:'Input Model Value'
      }
    },
  });

  const { duration, currentTime } = toRefs(props);

  const formattedCurrentTime = computed(() => formatTime(currentTime.value))
  const formattedDuration = computed(() => formatTime(duration.value))

  function formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  const emitProgressUpdate = (value) => {
    $emit('emitProgressUpdate', value);
  }

  onMounted(() => {
  })

</script>

<template>
  <div class="progress-container"> 
    <div class="progress-data">{{ formattedCurrentTime }}</div>

    <input
      type="range"
      min="0"
      :max="duration"
      :value="currentTime"
      @input="emitProgressUpdate"
      class="progress-bar"
    />            

    <div class="progress-data">{{ formattedDuration }}</div>
  </div>
</template>

<style lang="scss" scoped>
    
  .progress-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    width:530px;
    margin: 0 auto;
  }

  .progress-bar {
    width: 450px;
    height: 4px;
    border-radius: 2px;
    cursor: pointer;
    appearance: none;
    background: rgba(255, 255, 255, 0.2);
    outline: none;
    display:flex;
    flex-grow: 1; 
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

  .progress-data{
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
</style>