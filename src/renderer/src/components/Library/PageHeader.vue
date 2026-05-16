

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
    <div class="page-header">
        <div class="page-header__left">
           <span class="page-header__title">{{  text }}</span>
        </div>
        <div class="page-header__right">
          <slot name="pageHeaderActions"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .page-header{
        display:flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        gap:8px;
        padding: 2rem 2rem 1rem 2rem;
        min-height:180px;
        height:220px;
        background: linear-gradient(0deg,rgba(25, 25, 25, 0.43) 0%, rgba(252, 176, 69, 0) 100%);
         border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .page-header__title{
        font-size: 3.75rem;
        font-weight:600;
        color:#fff;
    }

    .page-header__left{
       display:flex;
       align-items:center;
       justify-content: flex-start; 
       gap:8px; 
    }

    .page-header__right{
       display:flex;
       align-items:center;
       justify-content: flex-end; 
       gap:8px; 
    }
</style>