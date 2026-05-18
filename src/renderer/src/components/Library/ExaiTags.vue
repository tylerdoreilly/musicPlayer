

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
        padding:2px 6px;
        border-radius:4px;
        background-color: #181818;
        color: rgba(255, 255, 255, 0.7);
        font-size:13px;
    }
   

</style>