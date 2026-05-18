

<script setup>
    import { ref, computed, toRefs, onMounted } from 'vue'
    import { getColorSync, getPaletteSync, getSwatches } from 'colorthief';

    const $emit = defineEmits(['colorSelection']);

    const props = defineProps({
        images:{
            type: Array,
            docs:{
                validation:'_',
                description:'Icon size'
            }
        },
        id:{
            type: String,
            default:'default',
            docs:{
                validation:'_',
                description:'Image size'
            }
        },
    });

    const { images, id } = toRefs(props);
    const imageRef = ref(null);
    const gradient = ref('');
    const rgb = ref(null);

    const onImageLoad = () => {
        if (imageRef.value) {
   
            const color = getColorSync(imageRef.value);
            rgb.value = `rgb(${color.array().join(', ')})`; 
            $emit('colorSelection', rgb.value);

            // for Gratient Background
            // const palette = getPaletteSync(imageRef.value, {colorCount: 3});
            // const swatches = getSwatches(imageRef.value);
            // gradient.value = `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
            // useGradientBackground(gradient);
        }
    }

  onMounted(() => {
    console.log('album images', images.value)
})

</script>

<template>
   <div :class="[ 'album-image-container', imageSizeModifiers ]">
        <img 
            v-if="images[0]"
            ref="imageRef" 
            :src="images[0]?.path" 
            alt="Album Cover" 
            class="album-image"
            :id="id"
            @load="onImageLoad"
            crossOrigin="Anonymous"
        />
        <div v-else class="album-placeholder">
            <i class="fas fa-music"></i>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .album-image-container{
        width: 250px;
        height: 250px;
        background: #f8fafc;
        border-radius: 0.5rem;
        flex-shrink: 0;
        overflow: hidden;
    }

    .album-image{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>