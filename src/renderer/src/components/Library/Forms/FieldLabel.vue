

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
  })

</script>

<template>
    <label :class="['field-label']">
        {{ text }}
    </label>
</template>

<style lang="scss" scoped>
    .field-label{
        display:block;
        margin-bottom:0.5rem;
        font-weight:500;
        color:#fff;
        opacity:0.8;
    }
</style>
 