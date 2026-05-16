

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
   
  });

  const { text } = toRefs(props);

  onMounted(() => {
    console.log('section text',text.value)
})

</script>

<template>
    <div class="section-header">
        <div class="section-header__left">
           <span class="section-header__title">{{  text }}</span>
        </div>
        <div class="section-header__right">
          <slot name="sectionHeaderActions"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .section-header{
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap:8px;
        margin-bottom:2rem;
    }

    .section-header__title{
        font-size:1.25rem;
        font-weight:600;
        color:#fff;
    }

    .section-header__left{
       display:flex;
       align-items:center;
       justify-content: flex-start; 
       gap:8px; 
    }

    .section-header__right{
       display:flex;
       align-items:center;
       justify-content: flex-end; 
       gap:10px; 
    }
</style>