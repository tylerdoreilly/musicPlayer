

<script setup>
    import { computed, toRefs, onMounted } from 'vue'

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
            default:'medium',
            docs:{
                validation:'_',
                description:'Button variation. Includes variables for primary, secondary, danger, fancy'

            }
        },
    });

    const { text, size, variation } = toRefs(props);

    const btnSizeModifiers = computed(() =>{
        return {
            'exai-button--sm': size.value == 'small',
            'exai-button--md': size.value == 'medium',
            'exai-button--lg': size.value == 'large'
        }
    });

    const btnVariationModifiers = computed(() =>{
        return {
            'exai-button--primary': variation.value == 'primary',
            'exai-button--secondary': variation.value == 'secondary',
            'exai-button--danger': variation.value == 'danger',
            'exai-button--fancy': variation.value == 'fancy'
        }
    });

  onMounted(() => {
    //console.log('album images', images.value)
})

</script>

<template>
    <button 
        :class="[ 'exai-button', btnSizeModifiers, btnVariationModifiers ]"
        type="button"
        >
        {{ text }}
    </button>
</template>

<style lang="scss" scoped>
    .exai-button {
        width: auto;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: opacity 0.2s;

        &--fancy{
            color: white;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &--secondary{
            color: white;
            background: rgba(255, 255, 255, 0.15);

            &:hover{
                background-color: #4b5563;
            }
        }

        &--md{
            padding: 0.75rem 1rem;
            font-size: 0.875rem; 
        }
    }
   
</style>