

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  const $emit = defineEmits(['emitNext'])

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

  const clickAction = () => {
    $emit('emitNext')
  }

  const { text, size, variation, disabled, isPlaying } = toRefs(props);

  const styleeModifiers = computed(() =>{
        return {
            'audio-controls-next-btn--disabled': disabled.value == true,
        }
    });

  onMounted(() => {
  })

</script>

<template>
  <button 
    :class="['audio-controls-next-btn', styleeModifiers]"
    :disabled="disabled" 
    :text="text" 
    @click="clickAction"
    >
      <exai-icon icon="step-forward" />      
  </button>
</template>

<style lang="scss" scoped>
  .audio-controls-next-btn {
    cursor: pointer;
    width: 40px;
    height: 30px;
    background: transparent;
    border: none;
  }

  .audio-controls-next-btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .audio-controls-next-btn .exai-icon{
    color:#fff
  }

  .audio-controls-next-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.4);
  }

</style>