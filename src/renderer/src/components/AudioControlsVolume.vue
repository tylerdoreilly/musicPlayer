

<script setup>
  import { computed, toRefs, onMounted } from 'vue';

  const $emit = defineEmits(["emitVolumeChange"]);

  const props = defineProps({
    modelValue:{
      type: String,
      docs:{
        validation:'_',
        description:'Input Model Value'
      }
    },
   
  });

  const { modelValue } = toRefs(props);

  const emitCVolumeChange = (value) => {
    $emit('emitVolumeChange', value);
  }

  onMounted(() => {
  })

</script>

<template>
  <div class="volume-control">
    <exai-icon icon="volume-up" for="volume"/>  
    <input
      id="volume"
      type="range"
      min="0"
      max="1"
      step="0.1"
      :value="modelValue"
      @input="emitCVolumeChange"
      class="volume-slider"
    />
  </div>
</template>

<style lang="scss" scoped>
    
  .volume-control {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .volume-control .exai-icon {
    width: 20px;
    height: 20px;
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