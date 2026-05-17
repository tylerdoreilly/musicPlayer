

<script setup>
    import { computed, toRefs, onMounted } from 'vue'

    const props = defineProps({
        images:{
            type: Array,
            docs:{
                validation:'_',
                description:'Image List'
            }
        },
        size:{
            type: String,
            default:'large',
            docs:{
                validation:'_',
                description:'Image size'
            }
        },
        fallbackIcon:{
            type: String,
            default:'music',
            docs:{
                validation:'_',
                description:'Fallback icon if no images are available'
            }
        }
    });

    const { images, size } = toRefs(props);

    const imageSizeModifiers = computed(() =>{
        return {
            'exai-image-container--sm': size.value == 'small',
            'exai-image-container--md': size.value == 'medium',
            'exai-image-container--lg': size.value == 'large'
        }
    });

    onMounted(() => {})

</script>

<template>
   <div :class="[ 'exai-image-container', imageSizeModifiers ]">
        <img 
            v-if="images[0]"
            :src="images[0]?.path" 
            alt="Album Cover" 
            class="exai-image"
        />
        <div v-else class="exai-image-placeholder">
            <font-awesome-icon :icon="fallbackIcon" class="exai-image-placeholder__icon"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .exai-image-container{
        background: #f8fafc;
        border-radius: 0.5rem;
        flex-shrink: 0;
        overflow: hidden;

        &--sm{
            width: 80px;
            height: 80px;
        }
        &--md{
            width: 150px;
            height: 150px;
        }
        &--lg{
            width: 250px;
            height: 250px;
        }
        &--xl{
            width: 350px;
            height: 350px;
        }
    }

    .exai-image{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .exai-image-placeholder{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        &__icon{
            color: white;
            font-size: 1.8rem;
            opacity: 0.5;
        }
    }

</style>