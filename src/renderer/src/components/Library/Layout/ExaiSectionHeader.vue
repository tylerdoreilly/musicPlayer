

<script setup>
 import { computed, toRefs, onMounted } from 'vue'

 const props = defineProps({
    text:{
      type: String,
      docs:{
        validation:'_',
        description:'Section Title'
      }
    },
    border:{
      type: Boolean,
      default: false,
      docs:{
        validation:'_',
        description:'Set border bottom for section header'
      }
    },
  });

  const { text, border } = toRefs(props);

  const styleModifiers = computed(() =>{
    return {
      'exai-section-header--border': border.value,
    }
  });

  onMounted(() => {
    console.log('section text',text.value)
})

</script>

<template>
    <div :class="['exai-section-header', styleModifiers]">
        <div :class="['exai-section-header__left']">
           <span :class="['exai-section-header__title']">
            {{  text }}
          </span>
        </div>
        <div :class="['exai-section-header__right']">
          <slot name="sectionHeaderActions"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .exai-section-header{
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap:8px;
        margin-bottom:2rem;

        &__title{
            font-size:1.25rem;
            font-weight:600;
            color:#fff;
        }

        &__left{
           display:flex;
           align-items:center;
           justify-content: flex-start; 
           gap:8px; 
        }

        &__right{
           display:flex;
           align-items:center;
           justify-content: flex-end; 
           gap:10px; 
        }

        &--border{
          border-bottom:1px solid #161618;
        }
    }

</style>