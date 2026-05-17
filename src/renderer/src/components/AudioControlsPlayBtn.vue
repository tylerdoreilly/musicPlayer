

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  const $emit = defineEmits(['playPause'])

  const props = defineProps({
        text:{
            type: String,
            docs:{
                validation:'_',
                description:'Button text'
            }
        },
        size:{
            type: String,
            default:'medium',
            docs:{
                validation:'_',
                description:'Button size. Includes variables for small, medium, large'
            }
        },
        variation:{
            type: String,
            default:'main',
            docs:{
                validation:'_',
                description:'Button variation. Includes variables for main or track'

            }
        },
        disabled:{
            type: Boolean,
            default: false,
            docs:{
                validation:'_',
                description:'Button disabled state'
            }
        },
        isPlaying:{
            type: Boolean,
            default: false,
            docs:{
                validation:'_',
                description:'Button disabled state'
            }
        }
  });

  const toggleAction = () => {
    $emit('playPause')
  }

  const { text, size, variation, disabled, isPlaying } = toRefs(props);

  onMounted(() => {
  })

</script>

<template>
  <button 
    :class="['audio-controls-play-btn']"
    :disabled="disabled" 
    :text="text" 
    @click="toggleAction"
    >
      <exai-icon icon="play" v-if="!isPlaying" class="play-icon"/>  
      <exai-icon icon="pause" v-else class="pause-icon" />       
  </button>
</template>

<style lang="scss" scoped>
  .audio-controls-play-btn {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background-color: #FFF;
    border-radius: 50%; 
  }

  .audio-controls-play-btn .exai-icon{
    color:black;
    width: 20px;
    height: 20px;
    margin-top:4px;
    margin-left:2px;
  }

  .audio-controls-play-btn .play-icon{
    margin-top:3px;
    margin-left:2px;
  }

  .audio-controls-play-btn .pause-icon{
    margin-top:2px;
    margin-left:0px;
  }

  .audio-controls-play-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.4);
  }

</style>