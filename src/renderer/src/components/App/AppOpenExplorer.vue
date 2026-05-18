

<script setup>
  import { computed, toRefs, onMounted } from 'vue'

  const props = defineProps({
    folderPath:{
      type: String,
      required: true,
      docs:{
        validation:'_',
        description:'Path to the folder to open'
      }
    },
       
  });

  const { folderPath } = toRefs(props);

  const openFolder = () => {
    window.electronAPI.openExplorer(folderPath.value);
  };

  onMounted(() => {
  })

</script>

<template>
  <exai-tooltip text="View in Explorer" placement="top">
    <exai-icon icon="folder" variation="far" @click="openFolder"/>
  </exai-tooltip>
</template>

<style lang="scss" scoped>

</style>