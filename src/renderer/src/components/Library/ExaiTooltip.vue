

<script setup>
    import { ref, computed, toRefs, watch, nextTick, onMounted } from 'vue'

    const props = defineProps({
        text: { 
            type: String, 
            required: true 
        },
        placement: { 
            type: String, 
            default: 'top',
            docs:{
                validation:'_',
                description:'Placement for tooltip. Includes variables for top, bottom, left, right'
            }
        }
    
    });

    const { text, placement } = toRefs(props);

    const isVisible = ref(false);
    const triggerRect = ref(null);
    const tooltipRect = ref(null);
    const currentPlacement = ref(placement.value);

    const tooltipRef = ref(null);
    const wrapperRef = ref(null);

    const showTooltip = (event) => {
        if (!wrapperRef.value) return;
        triggerRect.value = wrapperRef.value.getBoundingClientRect();
        currentPlacement.value = placement.value;
        isVisible.value = true;

        // Wait for DOM to render, then check for collisions
        nextTick(() => {
            if (tooltipRef.value) {
            tooltipRect.value = tooltipRef.value.getBoundingClientRect();
            checkCollision();
            }
        });
    };

    const hideTooltip = () => {
        isVisible.value = false;
        triggerRect.value = null;
        tooltipRect.value = null;
    };

    const checkCollision = () => {
        if (!triggerRect.value || !tooltipRect.value) return;

        const tRect = triggerRect.value;
        const tipRect = tooltipRect.value;
        const padding = 8; // Distance from edges

        // Check Right Collision
        if (currentPlacement.value === 'right' && tRect.right + tipRect.width + padding > window.innerWidth) {
            currentPlacement.value = 'left';
        }
        // Check Left Collision
        else if (currentPlacement.value === 'left' && tRect.left - tipRect.width - padding < 0) {
            currentPlacement.value = 'right';
        }
        // Check Bottom Collision
        else if (currentPlacement.value === 'bottom' && tRect.bottom + tipRect.height + padding > window.innerHeight) {
            currentPlacement.value = 'top';
        }
        // Check Top Collision
        else if (currentPlacement.value === 'top' && tRect.top - tipRect.height - padding < 0) {
            currentPlacement.value = 'bottom';
        }
    };

    const computedStyle = computed(() => {
        if (!triggerRect.value || !tooltipRect.value) return {};

        const tRect = triggerRect.value;
        const tipRect = tooltipRect.value;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const offset = 10;

        let top = 0;
        let left = 0;

        switch (currentPlacement.value) {
            case 'top':
                top = tRect.top + scrollY - tipRect.height - offset;
                left = tRect.left + scrollX + (tRect.width / 2) - (tipRect.width / 2);
            break;
            case 'bottom':
                top = tRect.bottom + scrollY + offset;
                left = tRect.left + scrollX + (tRect.width / 2) - (tipRect.width / 2);
            break;
            case 'left':
                top = tRect.top + scrollY + (tRect.height / 2) - (tipRect.height / 2);
                left = tRect.left + scrollX - tipRect.width - offset;
            break;
            case 'right':
                top = tRect.top + scrollY + (tRect.height / 2) - (tipRect.height / 2);
                left = tRect.right + scrollX + offset;
            break;
        }

        return {
            top: `${top}px`,
            left: `${left}px`
        };
    });

  onMounted(() => {})

</script>

<template>
    <div 
        :class="['exai-tooltip-container']"
        ref="wrapperRef"
        @mouseenter="showTooltip" 
        @mouseleave="hideTooltip"
        @focusin="showTooltip"
        @focusout="hideTooltip"
        >
        <slot />

        <Teleport to="body">
            <div 
                v-if="isVisible"
                ref="tooltipRef"
                class="exai-tooltip"
                :style="computedStyle"
                >
                {{ text }}
            </div>
        </Teleport>
    </div>
</template>

<style lang="scss" scoped>
    .exai-tooltip-container {
        position: relative;
        display: inline-block;
        display: flex;
        align-items: center;
    }

    .exai-tooltip {
        position: absolute;
        z-index: 1000;
        background-color: #000;
        color: #fff;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.875rem;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    // /* Positioning variants */
    // .tooltip-box.top { bottom: 125%; }
    // .tooltip-box.bottom { top: 125%; }

    /* Fade animation */
    // .fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
    // .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>