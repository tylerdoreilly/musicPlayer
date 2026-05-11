

<script setup>
 import { computed, toRefs, onMounted } from 'vue'

 const props = defineProps({
    data:{
      type: Array,
      docs:{
        validation:'_',
        description:'Icon size'
      }
    },
   
  });

  const { data } = toRefs(props);

  onMounted(() => {
    console.log('scores',data.value)
})

</script>

<template>
    <div class="tags">
        <div class="tag" v-for="(item, index) in data" :key="index">
            <span>{{ item }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .tags{
        display:flex;
        flex-direction: row;
        gap:8px;
        margin-bottom:8px;
    }

    .tag{
        display:flex;
        padding:2px 8px;
        border-radius:4px;
        background-color: #9feaf9;
        color:#1b1b1f;
        font-size:0.875rem;
    }
   

</style>