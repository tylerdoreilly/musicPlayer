

<script setup>
 import { ref, computed, toRefs, onMounted } from 'vue'

 const props = defineProps({
    text: { 
        type: String, 
        required: true 
    },
    position: { 
        type: String, 
        default: 'top' 
    } // top, bottom, left, right
   
  });

  const { text, position } = toRefs(props);

  const isVisible = ref(false);

  onMounted(() => {})

</script>

<template>
    <div 
        :class="['tooltip-container']"
        @mouseenter="isVisible = true" 
        @mouseleave="isVisible = false"
        >
        <slot />

        <Transition name="fade">
            <div v-if="isVisible" :class="['tooltip-box', position]">
                {{ text }}
            </div>
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
    .tooltip-container {
        position: relative;
        display: inline-block;
        display: flex;
        align-items: center;
    }

    .tooltip-box {
        position: absolute;
        background: #000;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 100;
        left: 50%;
        transform: translateX(-50%);
    }

    /* Positioning variants */
    .tooltip-box.top { bottom: 125%; }
    .tooltip-box.bottom { top: 125%; }

    /* Fade animation */
    .fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
    .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>