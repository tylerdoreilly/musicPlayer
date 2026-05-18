

<script setup>
    import { computed, toRefs, onMounted } from 'vue'

    const props = defineProps({
        icon:{
            type: String,
            docs:{
                validation:'_',
                description:'Icon name'
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
            default:'Fas',
            docs:{
                validation:'_',
                description:'Button variation. Includes variables for Fas, far'

            }
        },
    });

    const { icon, size, variation } = toRefs(props);

    const sizeModifiers = computed(() =>{
        return {
            'exai-icon--sm': size.value == 'small',
            'exai-icon--md': size.value == 'medium',
            'exai-icon--lg': size.value == 'large'
        }
    });

    onMounted(() => {})

</script>

<template>
    <font-awesome-icon 
        :icon="[variation, icon]" 
        :class="['exai-icon', sizeModifiers]"
    />
</template>

<style lang="scss" scoped>
    .exai-icon {
        cursor:pointer;
        &--sm{
            font-size: 0.75rem; 
        }

        &--md{
            width: 1.5rem;
            height: 1.5rem;
            font-size: 0.85rem;
        }
    }
   
</style>